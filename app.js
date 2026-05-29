import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// YOUR EXACT CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCkEZY4Rt1ggNJr8yLGdeJheh85HqLdp8k",
  authDomain: "germania-89650.firebaseapp.com",
  projectId: "germania-89650",
  storageBucket: "germania-89650.firebasestorage.app",
  messagingSenderId: "56738516298",
  appId: "1:56738516298:web:2d0f02027d31457a2305b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Grab the HTML elements
const accessKeyInput = document.getElementById("accessKey");
const enterBtn = document.getElementById("enterBtn");
const messageText = document.getElementById("message");

// THE TRICK: Your hidden backend email
const secretEmail = "masterkey@germania.com";

// When button is clicked
enterBtn.addEventListener("click", () => {
  const userAccessKey = accessKeyInput.value;

  // Clear message while loading
  messageText.innerText = "Provjera...";
  messageText.style.color = "#5c5300";

  signInWithEmailAndPassword(auth, secretEmail, userAccessKey)
    .then(() => {
      // SUCCESSFUL LOGIN! Redirect instantly to your app.
      messageText.style.color = "#008237"; // Green
      messageText.innerText = "Pristup odobren. Učitavanje...";

      // REDIRECT MAGIC
      window.location.href = "home.html";
    })
    .catch((error) => {
      // WRONG PASSWORD!
      messageText.style.color = "#df1f26"; // Red
      messageText.innerText = "POGREŠAN KLJUČ. PRISTUP ODBIJEN.";
      accessKeyInput.value = ""; // Clear the box for them to try again
    });
});

// Also allow pressing "Enter" on the keyboard to login
accessKeyInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enterBtn.click();
  }
});
