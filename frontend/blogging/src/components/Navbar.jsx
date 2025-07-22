import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Simple, responsive navbar using Tailwind
export default function Navbar() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4">
      <Link to="/" className="font-bold text-xl">BlogApp</Link>
      <div className="flex items-center gap-4">
        {state.user ? (
          <>
            <Link to="/add" className="hover:underline">Add Blog</Link>
            <Link to="/notifications" className="hover:underline">Notifications</Link>
            {state.user.role === "admin" && <Link to="/admin" className="hover:underline">Admin</Link>}
            <span className="font-semibold">{state.user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
