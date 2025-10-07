import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { API_BASE_URL, request } from "../api/client";
import { useAuth } from "../context/AuthContext";

function BlogDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [likePending, setLikePending] = useState(false);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await request(`/user/getsingleblog/${id}`);
      setBlog(response.blog);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await request(`/user/getallcomments/${id}`);
      setComments(response.comments ?? []);
    } catch (fetchError) {
      setStatusMessage(fetchError.message);
    }
  };

  useEffect(() => {
    loadBlog();
    loadComments();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      setStatusMessage("Login to like this blog.");
      return;
    }
    try {
      setLikePending(true);
      setStatusMessage("");
      await request(`/user/likes/${id}`, {
        method: "PUT",
        token,
      });
      await loadBlog();
    } catch (likeError) {
      setStatusMessage(likeError.message);
    } finally {
      setLikePending(false);
    }
  };

  const handleAddComment = async (content) => {
    if (!token) {
      const message = "Login to comment.";
      setStatusMessage(message);
      throw new Error(message);
    }
    try {
      setStatusMessage("");
      await request(`/user/addcomment/${id}`, {
        method: "POST",
        body: { content },
        token,
      });
      await loadComments();
      await loadBlog();
    } catch (commentError) {
      const message = commentError.message ?? "Unable to add comment.";
      setStatusMessage(message);
      throw new Error(message);
    }
  };

  if (loading) {
    return <p className="muted-text">Loading blog...</p>;
  }

  if (error || !blog) {
    return <p className="error-text">{error || "Blog not found."}</p>;
  }

  const imageUrl = blog.image ? `${API_BASE_URL}${blog.image}` : null;
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;
  const hasLiked = token && Array.isArray(blog.likes) && blog.likes.some((value) => String(value) === String(user?.id ?? user?._id));

  return (
    <article className="page-section">
      <header className="article-header">
        <h1 className="page-title">{blog.title}</h1>
        <div className="article-meta">
          <span className="blog-author">{blog.author?.name ?? "Unknown"}</span>
          <span className="blog-date">{new Date(blog.createdAt).toLocaleString()}</span>
          <span className="blog-insight">{blog.views ?? 0} views</span>
        </div>
        <div className="tag-list">
          {(blog.tags ?? []).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
        <div className="article-actions">
          <button type="button" className="solid-button" onClick={handleLike} disabled={likePending}>
            {likePending ? "Updating..." : hasLiked ? "Unlike" : "Like"}
          </button>
          <span className="blog-insight">{likeCount} likes · {blog.commentCount ?? 0} comments</span>
        </div>
      </header>
      {imageUrl && (
        <div className="hero-image-wrapper">
          <img src={imageUrl} alt={blog.title} className="hero-image" />
        </div>
      )}
      <section className="article-content">
        {(blog.content ?? "").split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
          <p key={index} className="article-paragraph">{paragraph}</p>
        ))}
      </section>
      {statusMessage && <p className="muted-text">{statusMessage}</p>}
      <CommentSection comments={comments} onAdd={handleAddComment} />
    </article>
  );
}

export default BlogDetail;
