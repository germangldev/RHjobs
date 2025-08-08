import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(storedPosts);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-25 py-6 sm:py-10 md:py-20 lg:py-30 bg-light dark:bg-dark transition-colors">

      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <Link to="/blog/new" className="inline-block mb-6 px-4 py-2 bg-green-600 text-white rounded">
        + New Post
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="rounded-lg shadow hover:shadow-lg transition p-2"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="rounded-lg w-full h-60 object-cover"
              />
            )}
            <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
