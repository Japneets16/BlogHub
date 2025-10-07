import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/client";

function formatDate(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString();
}

function BlogCard({ blog }) {
  const imageUrl = blog.image ? `${API_BASE_URL}${blog.image}` : null;
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;

  return (
    <article className="blog-card">
      {imageUrl && (
        <Link to={`/blog/${blog._id}`} className="thumbnail-wrapper">
          <img src={imageUrl} alt={blog.title} className="blog-thumbnail" />
        </Link>
      )}
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-author">{blog.author?.name ?? "Unknown"}</span>
          <span className="blog-date">{formatDate(blog.createdAt)}</span>
        </div>
        <Link to={`/blog/${blog._id}`} className="blog-card-title">{blog.title}</Link>
        <p className="blog-card-content">{blog.content.slice(0, 140)}{blog.content.length > 140 ? "..." : ""}</p>
        <div className="blog-card-footer">
          <div className="tag-list">
            {(blog.tags ?? []).map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
          <span className="blog-insight">{blog.views ?? 0} views · {likeCount} likes · {blog.commentCount ?? 0} comments</span>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
