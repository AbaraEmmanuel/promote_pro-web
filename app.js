window.onload = function() {
    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
        // Initialize the Telegram WebApp
        const user = window.Telegram.WebApp.initDataUnsafe;

        console.log('User Data:', user); // Debugging line to check user data

        const userId = user?.user?.id;
        const username = user?.user?.username || "Username";

        // Display the username
        document.getElementById('userName').textContent = username;

        // Fetch user-specific data from your server
        if (userId) {
            fetch(`https://exquisitev2.urbanson.tech/data/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const points = data.points || 0;
                    const tasksDone = data.tasksDone || 0;

                    document.getElementById('points').textContent = points;
                    document.getElementById('tasksDone').textContent = tasksDone;
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
        // Handle task completion
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = this.getAttribute('data-task');
                const taskElement = document.getElementById(taskId);

                if (!taskElement.classList.contains('completed')) {
                    // Update task status
                    let points = parseInt(document.getElementById('points').textContent);
                    let tasksDone = parseInt(document.getElementById('tasksDone').textContent);

                    points += 10;
                    tasksDone += 1;
                    taskElement.classList.add('completed');
                    this.textContent = 'Completed';
                    document.getElementById('points').textContent = points;
                    document.getElementById('tasksDone').textContent = tasksDone;

                    // Send updated data to server
                    if (userId) {
                        sendDataToServer(userId, points, tasksDone);
                    }
                }
            });
        });
    } else {
        console.error('Telegram WebApp is not available');
    }
};

function sendDataToServer(userId, points, tasksDone) {
    fetch('https://exquisitev2.urbanson.tech/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points, tasksDone })
    })
    .then(response => response.json())
    .then(data => console.log('Data successfully sent:', data))
    .catch(error => console.error('Error sending data:', error));
}
