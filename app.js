// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4DVbIQUzhNSczujsP27MwTE6NfifB8ew",
  authDomain: "promote-pro-8f9aa.firebaseapp.com",
  databaseURL: "https://promote-pro-8f9aa-default-rtdb.firebaseio.com",
  projectId: "promote-pro-8f9aa",
  storageBucket: "promote-pro-8f9aa.firebasestorage.app",
  messagingSenderId: "553030063178",
  appId: "1:553030063178:web:13e2b89fd5c6c628ccc2b3",
  measurementId: "G-KZ89FN869W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to load user data
async function loadUserData(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    document.getElementById("points").innerText = userData.points;
    if (userData.tasks) {
      for (const [taskId, task] of Object.entries(userData.tasks)) {
        document.getElementById(taskId).querySelector(".task-status").innerText = task.status;
      }
    }
  } else {
    // Initialize user data if not present
    await setDoc(userRef, { points: 0, tasks: {} });
  }
}

// Function to submit task link
async function submitTask(userId, taskId, link) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    [`tasks.${taskId}`]: {
      link: link,
      status: "On review",
      pointsEarned: 0
    }
  });
  
  document.getElementById(taskId).querySelector(".task-status").innerText = "On review";
}

// Listen for status changes to "Done" in Firestore and update points
function listenForStatusUpdates(userId) {
  const userRef = doc(db, "users", userId);
  onSnapshot(userRef, (doc) => {
    const userData = doc.data();
    document.getElementById("points").innerText = userData.points;
    if (userData.tasks) {
      for (const [taskId, task] of Object.entries(userData.tasks)) {
        const statusElement = document.getElementById(taskId).querySelector(".task-status");
        statusElement.innerText = task.status;
        if (task.status === "Done") {
          statusElement.classList.add("done");
        }
      }
    }
  });
}

// Add event listeners for task submissions
document.querySelectorAll(".submit-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const taskId = button.dataset.task;
    const link = document.getElementById(`taskLink${taskId.slice(-1)}`).value;
    const userId = "uniqueTelegramId"; // Replace with unique Telegram ID

    await submitTask(userId, taskId, link);
  });
});

// Load user data and start listening for updates
const userId = "uniqueTelegramId"; // Replace with unique Telegram ID
loadUserData(userId);
listenForStatusUpdates(userId);
