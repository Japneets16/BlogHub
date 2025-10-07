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
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1 className="page-title">Discover Blogs</h1>
          <p className="muted-text">Read fresh perspectives from the community.</p>
        </div>
        <form className="filter-form" onSubmit={handleSearch}>
          <div className="field-group">
            <label className="field-label" htmlFor="search-term">Search</label>
            <input
              id="search-term"
              type="text"
              className="text-field"
              placeholder="Search by title or content"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="tag-filter">Tag</label>
            <input
              id="tag-filter"
              type="text"
              className="text-field"
              placeholder="Filter by tag"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
            />
          </div>
          <button type="submit" className="solid-button">Apply</button>
        </form>
      </div>
      {loading && <p className="muted-text">Loading blogs...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="muted-text">No blogs found.</p>
      )}
      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

export default Home;
