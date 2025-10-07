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
    <header className="app-header">
      <div className="brand-area">
        <Link to="/" className="brand-link">BlogHub</Link>
      </div>
      <nav className="primary-navigation">
        <NavLink to="/" className="nav-item">Home</NavLink>
        {user && <NavLink to="/create" className="nav-item">Write</NavLink>}
        {user && <NavLink to="/my-blogs" className="nav-item">My Blogs</NavLink>}
        {user && <NavLink to="/profile" className="nav-item">Profile</NavLink>}
      </nav>
      <div className="account-actions">
        {user ? (
          <>
            <span className="greeting">Hi, {user.name}</span>
            <button type="button" className="outline-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="solid-button">Login</NavLink>
            <NavLink to="/signup" className="outline-button">Sign Up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
