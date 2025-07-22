import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

// Home page: blog list, search, filter
export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, [search, tag]);

  async function fetchBlogs() {
    const res = await API.get("/getallblogs", { params: { search, tag } });
    setBlogs(res.data.blogs);
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">All Blogs</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded"
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded"
          type="text"
          placeholder="Filter by tag..."
          value={tag}
          onChange={e => setTag(e.target.value)}
        />
      </div>
      <div className="grid gap-6">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded shadow p-4">
            {blog.image && <img src={`http://localhost:3000${blog.image}`} alt="blog" className="w-full h-48 object-cover rounded mb-2" />}
            <h2 className="text-xl font-semibold">
              <Link to={`/blog/${blog._id}`} className="hover:underline">{blog.title}</Link>
            </h2>
            <p className="text-gray-600">By {blog.author?.name || "Unknown"}</p>
            <p className="mt-2">{blog.content.slice(0, 100)}...</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Views: {blog.views}</span>
              <span className="text-xs text-gray-500">Likes: {blog.likes.length}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {blog.tags && blog.tags.map(t => (
                <span key={t} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}