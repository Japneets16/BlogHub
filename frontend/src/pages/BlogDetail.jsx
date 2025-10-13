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

  const handleEditComment = async (commentId, content) => {
    if (!token) {
      const message = "Login to edit comments.";
      setStatusMessage(message);
      throw new Error(message);
    }
    try {
      setStatusMessage("");
      await request(`/user/editcomment/${commentId}`, {
        method: "PUT",
        body: { content },
        token,
      });
      await loadComments();
      await loadBlog();
    } catch (commentError) {
      const message = commentError.message ?? "Unable to edit comment.";
      setStatusMessage(message);
      throw new Error(message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      const message = "Login to delete comments.";
      setStatusMessage(message);
      throw new Error(message);
    }
    try {
      setStatusMessage("");
      await request(`/user/deletecomment/${commentId}`, {
        method: "DELETE",
        token,
      });
      await loadComments();
      await loadBlog();
    } catch (commentError) {
      const message = commentError.message ?? "Unable to delete comment.";
      setStatusMessage(message);
      throw new Error(message);
    }
  };

  if (loading) {
    return <p className="flex items-center justify-center min-h-screen text-slate-600 text-lg">Loading blog...</p>;
  }

  if (error || !blog) {
    return <p className="flex items-center justify-center min-h-screen text-red-600 text-lg font-medium">{error || "Blog not found."}</p>;
  }

  const imageUrl = blog.image ? `${API_BASE_URL}${blog.image}` : null;
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;
  const hasLiked = token && Array.isArray(blog.likes) && blog.likes.some((value) => String(value) === String(user?.id ?? user?._id));

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-4">
            <span className="font-semibold text-slate-800">{blog.author?.name ?? "Unknown"}</span>
            <span className="text-sm">{new Date(blog.createdAt).toLocaleString()}</span>
            <span className="text-sm">{blog.views ?? 0} views</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {(blog.tags ?? []).map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg" onClick={handleLike} disabled={likePending}>
              {likePending ? "Updating..." : hasLiked ? "Unlike" : "Like"}
            </button>
            <span className="text-slate-600 text-sm">{likeCount} likes · {blog.commentCount ?? 0} comments</span>
          </div>
        </header>
        {imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={imageUrl} 
              alt={blog.title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          {(blog.content ?? "").split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
            <p key={index} className="text-slate-700 text-lg leading-relaxed mb-4 last:mb-0">{paragraph}</p>
          ))}
        </section>
        {statusMessage && <p className="text-slate-600 text-center mb-6 bg-slate-100 border border-slate-200 rounded-lg px-4 py-3">{statusMessage}</p>}
        <CommentSection 
          comments={comments} 
          onAdd={handleAddComment} 
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
          onRefresh={loadComments} 
        />
      </div>
    </article>
  );
}

export default BlogDetail;
