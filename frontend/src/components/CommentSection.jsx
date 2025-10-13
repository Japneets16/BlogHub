import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function formatDate(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString();
}

// Individual comment component to handle nested comments
function CommentItem({ comment, onEdit, onDelete, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.comment || comment.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = currentUserId && comment.author && 
    (comment.author._id === currentUserId || comment.author.id === currentUserId);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await onDelete(comment._id);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">
            {comment.author?.name || comment.author?.username || "Anonymous"}
          </span>
          <span className="text-sm text-slate-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-2 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none text-slate-900"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={isSubmitting || !editContent.trim()}
              className="px-3 py-1 bg-slate-900 text-white text-sm rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.comment || comment.content || "");
              }}
              className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 leading-relaxed">{comment.comment || comment.content}</p>
      )}
      
      {/* Render nested replies if they exist */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-4 space-y-3 border-l-2 border-slate-200 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentSection({ comments = [], onAdd, onEdit, onDelete, onRefresh }) {
  const { token, user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAdd(newComment.trim());
      setNewComment("");
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>
      
      {token ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-700">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 resize-none"
              rows="4"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-slate-600 text-center">
            <a href="/login" className="text-slate-900 font-semibold hover:underline">Login</a> to post comments
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-lg">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={user?.id || user?._id}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default CommentSection;