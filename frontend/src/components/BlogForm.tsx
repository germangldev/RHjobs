import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title,
      image,
      content,
      date: new Date().toLocaleDateString(),
    };

    const existingPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    localStorage.setItem("blogPosts", JSON.stringify([newPost, ...existingPosts]));

    navigate("/blog");
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Publish
        </button>
      </form>
    </div>
  );
}
