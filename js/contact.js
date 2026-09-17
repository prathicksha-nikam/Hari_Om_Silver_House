// Firebase Firestore handler for Contact Form
import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const alertBox = document.getElementById("contactAlert");

  // Helper function to display alerts
  function showAlert(message, type = "success") {
    if (!alertBox) {
      alert(message);
      return;
    }
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} mt-3 d-block`;
    alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideAlert() {
    if (alertBox) {
      alertBox.className = "alert d-none";
      alertBox.textContent = "";
    }
  }

  // Pre-fill user data if authenticated
  onAuthStateChanged(auth, (user) => {
    if (user && emailInput && !emailInput.value) {
      emailInput.value = user.email || "";
      if (nameInput && !nameInput.value && user.displayName) {
        nameInput.value = user.displayName;
      }
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const messages = messageInput ? messageInput.value.trim() : "";

      // Validation
      if (!name) {
        showAlert("Please enter your name.", "danger");
        return;
      }
      if (!email) {
        showAlert("Please enter your email address.", "danger");
        return;
      }
      if (!messages) {
        showAlert("Please enter your message.", "danger");
        return;
      }

      // UI Loading state
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;
      }

      try {
        // Save contact inquiry in Firestore collection 'contact_inquiries'
        // Contains fields: name, email, messages
        const inquiryData = {
          name: name,
          email: email,
          messages: messages, // Required field: messages
          message: messages,  // Fallback alias
          subject: subject || "Website Inquiry",
          createdAt: serverTimestamp(),
          timestamp: new Date().toISOString(),
          status: "new"
        };

        const docRef = await addDoc(collection(db, "contact_inquiries"), inquiryData);
        console.log("Contact inquiry saved with ID:", docRef.id);

        showAlert("Thank you! Your message has been sent successfully. We will get back to you soon.", "success");
        contactForm.reset();
      } catch (error) {
        console.error("Error submitting contact inquiry:", error);
        showAlert("Failed to send message: " + (error.message || "Please check your internet connection and try again."), "danger");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});
