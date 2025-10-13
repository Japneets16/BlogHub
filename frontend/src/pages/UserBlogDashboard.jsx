import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

function UserBlogDashboard() {
  const { token, user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await request("/user/getuserblogs", { token });
      setBlogs(response.blogs ?? []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(blogId);
      await request(`/user/deleteblog/${blogId}`, {
        method: "POST",
        token,
      });
      await fetchUserBlogs(); // Refresh the list
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Blogs</h1>
          <p className="text-slate-600">Loading your blogs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Blogs</h1>
            <p className="text-slate-600 text-lg">Manage your published stories and drafts.</p>
          </div>
          <Link to="/create" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center whitespace-nowrap">
            Write New Blog
          </Link>
        </div>

        {error && <p className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>}

        {blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No blogs yet</h3>
            <p className="text-slate-600 mb-6">Start sharing your stories with the world!</p>
            <Link to="/create" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Write Your First Blog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                {blog.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={`${API_BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="font-medium">{formatDate(blog.createdAt)}</span>
                    <span>
                      {blog.views || 0} views · {Array.isArray(blog.likes) ? blog.likes.length : 0} likes · {blog.commentCount || 0} comments
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-slate-600 line-clamp-3">
                    {(blog.content || "").slice(0, 120)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(blog.tags || []).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Link to={`/edit-blog/${blog._id}`} className="flex-1 text-center border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteBlog(blog._id, blog.title)}
                      disabled={deleteLoading === blog._id}
                    >
                      {deleteLoading === blog._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default UserBlogDashboard;
