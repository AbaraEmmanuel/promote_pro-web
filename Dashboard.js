// Dashboard.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function Dashboard({ user }) {
  const [points, setPoints] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Comment under a Twitter post', status: 'Pending', link: '' }
  ]);

  useEffect(() => {
    // Fetch points from Firebase for the authenticated user
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setPoints(data.points || 0);
      } else {
        await setDoc(doc(db, "users", user.id), { points: 0 });
      }
    };
    fetchUserData();
  }, [user.id]);

  const handleLinkSubmit = async (taskId, link) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, status: 'On Review', link } : task);
    setTasks(updatedTasks);
    // Update task link and status in Firebase
    await setDoc(doc(db, "tasks", taskId), { userId: user.id, link, status: 'On Review' });
  };

  return (
    <div>
      <h2>Welcome to your dashboard, {user.username}!</h2>
      <p>Points: {points}</p>
      <div>
        <h3>Tasks</h3>
        {tasks.map(task => (
          <div key={task.id}>
            <p>{task.description}</p>
            {task.status === 'Pending' ? (
              <>
                <input
                  type="text"
                  placeholder="Enter task link"
                  onChange={(e) => handleLinkSubmit(task.id, e.target.value)}
                />
                <button onClick={() => handleLinkSubmit(task.id)}>Submit</button>
              </>
            ) : (
              <p>Status: {task.status}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
