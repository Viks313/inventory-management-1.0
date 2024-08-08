// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPdzvdvGuG2d_bPgCrb311xgGMXO6RlXQ",
  authDomain: "inventory-management-75773.firebaseapp.com",
  projectId: "inventory-management-75773",
  storageBucket: "inventory-management-75773.appspot.com",
  messagingSenderId: "71279274460",
  appId: "1:71279274460:web:33f3f881c74b4c5cce0719",
  measurementId: "G-RRVCQEML8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore =getFirestore(app);

export {firestore}