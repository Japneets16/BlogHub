import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-black hover:text-black transition-colors">BlogHub</Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}`}>Home</NavLink>
            {user && <NavLink to="/create" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}`}>Write</NavLink>}
            {user && <NavLink to="/my-blogs" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}`}>My Blogs</NavLink>}
            {user && <NavLink to="/profile" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}`}>Profile</NavLink>}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 font-medium hidden sm:inline">Hi, {user.name}</span>
                <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">Login</NavLink>
                <NavLink to="/signup" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50  hover:text-black transition-colors font-medium text-sm">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
