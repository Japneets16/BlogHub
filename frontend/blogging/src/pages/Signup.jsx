import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

// Signup page
export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border px-2 py-1 rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border px-2 py-1 rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Signup</button>
      </form>
    </div>
  );
}