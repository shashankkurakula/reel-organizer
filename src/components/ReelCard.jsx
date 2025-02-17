import { useReels } from "../context/ReelsContext";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import AddReelModal from "./AddReelModal";

export default function ReelCard({ reel }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative p-4 bg-white shadow-md rounded-lg">
      {/* Edit Icon (Replaces Delete) */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
      >
        <FaEdit size={16} />
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

      {/* Open Edit Modal */}
      {isEditing && (
        <AddReelModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          reelToEdit={reel} // Pass reel data for editing
        />
      )}
    </div>
  );
}
