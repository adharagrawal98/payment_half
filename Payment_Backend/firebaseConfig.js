import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBK7p7xGI8uDQVmwrQRi5bcbxsdQNSfAXo",
    authDomain: "charity-439513.firebaseapp.com",
    projectId: "charity-439513",
    storageBucket: "charity-439513.appspot.com",
    messagingSenderId: "699786811445",
    appId: "1:699786811445:web:2cf0292916551d1d6c397c",
    measurementId: "G-XTTNQ4Q5TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// Export auth, provider, and db
export { auth, provider, db }; // Export db along with auth and provider