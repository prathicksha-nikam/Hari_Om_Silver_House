// Firebase Authentication handler for signup page
import { auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit");
const authAlert = document.getElementById("auth-alert");

function showAlert(message, type = "danger") {
  if (!authAlert) {
    alert(message);
    return;
  }
  authAlert.textContent = message;
  authAlert.className = `auth-alert alert-${type}`;
  authAlert.style.display = "block";
}

function hideAlert() {
  if (authAlert) authAlert.style.display = "none";
}

// 1. Session Persistence
setPersistence(auth, browserLocalPersistence).catch(console.warn);

// 2. Check if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If user is already authenticated
    console.log("Logged in as:", user.email);
  }
});

// 3. Sign up user
async function signUpUser(email, password) {
  hideAlert();
  if (!email || !password) {
    showAlert("Please enter both email and password.", "danger");
    return;
  }

  if (password.length < 6) {
    showAlert("Password must be at least 6 characters long.", "danger");
    return;
  }

  const originalText = submitBtn ? submitBtn.innerText : "sign up";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Creating account...";
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    showAlert(`Account created successfully! Welcome, ${userCredential.user.email}`, "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  } catch (error) {
    console.error("Firebase Sign-up Error:", error.code, error.message);
    let message = "Sign up failed.";
    if (error.code === "auth/email-already-in-use") {
      message = "This email is already in use. Try logging in instead.";
    } else if (error.code === "auth/weak-password") {
      message = "Password is too weak. Please use at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email address.";
    } else {
      message = error.message;
    }
    showAlert(message, "danger");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  }
}

// Event Listeners
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    signUpUser(email, password);
  });
}

[emailInput, passwordInput].forEach((input) => {
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        signUpUser(email, password);
      }
    });
  }
});
