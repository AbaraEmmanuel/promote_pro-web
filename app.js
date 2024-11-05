// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase initialization
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.onload = function() {
    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
        // Initialize the Telegram WebApp
        const user = window.Telegram.WebApp.initDataUnsafe;

        const userId = user?.user?.id;
        const username = user?.user?.username || "Username";

        // Display the username
        document.getElementById('userName').textContent = username;

        // Fetch user data from Firebase
        if (userId) {
            fetchUserData(userId);
        }

        // Task submission
        document.querySelectorAll('.submit-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const taskId = this.getAttribute('data-task');
                const link = document.getElementById(`taskLink${taskId.replace('task', '')}`).value;
                
                if (userId && link) {
                    await submitTaskLink(userId, taskId, link);
                    this.textContent = 'On review';
                }
            });
        });
    } else {
        console.error('Telegram WebApp is not available');
    }
};

// Fetch user data from Firebase
async function fetchUserData(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('points').textContent = data.points || 0;
            document.getElementById('tasksDone').textContent = data.tasksDone || 0;
            // Update task statuses as needed based on data
        } else {
            console.log('No user data found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Submit task link
async function submitTaskLink(userId, taskId, link) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            [`tasks.${taskId}`]: { status: "On review", link }
        });
    } catch (error) {
        console.error('Error submitting task link:', error);
    }
}
