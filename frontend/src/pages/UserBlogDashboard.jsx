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
      <section className="page-section">
        <h1 className="page-title">My Blogs</h1>
        <p className="muted-text">Loading your blogs...</p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1 className="page-title">My Blogs</h1>
          <p className="muted-text">Manage your published stories and drafts.</p>
        </div>
        <Link to="/create" className="solid-button">
          Write New Blog
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {blogs.length === 0 ? (
        <div className="empty-state">
          <h3>No blogs yet</h3>
          <p className="muted-text">Start sharing your stories with the world!</p>
          <Link to="/create" className="solid-button">
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="user-blog-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="user-blog-card">
              {blog.image && (
                <div className="user-blog-thumbnail">
                  <img 
                    src={`${API_BASE_URL}${blog.image}`} 
                    alt={blog.title}
                    className="user-blog-image"
                  />
                </div>
              )}
              <div className="user-blog-content">
                <div className="user-blog-meta">
                  <span className="blog-date">{formatDate(blog.createdAt)}</span>
                  <span className="blog-stats">
                    {blog.views || 0} views · {Array.isArray(blog.likes) ? blog.likes.length : 0} likes · {blog.commentCount || 0} comments
                  </span>
                </div>
                <h3 className="user-blog-title">
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h3>
                <p className="user-blog-preview">
                  {(blog.content || "").slice(0, 120)}...
                </p>
                <div className="user-blog-tags">
                  {(blog.tags || []).map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
                <div className="user-blog-actions">
                  <Link to={`/edit-blog/${blog._id}`} className="outline-button">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="danger-button"
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
    </section>
  );
}

export default UserBlogDashboard;
