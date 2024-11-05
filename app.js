// Get user data (this assumes user data is available via a Telegram context)
const userId = Telegram.WebApp.initDataUnsafe.user.id; // Adjust as needed

// Function to submit a task
document.querySelectorAll('.submit-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const taskId = event.target.getAttribute('data-task');
        const taskLinkInput = document.getElementById(`taskLink${taskId.slice(-1)}`);
        const taskStatus = document.getElementById(`status${taskId.slice(-1)}`);

        if (taskLinkInput.value.trim()) {
            try {
                // Save task link to Firestore
                await db.collection('users').doc(userId.toString()).collection('tasks').doc(taskId).set({
                    link: taskLinkInput.value,
                    status: 'On review',
                    timestamp: new Date()
                });

                // Update UI
                taskStatus.textContent = 'On review';
                taskStatus.classList.add('on-review');
                event.target.disabled = true; // Disable button after submission

            } catch (error) {
                console.error('Error saving task:', error);
                alert('Failed to submit the task. Please try again.');
            }
        } else {
            alert('Please provide a valid link.');
        }
    });
});

// Real-time listener for task updates
db.collection('users').doc(userId.toString()).collection('tasks').onSnapshot(snapshot => {
    snapshot.forEach(doc => {
        const taskData = doc.data();
        const taskId = doc.id;
        const taskStatus = document.getElementById(`status${taskId.slice(-1)}`);

        if (taskData.status === 'Done') {
            taskStatus.textContent = 'Done';
            taskStatus.classList.remove('on-review');
            taskStatus.classList.add('done');

            // Update points
            db.collection('users').doc(userId.toString()).get().then(userDoc => {
                const currentPoints = userDoc.data()?.points || 0;
                db.collection('users').doc(userId.toString()).update({
                    points: currentPoints + 10
                });
                document.getElementById('points').textContent = currentPoints + 10;
            });
        }
    });
});
