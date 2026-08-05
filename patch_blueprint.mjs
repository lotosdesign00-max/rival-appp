import fs from 'fs';
const file = 'firebase-blueprint.json';
const bp = JSON.parse(fs.readFileSync(file, 'utf-8'));

bp.entities.Chat = {
  title: "Chat Session",
  description: "A conversation thread for support, direct messages, or orders.",
  type: "object",
  properties: {
    id: { type: "string" },
    type: { type: "string", enum: ["support", "direct", "order"] },
    orderId: { type: "string" },
    participantId: { type: "string" },
    participantName: { type: "string" },
    participantAvatar: { type: "string" },
    unreadCount: { type: "number" },
    lastMessageText: { type: "string" },
    updatedAt: { type: "string" },
    ownerId: { type: "string" },
    userTypingUntil: { type: "number" },
    adminTypingUntil: { type: "number" }
  },
  required: ["id", "type", "ownerId", "updatedAt"]
};

bp.entities.Message = {
  title: "Chat Message",
  description: "A single message in a chat.",
  type: "object",
  properties: {
    id: { type: "string" },
    text: { type: "string" },
    senderId: { type: "string" },
    timestamp: { type: "string" },
    fileUrl: { type: "string" },
    fileName: { type: "string" },
    fileType: { type: "string" },
    read: { type: "boolean" },
    ownerId: { type: "string" }
  },
  required: ["id", "senderId", "timestamp", "ownerId"]
};

bp.firestore["users/{userId}/chats/{chatId}"] = {
  schema: { $ref: "#/entities/Chat" },
  description: "Chat sessions belonging to the user."
};

bp.firestore["users/{userId}/chats/{chatId}/messages/{messageId}"] = {
  schema: { $ref: "#/entities/Message" },
  description: "Messages within a chat session."
};

fs.writeFileSync(file, JSON.stringify(bp, null, 2));
