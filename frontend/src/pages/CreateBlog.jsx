import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";

function CreateBlog() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      const tagItems = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      if (tagItems.length > 0) {
        formData.append("tags", JSON.stringify(tagItems));
      }
      if (image) {
        formData.append("image", image);
      }
      const response = await request("/user/addblog", {
        method: "POST",
        body: formData,
        token,
      });
      const createdBlog = response.blog;
      navigate(`/blog/${createdBlog._id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section narrow-section">
      <h1 className="page-title">Write a New Blog</h1>
      <p className="muted-text">Share your story with the community.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            type="text"
            className="text-field"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="blog-content">Content</label>
          <textarea
            id="blog-content"
            className="text-field"
            rows={10}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="blog-tags">Tags</label>
          <input
            id="blog-tags"
            type="text"
            className="text-field"
            placeholder="Separate tags with commas"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="blog-image">Cover Image</label>
          <input
            id="blog-image"
            type="file"
            className="text-field"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="solid-button" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </form>
    </section>
  );
}

export default CreateBlog;
