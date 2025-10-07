import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route
            path="/create"
            element={(
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
