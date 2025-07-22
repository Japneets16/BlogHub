import { useEffect, useState } from "react";
import API from "../api";

// Notifications page
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const res = await API.get("/notifications");
    setNotifications(res.data.notifications);
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n._id} className={`mb-2 ${n.read ? "text-gray-500" : "font-semibold"}`}>
            {n.message} <span className="text-xs">({new Date(n.createdAt).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}