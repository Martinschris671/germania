import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const eyeIcon = document.getElementById("eyeIcon");
const rememberMeCheckbox = document.getElementById("rememberMe");
const loginForm = document.getElementById("loginForm");
const spinnerBox = document.getElementById("spinnerBox");

// THE TRICK: Your hidden backend email
const secretEmail = "masterkey@germania.com";

// ==========================================
// 1. EYE ICON TOGGLE LOGIC
// ==========================================
eyeIcon.addEventListener("click", () => {
  if (accessKeyInput.type === "password") {
    accessKeyInput.type = "text";
    // Promijeni SVG u "prekriženo oko" (zatvoreno)
    eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
  } else {
    accessKeyInput.type = "password";
    // Vrati SVG u "otvoreno oko"
    eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
  }
});

// ==========================================
// 2. CHECK LOCAL STORAGE ON LOAD
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("germaniaAccessKey");

  if (savedKey) {
    // Ako je korisnik prethodno stisnuo "Zapamti me", sakrij formu i zavrti spinner
    loginForm.style.display = "none";
    spinnerBox.style.display = "flex";

    // Pokreni Firebase autentifikaciju automatski
    performLogin(savedKey, true);
  }
});

// ==========================================
// 3. LOGIN BUTTON LOGIC
// ==========================================
enterBtn.addEventListener("click", () => {
  const userAccessKey = accessKeyInput.value;
  if (!userAccessKey) return; // Nemoj učitavati ako je prazno
  performLogin(userAccessKey, false);
});

accessKeyInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enterBtn.click();
  }
});

// ==========================================
// 4. MAIN FIREBASE LOGIN FUNCTION
// ==========================================
function performLogin(key, isAutoLogin) {
  if (!isAutoLogin) {
    messageText.innerText = "Provjera...";
    messageText.style.color = "#5c5300";
  }

  signInWithEmailAndPassword(auth, secretEmail, key)
    .then(() => {
      // AKO JE MANUALNA PRIJAVA I OZNACENO JE 'ZAPAMTI ME'
      if (!isAutoLogin && rememberMeCheckbox.checked) {
        localStorage.setItem("germaniaAccessKey", key);
      } else if (!isAutoLogin && !rememberMeCheckbox.checked) {
        // Ako je odznačen checkbox, obriši stari ključ (za svaki slučaj)
        localStorage.removeItem("germaniaAccessKey");
      }

      // SUCCESSFUL LOGIN
      messageText.style.color = "#008237"; // Green
      messageText.innerText = "Pristup odobren. Učitavanje...";

      // REDIRECT MAGIC
      window.location.href = "home.html";
    })
    .catch((error) => {
      // WRONG PASSWORD / FAILED LOGIN
      messageText.style.color = "#df1f26"; // Red
      messageText.innerText = "POGREŠAN KLJUČ. PRISTUP ODBIJEN.";
      accessKeyInput.value = ""; // Clear box

      // Ako je automatska prijava propala (npr. ključ je promijenjen u međuvremenu)
      if (isAutoLogin) {
        localStorage.removeItem("germaniaAccessKey"); // Obriši neispravan ključ
        spinnerBox.style.display = "none"; // Sakrij spinner
        loginForm.style.display = "block"; // Vrati prijavnu formu natrag
      }
    });
}
