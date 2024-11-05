// Firebase configuration (replace with your own Firebase project details)
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get Telegram WebApp user information
const user = window.Telegram.WebApp.initDataUnsafe.user;

// Set username in the profile section
if (user && user.username) {
    document.getElementById("userName").innerText = user.username;
} else {
    document.getElementById("userName").innerText = "Guest"; // Default text if no username found
}

// Use user ID (Telegram ID) for Firebase user document ID
const userId = user?.id || "testUserId"; // Replace "testUserId" for testing without Telegram

// Load user data from Firestore
async function loadUserData(userId) {
    console.log("Loading data for user:", userId); // Debugging
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
        console.log("User data found:", userDoc.data()); // Debugging
        const userData = userDoc.data();
        document.getElementById("points").innerText = userData.points || 0;
        updateTaskStatuses(userData.tasks || {});
    } else {
        console.log("No user data found, initializing..."); // Debugging
        await userRef.set({ points: 0, tasks: {} });
    }
}

// Update task statuses on the dashboard
function updateTaskStatuses(tasks) {
    Object.keys(tasks).forEach(taskId => {
        const task = tasks[taskId];
        document.getElementById(taskId).querySelector(".task-status").innerText = task.status;
    });
}

// Listen for real-time updates in Firestore (for task status changes)
function listenForStatusUpdates(userId) {
    const userRef = db.collection("users").doc(userId);
    userRef.onSnapshot((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            document.getElementById("points").innerText = userData.points;
            updateTaskStatuses(userData.tasks);
        }
    });
}

// Submit a task to Firestore
async function submitTask(userId, taskId, link) {
    console.log("Submitting task:", taskId, "for user:", userId); // Debugging
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
        [`tasks.${taskId}`]: {
            link: link,
            status: "On review",
            pointsEarned: 0
        }
    });
    document.getElementById(taskId).querySelector(".task-status").innerText = "On review";
}

// Attach event listeners to task submit buttons
document.querySelectorAll(".submit-btn").forEach(button => {
    button.addEventListener("click", () => {
        const taskId = button.getAttribute("data-task");
        const linkInput = document.getElementById(taskId).querySelector("input[type='text']");
        const link = linkInput.value;

        if (link) {
            submitTask(userId, taskId, link);
        } else {
            alert("Please paste a valid link.");
        }
    });
});

// Load user data and set up real-time listener for changes
loadUserData(userId);
listenForStatusUpdates(userId);
