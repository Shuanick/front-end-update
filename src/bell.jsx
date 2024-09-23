import { React, useState, useEffect } from "react";

function Bell() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const socket = new WebSocket(`wss://nickproduct-d61b16cc0f17.herokuapp.com/${userId}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "friendRequest") {
        setFriendRequests((prev) => [...prev, data.username]);
        setNewNotification(true);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected.");
    };
  }, [userId]);

  return (
    <div className="notlist">
      <div className="bell-container">
        <div className="bell-head">通知</div>
        <div className="notification">
          {friendRequests.map((username, index) => (
            <div key={index} className="notification-item">
              {username} 發送了好友請求
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Bell;
