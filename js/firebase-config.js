// Central Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBRy1gUvPbFvV8DDKWEJHqYHpBK6gxvWMM",
  authDomain: "hari-om-silver-house.firebaseapp.com",
  databaseURL: "https://hari-om-silver-house-default-rtdb.firebaseio.com",
  projectId: "hari-om-silver-house",
  storageBucket: "hari-om-silver-house.firebasestorage.app",
  messagingSenderId: "569332331985",
  appId: "1:569332331985:web:e70526cd0cb427cb979cf0",
  measurementId: "G-358SX2WRW8"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);
