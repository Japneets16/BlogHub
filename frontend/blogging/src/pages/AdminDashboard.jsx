import { useEffect, useState } from "react";
import API from "../api";

// Admin dashboard: user list, analytics
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  async function fetchUsers() {
    const res = await API.get("/admin/users");
    setUsers(res.data.users);
  }

  async function fetchAnalytics() {
    const res = await API.get("/admin/analytics");
    setAnalytics(res.data);
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-6">
        <h3 className="font-semibold">Analytics</h3>
        <p>Users: {analytics.userCount}</p>
        <p>Blogs: {analytics.blogCount}</p>
        <p>Comments: {analytics.commentCount}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Users</h3>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}