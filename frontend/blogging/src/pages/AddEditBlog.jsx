import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

// Add/Edit blog page
export default function AddEditBlog({ edit }) {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (edit && id) {
      API.get(`/getsingleblog/${id}`).then(res => {
        setForm({
          title: res.data.blog.title,
          content: res.data.blog.content,
          tags: res.data.blog.tags.join(","),
        });
      });
    }
  }, [edit, id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = e => setImage(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("tags", form.tags.split(",").map(t => t.trim()));
    if (image) data.append("image", image);
    if (edit) {
      await API.put(`/updateblog/${id}`, data);
    } else {
      await API.post("/addblog", data);
    }
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{edit ? "Edit" : "Add"} Blog</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-3">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="border px-2 py-1 rounded" />
        <textarea name="content" placeholder="Content (Markdown/HTML supported)" value={form.content} onChange={handleChange} required className="border px-2 py-1 rounded" />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="border px-2 py-1 rounded" />
        <input type="file" accept="image/*" onChange={handleFile} />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">{edit ? "Update" : "Add"} Blog</button>
      </form>
    </div>
  );
}