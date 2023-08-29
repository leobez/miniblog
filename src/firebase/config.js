// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjZ_enGDPfePiW3vQwS1pW0IzCICBxthE",
  authDomain: "minblog-68141.firebaseapp.com",
  projectId: "minblog-68141",
  storageBucket: "minblog-68141.appspot.com",
  messagingSenderId: "19201899426",
  appId: "1:19201899426:web:896d0c125fa95d0edcd0fb",
  measurementId: "G-6TZZBJCT5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}