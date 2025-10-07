import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

function EditBlog() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await request(`/user/getsingleblog/${id}`);
      const blogData = response.blog;
      
      // Check if user is the author
      if (blogData.author._id !== user.id && blogData.author._id !== user._id) {
        setError("You don't have permission to edit this blog.");
        return;
      }
      
      setBlog(blogData);
      setTitle(blogData.title);
      setContent(blogData.content);
      setTags((blogData.tags || []).join(", "));
      setCurrentImage(blogData.image);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

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

      const response = await request(`/user/updateblog/${id}`, {
        method: "PUT",
        body: formData,
        token,
      });

      navigate(`/blog/${id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="page-section narrow-section">
        <h1 className="page-title">Edit Blog</h1>
        <p className="muted-text">Loading blog...</p>
      </section>
    );
  }

  if (error && !blog) {
    return (
      <section className="page-section narrow-section">
        <h1 className="page-title">Edit Blog</h1>
        <p className="error-text">{error}</p>
        <button 
          type="button" 
          className="outline-button" 
          onClick={() => navigate("/my-blogs")}
        >
          Back to My Blogs
        </button>
      </section>
    );
  }

  return (
    <section className="page-section narrow-section">
      <h1 className="page-title">Edit Blog</h1>
      <p className="muted-text">Update your blog post.</p>
      
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
            rows={12}
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
          {currentImage && (
            <div className="current-image-preview">
              <img 
                src={`${API_BASE_URL}${currentImage}`} 
                alt="Current cover" 
                className="preview-image"
              />
              <p className="muted-text">Current cover image</p>
            </div>
          )}
          <input
            id="blog-image"
            type="file"
            className="text-field"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="muted-text">Leave empty to keep current image</p>
        </div>

        {error && <p className="error-text">{error}</p>}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="outline-button" 
            onClick={() => navigate(`/blog/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="solid-button" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditBlog;
