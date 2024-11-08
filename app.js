// index.js or App.js (React)
import React, { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Telegram WebApp integration: get user info when running in Telegram
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user; // this object contains `id`, `username`, etc.
    if (user) {
      setUser(user);
      tg.expand(); // Expands the web app to full screen
    } else {
      console.error("User not authenticated");
    }
  }, []);

  return (
    <div>
      {user ? (
        <h2>Welcome to your dashboard, {user.username}!</h2>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
