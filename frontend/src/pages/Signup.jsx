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
    <section className="page-section narrow-section">
      <h1 className="page-title">Create an Account</h1>
      <p className="muted-text">Start sharing your stories today.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="text-field"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="text-field"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="text-field"
            value={formState.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="solid-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
}

export default Signup;
