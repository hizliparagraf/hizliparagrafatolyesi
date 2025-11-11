import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBiltFmigYTwZdw1paw4sRfoZCpyp9BIoM",
  authDomain: "hizliparagrafatolyesi.firebaseapp.com",
  projectId: "hizliparagrafatolyesi",
  storageBucket: "hizliparagrafatolyesi.firebasestorage.app",
  messagingSenderId: "151714928217",
  appId: "1:151714928217:web:8d5a41e81c9576d463c348"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
