import { useState, useEffect } from "react";
import { useReels } from "../context/ReelsContext";

export default function AddReelModal({ isOpen, onClose, reelToEdit }) {
  const {
    addReel,
    updateReel, // New function for updating reels
    deleteReel,
    collections,
    addCollection,
    deleteCollection,
    tags,
    addTag,
    deleteTag,
  } = useReels();

  // State Variables
  const [title, setTitle] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newCollection, setNewCollection] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [reelUrl, setReelUrl] = useState("");

  // Populate Fields for Editing Mode
  useEffect(() => {
    if (reelToEdit) {
      setTitle(reelToEdit.title || "");
      setSelectedCollections(reelToEdit.collections || []);
      setSelectedTags(reelToEdit.tags || []);
      setThumbnail(reelToEdit.thumbnail || null);
      setReelUrl(reelToEdit.url || "");
    } else {
      setTitle("");
      setSelectedCollections([]);
      setSelectedTags([]);
      setThumbnail(null);
      setReelUrl("");
    }
  }, [reelToEdit]);

  if (!isOpen) return null;

  // Handle Save (Add or Update)
  const handleSaveReel = () => {
    if (!title.trim()) {
      alert("Title cannot be empty!");
      return;
    }

    const updatedReel = {
      id: reelToEdit ? reelToEdit.id : null, // Preserve ID when updating
      url: reelToEdit ? reelToEdit.url : reelUrl, // URL cannot be changed
      thumbnail,
      title: title.trim(),
      collections: selectedCollections,
      tags: selectedTags,
    };

    if (reelToEdit) {
      updateReel(updatedReel); // Update existing reel
    } else {
      addReel(updatedReel); // Add new reel
    }

    onClose();
  };

  // Handle Reel Deletion
  const handleDeleteReel = () => {
    if (window.confirm("Are you sure you want to delete this reel?")) {
      deleteReel(reelToEdit.id);
      onClose();
    }
  };

  // Handle Adding Collection
  const handleAddCollection = () => {
    const newCollections = newCollection
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col !== "" && !collections.includes(col));

    newCollections.forEach((col) => addCollection(col));
    setSelectedCollections([...selectedCollections, ...newCollections]);
    setNewCollection("");
  };

  // Handle Adding Tags
  const handleAddTag = () => {
    const newTags = newTag
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !tags.includes(tag));

    newTags.forEach((tag) => addTag(tag));
    setSelectedTags([...selectedTags, ...newTags]);
    setNewTag("");
  };

  // Toggle Collection Selection
  const toggleCollectionSelection = (col) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Toggle Tag Selection
  const toggleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // UI Adjustments
  const visibleCollections = showAllCollections
    ? collections
    : collections.slice(0, 6);
  const visibleTags = showAllTags ? tags : tags.slice(0, 6);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full h-[80vh] p-4 rounded-t-2xl overflow-hidden">
        {/* Scrollable content wrapper */}
        <div className="h-full overflow-y-auto p-2">
          <div className="flex justify-between items-center mb-4">
            <button onClick={onClose} className="text-red-500">
              Cancel
            </button>
            <button onClick={handleSaveReel} className="text-green-500">
              {reelToEdit ? "Update" : "Save"}
            </button>
          </div>

          {/* Show Thumbnail in Edit Mode, URL Input for New Reel */}
          {reelToEdit ? (
            thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-full max-h-40 object-contain rounded-md mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No Thumbnail</span>
              </div>
            )
          ) : (
            <input
              type="text"
              placeholder="Paste Instagram Reel URL..."
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              className="p-2 border rounded-md w-full mb-2"
            />
          )}

          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-md w-full mb-2"
          />

          {/* Collections Section */}
          <label className="block mb-1">Select Collections:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {visibleCollections.map((col) => (
              <div key={col} className="flex items-center space-x-1">
                <span
                  onClick={() => toggleCollectionSelection(col)}
                  className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                    selectedCollections.includes(col)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {col}
                </span>
                <button
                  onClick={() => deleteCollection(col)}
                  className="text-red-500 text-xs"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          {/* Add New Collection */}
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="New Collection (comma-separated)"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              className="p-2 border rounded-md flex-grow"
            />
            <button
              onClick={handleAddCollection}
              className="bg-blue-500 text-white px-2 py-1 rounded-md"
            >
              Add
            </button>
          </div>

          {/* Tags Section */}
          <label className="block mb-1">Select Tags:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {visibleTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-1">
                <span
                  onClick={() => toggleTagSelection(tag)}
                  className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                    selectedTags.includes(tag)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {tag}
                </span>
                <button
                  onClick={() => deleteTag(tag)}
                  className="text-red-500 text-xs"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          {/* Add New Tag */}
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="New Tag (comma-separated)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="p-2 border rounded-md flex-grow"
            />
            <button
              onClick={handleAddTag}
              className="bg-green-500 text-white px-2 py-1 rounded-md"
            >
              Add
            </button>
          </div>

          {/* Delete Button in Edit Mode */}
          {reelToEdit && (
            <button
              onClick={handleDeleteReel}
              className="w-full bg-red-500 text-white py-2 rounded-md mt-4"
            >
              Delete Reel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
