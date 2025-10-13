import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { request } from "../api/client";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const fetchBlogs = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const queryParts = [];
      if (params.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (params.tag) {
        queryParts.push(`tag=${encodeURIComponent(params.tag)}`);
      }
      const queryString = queryParts.length ? `?${queryParts.join("&")}` : "";
      const response = await request(`/user/getallblogs${queryString}`);
      setBlogs(response.blogs ?? []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchBlogs({ search: searchTerm.trim(), tag: tagFilter.trim() });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Blogs</h1>
            <p className="text-slate-600 text-lg">Read fresh perspectives from the community.</p>
          </div>
          <form className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-4 items-end" onSubmit={handleSearch}>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="search-term">Search</label>
              <input
                id="search-term"
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Search by title or content"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="tag-filter">Tag</label>
              <input
                id="tag-filter"
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Filter by tag"
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
              />
            </div>
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 whitespace-nowrap">Apply</button>
          </form>
        </div>
        {loading && <p className="text-slate-600 text-center py-8">Loading blogs...</p>}
        {error && <p className="text-red-600 text-center py-8 bg-red-50 rounded-lg font-medium">{error}</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-slate-600 text-center py-8">No blogs found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
