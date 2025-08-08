
export default function BlogPost() {
  

  // Podrías obtener el contenido real desde un backend o archivo
  const post = {
    title: "Announcing our $10M Seed Round",
    date: "Jun 17, 2025",
    content: `Aquí iría el texto completo del post, cargado desde el backend o estático.`,
  };

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-8">{post.date}</p>
      <div className="prose prose-lg">
        <p>{post.content}</p>
      </div>
    </div>
  );
}
