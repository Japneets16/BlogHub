import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/client";

function formatDate(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString();
}

function BlogCard({ blog }) {
  if (!blog) {
    return null; // Handle undefined blog prop
  }
  
  const imageUrl = blog.image ? `${API_BASE_URL}${blog.image}` : null;
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;
  const contentPreview = (blog.content ?? "").slice(0, 140);
  const needsEllipsis = (blog.content ?? "").length > 140;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {imageUrl && (
        <Link to={`/blog/${blog._id}`} className="block overflow-hidden">
          <img 
            src={imageUrl} 
            alt={blog.title} 
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{blog.author?.name ?? "Unknown"}</span>
          <span className="text-gray-400">{formatDate(blog.createdAt)}</span>
        </div>
        <Link to={`/blog/${blog._id}`} className="text-2xl font-bold text-gray-900 hover:text-black transition-colors duration-200 block mb-3">{blog.title}</Link>
        <p className="text-gray-600 leading-relaxed mb-4">{contentPreview}{needsEllipsis ? "..." : ""}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {(blog.tags ?? []).map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-50 text-black text-xs font-medium rounded-full hover:bg-blue-100 transition-colors duration-200">{tag}</span>
            ))}
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{blog.views ?? 0} views · {likeCount} likes · {blog.commentCount ?? 0} comments</span>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
