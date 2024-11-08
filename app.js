window.onload = async function() {
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe;
        console.log('User data:', user);  // Add this line to log user data
        const userId = user?.user?.id;
        const firstName = user?.user?.first_name || "";
        const lastName = user?.user?.last_name || "";

        // Check if firstName and lastName are empty
        if (!firstName && !lastName) {
            console.error("User data is not available");
        } else {
            // Display the username
            document.getElementById('userName').textContent = `${firstName} ${lastName}`;
        }

        if (userId) {
            try {
                // Fetch user data from the server
                const response = await fetch(`/data/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    document.getElementById('points').textContent = data.points || 0;
                    document.getElementById('tasksDone').textContent = data.tasks_done || 0;

                    // Mark completed tasks
                    const completedTasks = data.completed_tasks || [];
                    document.querySelectorAll('.task').forEach(task => {
                        if (completedTasks.includes(task.id)) {
                            task.classList.add('completed');
                            task.querySelector('.complete-btn').textContent = 'Completed';
                        }
                    });
                } else {
                    await initializeUserData(userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    } else {
        console.error('Telegram WebApp is not available');
    }
};
