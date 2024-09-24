import { get } from "mongoose";
import { React, useState, useEffect } from "react";
import axios from "axios";

function Bell() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://nickproduct-d61b16cc0f17.herokuapp.com/notifications/${userId}`);
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();

    const socket = new WebSocket(`wss://localhost:3000/${userId}`);//

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);
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
          {notifications.map((notification) => (
            notification.type === "friendRequest" ? (
            <div key={notification._id} className="notification-item">
              <strong style={{margin:'0 20px 0 20px'}}>{notification.from}</strong>對您發送了好友請求
            </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
}
export default Bell;
