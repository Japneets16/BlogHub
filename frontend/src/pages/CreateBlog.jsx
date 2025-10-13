import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";

function CreateBlog() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

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
    if (!token || !user) {
      setError("Please login to create a blog.");
      navigate("/login");
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
      if (submitError.message.includes("401") || submitError.message.includes("Unauthorized")) {
        setError("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        setError(submitError.message || "Failed to create blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Loading...</h1>
          <p className="text-slate-600 text-lg">Please wait while we verify your authentication.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Write a New Blog</h1>
          <p className="text-slate-600 text-lg">Share your story with the community.</p>
        </div>
        <form className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-content">Content</label>
            <textarea
              id="blog-content"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 resize-y min-h-[250px]"
              rows={10}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-tags">Tags</label>
            <input
              id="blog-tags"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Separate tags with commas"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-image">Cover Image</label>
            <input
              id="blog-image"
              type="file"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateBlog;
