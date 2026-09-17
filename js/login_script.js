// Firebase Authentication handler for login page
import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged, 
  signOut, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit");
const forgotPassLink = document.getElementById("forgot-password");
const authAlert = document.getElementById("auth-alert");
const userStatusDiv = document.getElementById("user-status");
const loginFormFields = document.getElementById("login-fields");

// Helper: Show alert banner
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
  if (authAlert) {
    authAlert.style.display = "none";
  }
}

// 1. Ensure local session persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Could not enable local persistence:", err);
});

// 2. Track authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    if (userStatusDiv) {
      userStatusDiv.innerHTML = `
        <div class="logged-in-box">
          <p class="mb-2">Signed in as:</p>
          <p class="user-email-badge"><strong>${user.email}</strong></p>
          <div class="mt-3">
            <button id="goHomeBtn" class="signin-button mb-2">Go to Homepage</button>
            <button id="logoutBtn" class="signin-button logout-btn">Log Out</button>
          </div>
        </div>
      `;
      userStatusDiv.style.display = "block";

      document.getElementById("goHomeBtn")?.addEventListener("click", () => {
        window.location.href = "index.html";
      });

      document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        try {
          await signOut(auth);
          showAlert("You have been signed out.", "success");
        } catch (error) {
          showAlert("Error signing out: " + error.message, "danger");
        }
      });
    }

    if (loginFormFields) {
      loginFormFields.style.display = "none";
    }
  } else {
    // User is signed out
    if (userStatusDiv) userStatusDiv.style.display = "none";
    if (loginFormFields) loginFormFields.style.display = "block";
  }
});

// 3. Handle Email/Password Login
async function handleSignIn(event) {
  if (event) event.preventDefault();
  hideAlert();

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value : "";

  if (!email || !password) {
    showAlert("Please enter both email and password.", "danger");
    return;
  }

  // Set loading state
  const originalText = submitBtn ? submitBtn.innerText : "login";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Signing in...";
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    showAlert(`Welcome back, ${user.email}! Redirecting...`, "success");

    // Check for redirect param or go to index.html
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect") || "index.html";

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1200);
  } catch (error) {
    console.error("Firebase Sign-in Error:", error.code, error.message);
    let message = "Sign in failed. Please check your credentials.";

    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        message = "Invalid email or password.";
        break;
      case "auth/user-not-found":
        message = "No account found with this email. Please sign up first.";
        break;
      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;
      case "auth/user-disabled":
        message = "This user account has been disabled.";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later.";
        break;
      default:
        message = error.message || "An error occurred during sign in.";
    }

    showAlert(message, "danger");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  }
}

// 4. Handle Password Reset
async function handleForgotPassword(event) {
  if (event) event.preventDefault();
  hideAlert();

  let email = emailInput ? emailInput.value.trim() : "";
  if (!email) {
    email = prompt("Enter your account email to receive a password reset link:");
    if (email) email = email.trim();
  }

  if (!email) {
    showAlert("Please enter your email to reset password.", "danger");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showAlert(`Password reset link sent to ${email}. Check your inbox!`, "success");
  } catch (error) {
    console.error("Password reset error:", error);
    let msg = error.message;
    if (error.code === "auth/user-not-found") {
      msg = "No account found with that email address.";
    } else if (error.code === "auth/invalid-email") {
      msg = "Invalid email address format.";
    }
    showAlert(msg, "danger");
  }
}

// Attach event listeners
if (submitBtn) {
  submitBtn.addEventListener("click", handleSignIn);
}

if (forgotPassLink) {
  forgotPassLink.addEventListener("click", handleForgotPassword);
}

// Support Enter key press
[emailInput, passwordInput].forEach((input) => {
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSignIn();
      }
    });
  }
});
