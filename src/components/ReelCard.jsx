import { useReels } from "../context/ReelsContext";
import { FaTrash } from "react-icons/fa";

export default function ReelCard({ reel }) {
  const { deleteReel } = useReels();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this reel?")) {
      deleteReel(reel.id);
    }
  };

  return (
    <div className="relative p-4 bg-white shadow-md rounded-lg">
      {/* Trash Icon for Deleting */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTrash size={16} />
      </button>

      <img src={reel.thumbnail} alt={reel.title} className="w-full rounded-md" />
      <h2 className="text-lg font-semibold mt-2">{reel.title}</h2>

      {/* Collections */}
      <p className="text-sm text-gray-500">Collections:</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {reel.collections.map((col) => (
          <span key={col} className="px-2 py-1 bg-blue-100 rounded-md text-sm">{col}</span>
        ))}
      </div>

      {/* Tags */}
      <p className="text-sm text-gray-500">Tags:</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {reel.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-green-100 rounded-md text-sm">{tag}</span>
        ))}
      </div>

      <a
        href={reel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 mt-2 block"
      >
        View on Instagram
      </a>
    </div>
  );
}
