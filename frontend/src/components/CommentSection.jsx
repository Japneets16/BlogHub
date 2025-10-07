import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function CommentItem({ comment, level = 0 }) {
  const indentClass = level > 0 ? "nested-comment" : "";
  return (
    <li className={`comment-item ${indentClass}`}>
      <div className="comment-header">
        <span className="comment-author">{comment.author?.name ?? "Anonymous"}</span>
        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="comment-text">{comment.comment}</p>
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <ul className="comment-list">
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentSection({ comments, onAdd }) {
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
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default CommentSection;
