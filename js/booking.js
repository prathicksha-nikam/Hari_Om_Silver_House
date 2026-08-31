// 1. Import Firebase SDK functions (Modular Web SDK v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRy1gUvPbFvV8DDKWEJHqYHpBK6gxvWMM",
  authDomain: "hari-om-silver-house.firebaseapp.com",
  projectId: "hari-om-silver-house",
  storageBucket: "hari-om-silver-house.firebasestorage.app",
  messagingSenderId: "569332331985",
  appId: "1:569332331985:web:e70526cd0cb427cb979cf0",
  measurementId: "G-358SX2WRW8"
};

// 3. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Handle Booking Form Submission
const bookingForm = document.getElementById("bookingForm"); // Ensure your <form> has id="bookingForm"

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values (update element IDs to match your HTML input fields)
    const customerName = document.getElementById("name").value;
    const customerEmail = document.getElementById("email").value;
    const bookingDate = document.getElementById("datetime").value;
    const customerphone = document.getElementById("phone").value;

    try {
      // Save data to the "bookings" collection in Firestore
      const docRef = await addDoc(collection(db, "bookings"), {
        name: customerName,
        email: customerEmail,
        date: bookingDate,
        phone: customerphone,
        createdAt: serverTimestamp(),
        status: "confirmed"
      });

      alert("Booking saved successfully! ID: " + docRef.id);
      bookingForm.reset(); // Clear the form inputs
    } catch (error) {
      console.error("Error adding booking: ", error);
      alert("Failed to save booking. Check console for details.");
    }
  });
}
