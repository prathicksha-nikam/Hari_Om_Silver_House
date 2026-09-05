// Import Firebase Auth functions (using modular SDK v9+)
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Ensure your Firebase app is initialized elsewhere or initialize here:
// const app = initializeApp(firebaseConfig);
const auth = getAuth();

async function handleSignIn(event) {
  // Prevent page refresh if triggered inside a form
  if (event) event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // Authenticate user with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Show success popup
    alert(`Success! Signed in as: ${user.email}`);

    // Redirect to homepage
    window.location.href = "/"; // Update path if your homepage is 'index.html' or another route
  } catch (error) {
    console.error("Firebase Sign-in Error:", error.code, error.message);
    alert(`Sign-in failed: ${error.message}`);
  }
}

// Attach the handleSignIn function to your submit/login button
document.getElementById("submit").addEventListener("click", handleSignIn);
