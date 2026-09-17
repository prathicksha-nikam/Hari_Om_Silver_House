// Firebase Firestore handler for Booking Requests
import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const dateInput = document.getElementById("datetime");
  const phoneInput = document.getElementById("phone");
  const serviceTypeSelect = document.getElementById("serviceType");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("bookingSubmitBtn");
  const alertBox = document.getElementById("bookingAlert");

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

  // Pre-fill fields if user is authenticated with Firebase
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (emailInput && !emailInput.value) emailInput.value = user.email || "";
      if (nameInput && !nameInput.value && user.displayName) nameInput.value = user.displayName;
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const customerName = nameInput ? nameInput.value.trim() : "";
      const customerEmail = emailInput ? emailInput.value.trim() : "";
      const bookingDate = dateInput ? dateInput.value.trim() : "";
      const customerPhone = phoneInput ? phoneInput.value.trim() : "";
      const serviceType = serviceTypeSelect ? serviceTypeSelect.value : "";
      const specialRequest = messageInput ? messageInput.value.trim() : "";

      // Validate required fields
      if (!customerName) {
        showAlert("Please enter your name.", "danger");
        return;
      }
      if (!customerEmail) {
        showAlert("Please enter your email.", "danger");
        return;
      }
      if (!bookingDate) {
        showAlert("Please select a requested date and time.", "danger");
        return;
      }
      if (!customerPhone) {
        showAlert("Please enter your contact phone number.", "danger");
        return;
      }
      if (!serviceType) {
        showAlert("Please select a service type.", "danger");
        return;
      }

      // UI Loading state
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Book Now";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...`;
      }

      try {
        // Save booking request to Firestore collection 'booking_requests'
        // Capturing: user's name, contact details (phone, email), requested date, service type
        const bookingData = {
          name: customerName,
          contactDetails: `${customerPhone} / ${customerEmail}`,
          phone: customerPhone,
          email: customerEmail,
          requestedDate: bookingDate,
          date: bookingDate,
          serviceType: serviceType,
          specialRequest: specialRequest || "",
          createdAt: serverTimestamp(),
          timestamp: new Date().toISOString(),
          status: "pending"
        };

        const docRef = await addDoc(collection(db, "booking_requests"), bookingData);
        console.log("Booking request saved with ID:", docRef.id);

        showAlert(`Booking request submitted successfully for ${serviceType}! Confirmation Reference: ${docRef.id}. Our team will contact you shortly.`, "success");
        bookingForm.reset();
      } catch (error) {
        console.error("Error saving booking request:", error);
        showAlert("Failed to submit booking: " + (error.message || "Please check your internet connection and try again."), "danger");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});
