// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-12a9e.firebaseapp.com",
  projectId: "real-estate-12a9e",
  storageBucket: "real-estate-12a9e.appspot.com",
  messagingSenderId: "138918865333",
  appId: "1:138918865333:web:bdae0e990e9b2b470d51fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);