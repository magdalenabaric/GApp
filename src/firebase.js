import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCx55FyneOtCymrEeWMwcz0F7YqA85XKo",
  authDomain: "artgallery-17767.firebaseapp.com",
  projectId: "artgallery-17767",
  storageBucket: "artgallery-17767.appspot.com",
  messagingSenderId: "839898479598",
  appId: "1:839898479598:web:2fa0e383ef3165113a6cff",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, db, storage };