import { useEffect, useState, useContext } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Blog detail page with comments
export default function BlogDetail() {
  const { id } = useParams();
  const { state } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  async function fetchBlog() {
    const res = await API.get(`/getsingleblog/${id}`);
    setBlog(res.data.blog);
  }

  async function fetchComments() {
    const res = await API.get(`/getallcomments/${id}`);
    setComments(res.data.comments);
  }

  async function handleComment(e) {
    e.preventDefault();
    await API.post(`/addcomment/${id}`, { comment });
    setComment("");
    fetchComments();
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {blog && (
        <>
          <h1 className="text-2xl font-bold">{blog.title}</h1>
          {blog.image && <img src={`http://localhost:3000${blog.image}`} alt="blog" className="w-full h-64 object-cover rounded my-2" />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: blog.content }} />
          <p className="text-gray-600">By {blog.author?.name || "Unknown"}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-gray-500">Views: {blog.views}</span>
            <span className="text-xs text-gray-500">Likes: {blog.likes.length}</span>
          </div>
          <div className="flex gap-1 mt-1">
            {blog.tags && blog.tags.map(t => (
              <span key={t} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{t}</span>
            ))}
          </div>
        </>
      )}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Comments</h3>
        {state.user && (
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment"
              required
              className="border px-2 py-1 rounded flex-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded">Comment</button>
          </form>
        )}
        {comments.map(c => (
          <div key={c._id} className="mb-2">
            <b>{c.author?.name || "User"}</b>: {c.comment}
            {c.replies && c.replies.map(r => (
              <div key={r._id} className="ml-4 text-sm text-gray-700">
                <b>{r.author?.name || "User"}</b>: {r.comment}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}