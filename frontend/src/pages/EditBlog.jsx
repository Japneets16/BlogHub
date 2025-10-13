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
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Blog</h1>
          <p className="text-slate-600">Loading blog...</p>
        </div>
      </section>
    );
  }

  if (error && !blog) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Edit Blog</h1>
          <p className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>
          <button
            type="button"
            className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            onClick={() => navigate("/my-blogs")}
          >
            Back to My Blogs
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Blog</h1>
        <p className="text-slate-600 mb-8">Update your blog post.</p>

        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-content">Content</label>
            <textarea
              id="blog-content"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none resize-y"
              rows={12}
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Separate tags with commas"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="blog-image">Cover Image</label>
            {currentImage && (
              <div className="mb-4 space-y-2">
                <img
                  src={`${API_BASE_URL}${currentImage}`}
                  alt="Current cover"
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                />
                <p className="text-sm text-slate-600">Current cover image</p>
              </div>
            )}
            <input
              id="blog-image"
              type="file"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-slate-600">Leave empty to keep current image</p>
          </div>

          {error && <p className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              className="flex-1 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              onClick={() => navigate(`/blog/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditBlog;
