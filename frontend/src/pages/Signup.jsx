import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setIsSubmitting(true);
      await signup(formState);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h1>
          <p className="text-slate-600">Start sharing your stories today.</p>
        </div>
        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={formState.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Signup;
