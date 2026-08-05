import { db, storage, auth } from '../firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  onSnapshot, query, orderBy, 
  where
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';

export interface ChatSession {
  id: string;
  type: 'support' | 'direct' | 'order';
  orderId?: string;
  participantId?: string;
  participantName?: string;
  participantAvatar?: string;
  unreadCount?: number;
  lastMessageText?: string;
  updatedAt?: string;
  ownerId: string;
  userTypingUntil?: number;
  adminTypingUntil?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  timestamp: string;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  read?: boolean;
  ownerId: string;
}

// Local storage fallback helpers for guest/offline mode
const LOCAL_CHATS_KEY = 'rival_local_chats';
const LOCAL_MSGS_PREFIX = 'rival_local_msgs_';

function getLocalChats(): ChatSession[] {
  try {
    const data = localStorage.getItem(LOCAL_CHATS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalChats(chats: ChatSession[]) {
  try {
    localStorage.setItem(LOCAL_CHATS_KEY, JSON.stringify(chats));
  } catch {}
}

function getLocalMessages(chatId: string): ChatMessage[] {
  try {
    const data = localStorage.getItem(LOCAL_MSGS_PREFIX + chatId);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const messageListeners = new Map<string, Set<(messages: ChatMessage[]) => void>>();

function notifyMessageSubscribers(chatId: string) {
  const cbs = messageListeners.get(chatId);
  if (!cbs) return;
  const local = getLocalMessages(chatId);
  cbs.forEach(cb => cb(local));
}

function saveLocalMessages(chatId: string, msgs: ChatMessage[]) {
  try {
    localStorage.setItem(LOCAL_MSGS_PREFIX + chatId, JSON.stringify(msgs));
    notifyMessageSubscribers(chatId);
  } catch {}
}

async function ensureUser() {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    const userRef = doc(db, 'users', cred.user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ownerId: cred.user.uid,
        profile: { name: 'User', avatarUrl: '' }
      }, { merge: true });
    }
    return cred.user;
  } catch (e) {
    console.warn('Firebase Auth anonymous login unavailable, using local fallback:', e);
    return null;
  }
}

function deduplicateChats(chats: ChatSession[]): ChatSession[] {
  const result: ChatSession[] = [];
  const seenSupport = new Set<string>();
  const seenOrders = new Set<string>();
  const seenDirects = new Set<string>();
  const seenIds = new Set<string>();

  const sorted = [...chats].sort((a, b) => {
    const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return tB - tA;
  });

  for (const c of sorted) {
    if (!c || !c.id) continue;
    if (seenIds.has(c.id)) continue;

    const nameLower = (c.participantName || '').toLowerCase();
    const isSupportType = c.type === 'support' || 
      nameLower.includes('support') || 
      nameLower.includes('rival team') || 
      nameLower.includes('rival studio') || 
      nameLower.includes('rival support') || 
      nameLower.includes('студи');

    if (isSupportType) {
      if (seenSupport.has('support_channel')) continue;
      seenSupport.add('support_channel');
      c.type = 'support';
      c.participantName = 'Rival Studio Team';
    } else if (c.type === 'order' && c.orderId) {
      if (seenOrders.has(c.orderId)) continue;
      seenOrders.add(c.orderId);
    } else if (c.type === 'direct' && (c.participantId || c.participantName)) {
      const key = (c.participantId || c.participantName || '').toLowerCase();
      if (seenDirects.has(key)) continue;
      seenDirects.add(key);
    }

    seenIds.add(c.id);
    result.push(c);
  }

  return result;
}

export const ChatService = {
  async getOrCreateChat(type: 'support' | 'direct' | 'order', targetId?: string, participantData?: any): Promise<ChatSession> {
    const user = await ensureUser();
    const localChats = deduplicateChats(getLocalChats());

    const existingLocal = localChats.find(c => {
      if (type === 'support') return c.type === 'support' || c.participantName?.toLowerCase().includes('support') || c.participantName?.toLowerCase().includes('rival');
      if (type === 'order') return c.type === 'order' && c.orderId === targetId;
      return c.type === 'direct' && (c.participantId === targetId || c.participantName === targetId);
    });

    if (user) {
      try {
        const chatsRef = collection(db, 'users', user.uid, 'chats');
        let q;
        if (type === 'order') {
          q = query(chatsRef, where('type', '==', 'order'), where('orderId', '==', targetId));
        } else if (type === 'support') {
          q = query(chatsRef, where('type', '==', 'support'));
        } else {
          q = query(chatsRef, where('type', '==', 'direct'), where('participantId', '==', targetId));
        }
        
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          const chat = { id: snapshot.docs[0].id, ...(docData as Record<string, any>) } as ChatSession;
          const deduped = deduplicateChats([chat, ...localChats]);
          saveLocalChats(deduped);
          return chat;
        }

        if (existingLocal) {
          const chatRef = doc(db, 'users', user.uid, 'chats', existingLocal.id);
          await setDoc(chatRef, existingLocal, { merge: true });
          return existingLocal;
        }
        
        const newChatRef = doc(chatsRef);
        const newChat: ChatSession = {
          id: newChatRef.id,
          type,
          ownerId: user.uid,
          updatedAt: new Date().toISOString(),
          participantName: type === 'support' ? 'Rival Studio Team' : 'Специалист',
          participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
          ...participantData
        };
        if (type === 'order') newChat.orderId = targetId;
        if (type === 'direct') newChat.participantId = targetId;
        
        await setDoc(newChatRef, newChat, { merge: true });
        const deduped = deduplicateChats([newChat, ...localChats]);
        saveLocalChats(deduped);
        return newChat;
      } catch (err) {
        console.warn('Firestore error in getOrCreateChat, falling back to local storage:', err);
      }
    }
    
    if (existingLocal) return existingLocal;

    const localChat: ChatSession = {
      id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type,
      ownerId: user?.uid || 'guest_user',
      updatedAt: new Date().toISOString(),
      participantName: type === 'support' ? 'Rival Studio Team' : 'Специалист',
      participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      ...participantData
    };
    if (type === 'order') localChat.orderId = targetId;
    if (type === 'direct') localChat.participantId = targetId;

    const deduped = deduplicateChats([localChat, ...localChats]);
    saveLocalChats(deduped);
    return localChat;
  },

  subscribeToChats(callback: (chats: ChatSession[]) => void) {
    const user = auth.currentUser;
    if (!user) {
      const local = deduplicateChats(getLocalChats());
      saveLocalChats(local);
      callback(local);
      const interval = setInterval(() => {
        const updated = deduplicateChats(getLocalChats());
        saveLocalChats(updated);
        callback(updated);
      }, 1000);
      return () => clearInterval(interval);
    }
    
    const chatsRef = collection(db, 'users', user.uid, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const fsChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
      const localChats = getLocalChats();
      const combined = deduplicateChats([...fsChats, ...localChats]);
      saveLocalChats(combined);
      callback(combined);
    }, (error) => {
      console.error('Error fetching chats, using local fallback:', error);
      const local = deduplicateChats(getLocalChats());
      saveLocalChats(local);
      callback(local);
    });
  },

  subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
    if (!messageListeners.has(chatId)) {
      messageListeners.set(chatId, new Set());
    }
    const cbs = messageListeners.get(chatId)!;
    cbs.add(callback);

    // Initial delivery of cached local messages immediately
    const initialLocal = getLocalMessages(chatId);
    callback(initialLocal);

    const user = auth.currentUser;
    if (!user || chatId.startsWith('chat_')) {
      const interval = setInterval(() => callback(getLocalMessages(chatId)), 600);
      return () => {
        cbs.delete(callback);
        clearInterval(interval);
      };
    }
    
    const messagesRef = collection(db, 'users', user.uid, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const fsMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as ChatMessage));
      const localMsgs = getLocalMessages(chatId);
      
      const msgMap = new Map<string, ChatMessage>();
      localMsgs.forEach(m => msgMap.set(m.id, m));
      fsMsgs.forEach(m => msgMap.set(m.id, m));
      
      const merged = Array.from(msgMap.values()).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      callback(merged.length > 0 ? merged : localMsgs);
    }, (error) => {
      console.error('Error fetching messages, using local fallback:', error);
      callback(getLocalMessages(chatId));
    });

    return () => {
      cbs.delete(callback);
      unsub();
    };
  },
  
  subscribeToChat(chatId: string, callback: (chat: ChatSession | null) => void) {
    const user = auth.currentUser;
    if (!user || chatId.startsWith('chat_')) {
      const chats = getLocalChats();
      const found = chats.find(c => c.id === chatId) || null;
      callback(found);
      const interval = setInterval(() => {
        const updated = getLocalChats().find(c => c.id === chatId) || null;
        callback(updated);
      }, 1000);
      return () => clearInterval(interval);
    }
    const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
    return onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as ChatSession);
      } else {
        const chats = getLocalChats();
        callback(chats.find(c => c.id === chatId) || null);
      }
    });
  },

  async sendMessage(chatId: string, text: string, file?: File) {
    const user = await ensureUser();
    const ts = new Date().toISOString();
    let fileUrl = '';
    let fileName = '';
    let fileType = '';
    
    if (file) {
      if (user) {
        try {
          const ext = file.name.split('.').pop();
          const refPath = `chats/${chatId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
          const fileRef = ref(storage, refPath);
          await uploadBytesResumable(fileRef, file);
          fileUrl = await getDownloadURL(fileRef);
        } catch (e) {
          fileUrl = URL.createObjectURL(file);
        }
      } else {
        fileUrl = URL.createObjectURL(file);
      }
      fileName = file.name;
      fileType = file.type;
    }

    if (user && !chatId.startsWith('chat_')) {
      try {
        // Ensure chat document exists first with setDoc merge
        const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
        await setDoc(chatRef, {
          id: chatId,
          ownerId: user.uid,
          lastMessageText: file ? (fileType.startsWith('image/') ? '📷 Photo' : '📎 File') : text,
          updatedAt: ts
        }, { merge: true });

        const messagesRef = collection(db, 'users', user.uid, 'chats', chatId, 'messages');
        const newMsgRef = doc(messagesRef);
        
        const message: ChatMessage = {
          id: newMsgRef.id,
          senderId: user.uid,
          timestamp: ts,
          text: text || undefined,
          fileUrl: fileUrl || undefined,
          fileName: fileName || undefined,
          fileType: fileType || undefined,
          read: false,
          ownerId: user.uid
        };
        
        await setDoc(newMsgRef, message);

        // Also update local storage for immediate offline/hybrid availability
        const localMsgs = getLocalMessages(chatId);
        if (!localMsgs.some(m => m.id === message.id)) {
          localMsgs.push(message);
          saveLocalMessages(chatId, localMsgs);
        }
        
        // Auto-reply generator from designer/team
        if (text && text.trim().length > 0) {
          setTimeout(async () => {
            const replyTs = new Date().toISOString();
            const localChats = getLocalChats();
            const chat = localChats.find(c => c.id === chatId);
            const name = chat?.participantName || 'Rival Studio Team';
            
            const replies = [
              `Привет! Отличное сообщение. Я ознакомился с вашей задачей и готов помочь!`,
              `Спасибо за подробности! Я учту эти пожелания при подготовке макета.`,
              `Принято! Скоро отправлю вам варианты дизайна на согласование.`,
              `Все понял, спасибо за уточнение! Напишу сразу, как подготовлю эскиз.`
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyMsg: ChatMessage = {
              id: 'reply_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
              senderId: 'designer_bot',
              timestamp: replyTs,
              text: `[${name}]: ${randomReply}`,
              read: true,
              ownerId: user.uid
            };

            const currentMsgs = getLocalMessages(chatId);
            currentMsgs.push(replyMsg);
            saveLocalMessages(chatId, currentMsgs);

            try {
              const replyRef = doc(collection(db, 'users', user.uid, 'chats', chatId, 'messages'));
              await setDoc(replyRef, replyMsg);
              await setDoc(doc(db, 'users', user.uid, 'chats', chatId), {
                lastMessageText: replyMsg.text,
                updatedAt: replyTs
              }, { merge: true });
            } catch {}
          }, 1200);
        }

        return;
      } catch (err) {
        console.warn('Firestore sendMessage error, falling back to local storage:', err);
      }
    }

    // Local Storage fallback
    const msgs = getLocalMessages(chatId);
    const localMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      senderId: user?.uid || 'guest_user',
      timestamp: ts,
      text: text || undefined,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      fileType: fileType || undefined,
      read: false,
      ownerId: user?.uid || 'guest_user'
    };
    msgs.push(localMsg);
    saveLocalMessages(chatId, msgs);

    const chats = getLocalChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].lastMessageText = file ? (fileType.startsWith('image/') ? '📷 Photo' : '📎 File') : text;
      chats[chatIndex].updatedAt = ts;
      saveLocalChats(chats);
    }
  },
  
  async markAsRead(chatId: string, messageIds: string[]) {
    const user = auth.currentUser;
    if (user && !chatId.startsWith('chat_')) {
      try {
        for (const id of messageIds) {
          const msgRef = doc(db, 'users', user.uid, 'chats', chatId, 'messages', id);
          await updateDoc(msgRef, { read: true });
        }
        const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
        await updateDoc(chatRef, { unreadCount: 0 });
        return;
      } catch {}
    }

    const msgs = getLocalMessages(chatId);
    msgs.forEach(m => {
      if (messageIds.includes(m.id)) m.read = true;
    });
    saveLocalMessages(chatId, msgs);

    const chats = getLocalChats();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
      saveLocalChats(chats);
    }
  },
  
  async setTyping(chatId: string) {
    const user = auth.currentUser;
    if (user && !chatId.startsWith('chat_')) {
      try {
        const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
        await updateDoc(chatRef, {
          userTypingUntil: Date.now() + 3000
        });
      } catch {}
    }
  }
};
