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
    <section className="page-section narrow-section">
      <h1 className="page-title">Your Profile</h1>
      <p className="muted-text">Update your details to keep them current.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            name="name"
            type="text"
            className="text-field"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            className="text-field"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        {status && <p className="success-text">{status}</p>}
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="solid-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default Profile;
