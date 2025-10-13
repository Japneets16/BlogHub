import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example credentials (change to whatever sample you want)
  const sampleCredentials = {
    email: "demo@gmail.com",
    password: "password123",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setIsSubmitting(true);
      await login(formState);
      const redirectTo = location.state?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome Back</h1>
          <p className="text-slate-600 text-lg">Login to manage your blogs.</p>
        </div>
        <form className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
              value={formState.email}
              onChange={handleChange}
              placeholder="demo@gmail.com"   // sample shown as faint text
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
              value={formState.password}
              onChange={handleChange}
              placeholder="password123" // sample shown as faint text
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
