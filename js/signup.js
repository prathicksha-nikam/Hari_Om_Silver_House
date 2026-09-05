import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRy1gUvPbFvV8DDKWEJHqYHpBK6gxvWMM",
  authDomain: "hari-om-silver-house.firebaseapp.com",
  databaseURL: "https://hari-om-silver-house-default-rtdb.firebaseio.com",
  projectId: "hari-om-silver-house",
  storageBucket: "hari-om-silver-house.firebasestorage.app",
  messagingSenderId: "569332331985",
  appId: "1:569332331985:web:e70526cd0cb427cb979cf0",
  measurementId: "G-358SX2WRW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

// 1. Automatically check if the user is already logged in when the page loads
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is already signed in, redirect them to main page
    window.location.href = "index.html"; 
  }
});

// 2. Function to handle Sign Up
async function signUpUser(email, password) {
  try {
    // Set persistence to LOCAL so the session persists even after closing the browser
    await setPersistence(auth, browserLocalPersistence);
    
    // Create new user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Sign up successful!");
    
    // Redirect to home page
    window.location.href = "index.html";
  } catch (error) {
    alert("Error signing up: " + error.message);
  }
}

// 3. Attach event listener to your submit button
document.getElementById("submit")?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (email && password) {
    signUpUser(email, password);
  } else {
    alert("Please enter both email and password.");
  }
});
