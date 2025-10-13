import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState({ name: user.name ?? "", email: user.email ?? "" });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      setIsSubmitting(true);
      await updateProfile(formState);
      setStatus("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Profile</h1>
        <p className="text-slate-600 mb-8">Update your details to keep them current.</p>
        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              name="name"
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              name="email"
              type="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          {status && <p className="text-green-600 text-sm font-medium bg-green-50 px-4 py-3 rounded-lg">{status}</p>}
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
