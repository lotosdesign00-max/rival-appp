import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// 1. Add Firebase imports
const imports = `import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, collection, deleteDoc, updateDoc } from 'firebase/firestore';\n`;

content = content.replace(/import { StorageService } from '\.\.\/services\/StorageService';/, `import { StorageService } from '../services/StorageService';\n${imports}`);

// 2. Change state initializers to not rely immediately on StorageService for firestore-synced data
// We'll still use it as fallback/offline cache until snapshot loads.
// Keep existing state definitions but we'll add a useEffect to sync.

content = content.replace(/const \[authProvider, setAuthProvider\] = useState<\'telegram\' \| \'google\' \| null>\(\(\) => [^;]*;/g, `const [authProvider, setAuthProvider] = useState<'telegram' | 'google' | null>('google');`);

// 3. Rewrite login / logout
content = content.replace(/const login = \(provider: 'telegram' \| 'google' = 'telegram', passedUserData\?: any\) => \{[\s\S]*?\};(\r?\n){2}\s*const logout = \(\) => \{[\s\S]*?\};/m, `
  const login = async (provider: 'telegram' | 'google' = 'google', passedUserData?: any) => {
    try {
      const providerAuth = new GoogleAuthProvider();
      await signInWithPopup(auth, providerAuth);
    } catch (err) {
      console.error(err);
      showToast('Error logging in');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setProfile(DEFAULT_PROFILE);
      setOrders([]);
      setFavorites([]);
      setAiHistory([]);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };
`);

// 4. Add useEffect for onAuthStateChanged and onSnapshot
// We'll insert it right after the login/logout declarations.
const syncEffect = `
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setAuthProvider('google');
        
        // Load user profile
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.profile) setProfile(data.profile);
          if (data.settings) setSettings(data.settings);
          if (data.appearance) setAppearance(data.appearance);
          if (data.privacy) setPrivacy(data.privacy);
          if (data.academyProgress) setAcademyProgress(data.academyProgress);
          if (data.aiCredits !== undefined) setAiCredits(data.aiCredits);
          if (data.isPro !== undefined) setIsPro(data.isPro);
          if (data.favorites) setFavorites(data.favorites);
          if (data.recentSearches) setRecentSearches(data.recentSearches);
        } else {
          // Initialize new user
          await setDoc(userRef, {
            ownerId: user.uid,
            profile: { ...DEFAULT_PROFILE, name: user.displayName || 'User', avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl },
            settings: DEFAULT_SETTINGS,
            appearance: DEFAULT_APPEARANCE,
            privacy: DEFAULT_PRIVACY,
            aiCredits: 50,
            isPro: false,
            favorites: [],
            academyProgress: {},
            recentSearches: []
          }, { merge: true });
        }

        // Subscriptions
        const unsubOrders = onSnapshot(collection(db, 'users', user.uid, 'orders'), (snap) => {
          setOrders(snap.docs.map(d => d.data() as OrderRequest));
        });
        const unsubHistory = onSnapshot(collection(db, 'users', user.uid, 'aiHistory'), (snap) => {
          setAiHistory(snap.docs.map(d => d.data() as HistoryItem));
        });
        const unsubNotifications = onSnapshot(collection(db, 'users', user.uid, 'notifications'), (snap) => {
          setNotifications(snap.docs.map(d => d.data() as NotificationItem));
        });

        return () => {
          unsubOrders();
          unsubHistory();
          unsubNotifications();
        };
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Debounced save to Firestore for user document
  useEffect(() => {
    if (!auth.currentUser) return;
    const timeout = setTimeout(() => {
      setDoc(doc(db, 'users', auth.currentUser!.uid), {
        ownerId: auth.currentUser!.uid,
        profile,
        settings,
        appearance,
        privacy,
        academyProgress,
        aiCredits,
        isPro,
        favorites,
        recentSearches
      }, { merge: true }).catch(console.error);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [profile, settings, appearance, privacy, academyProgress, aiCredits, isPro, favorites, recentSearches]);
`;

content = content.replace(/const updateProfile = \(data: Partial<UserProfile>\) => \{/, `${syncEffect}\n  const updateProfile = (data: Partial<UserProfile>) => {`);

// 5. Replace actions to also sync with Firestore where they used arrays
// We'll replace useApp() mutations if they add to array to also write to firestore
content = content.replace(/setOrders\(prev => \[\.\.\.prev, newOrder\]\);/, `setOrders(prev => [...prev, newOrder]);\n      if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid, 'orders', newOrder.id), { ...newOrder, ownerId: auth.currentUser.uid });`);

content = content.replace(/setAiHistory\(prev => \[\.\.\.prev, newItem\]\);/, `setAiHistory(prev => [...prev, newItem]);\n      if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid, 'aiHistory', newItem.id), { ...newItem, ownerId: auth.currentUser.uid });`);

content = content.replace(/setNotifications\(prev => \[\.\.\.prev, newNotif\]\);/, `setNotifications(prev => [...prev, newNotif]);\n      if (auth.currentUser) setDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', newNotif.id), { ...newNotif, ownerId: auth.currentUser.uid });`);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('done');
