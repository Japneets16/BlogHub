import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { request } from "../api/client";

function CommentItem({ comment, level = 0, onEdit, onDelete }) {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const indentClass = level > 0 ? "nested-comment" : "";
  const isOwner = user && comment.author && (comment.author._id === user.id || comment.author._id === user._id);

  const handleEdit = async () => {
    if (!editText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await request(`/user/editcomment/${comment._id}`, {
        method: "PUT",
        body: { content: editText.trim() },
        token,
      });
      setIsEditing(false);
      onEdit && onEdit();
    } catch (editError) {
      setError(editError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await request(`/user/deletecomment/${comment._id}`, {
        method: "DELETE",
        token,
      });
      onDelete && onDelete();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <li className={`comment-item ${indentClass}`}>
      <div className="comment-header">
        <span className="comment-author">{comment.author?.name ?? "Anonymous"}</span>
        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
        {isOwner && (
          <div className="comment-actions">
            <button
              type="button"
              className="comment-action-btn"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSubmitting}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              className="comment-action-btn danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            className="text-field"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
          />
          {error && <p className="error-text">{error}</p>}
          <div className="comment-edit-actions">
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.comment);
                setError("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="solid-button"
              onClick={handleEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-text">{comment.comment}</p>
      )}
      
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <ul className="comment-list">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              level={level + 1} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentSection({ comments, onAdd, onRefresh }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      setFormError("Comment cannot be empty.");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      await onAdd(message.trim());
      setMessage("");
    } catch (submitError) {
      setFormError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentEdit = () => {
    onRefresh && onRefresh();
  };

  const handleCommentDelete = () => {
    onRefresh && onRefresh();
  };

  return (
    <section className="comment-section">
      <h3 className="section-title">Comments</h3>
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="comment-message">Share your thoughts</label>
          <textarea
            id="comment-message"
            className="text-field"
            placeholder="Write a comment"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
          />
          {formError && <p className="error-text">{formError}</p>}
          <button type="submit" className="solid-button" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="muted-text">Login to join the discussion.</p>
      )}
      {comments.length === 0 ? (
        <p className="muted-text">No comments yet.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onEdit={handleCommentEdit}
              onDelete={handleCommentDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default CommentSection;
