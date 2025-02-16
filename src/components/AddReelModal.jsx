import { useState } from "react";
import { useReels } from "../context/ReelsContext";

export default function AddReelModal({ isOpen, onClose }) {
  const {
    addReel,
    collections,
    addCollection,
    deleteCollection,
    tags,
    addTag,
    deleteTag,
  } = useReels();
  const [reelUrl, setReelUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newCollection, setNewCollection] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  if (!isOpen) return null;

  const extractThumbnail = (url) => {
    const reelId = url.split("/reel/")[1]?.split("/")[0];
    return reelId
      ? `https://www.instagram.com/p/${reelId}/media/?size=l`
      : null;
  };

  const handleSaveReel = () => {
    if (!reelUrl.includes("instagram.com/reel/")) {
      alert("Invalid Instagram Reel URL!");
      return;
    }

    const thumbnail = extractThumbnail(reelUrl);
    if (!thumbnail) {
      alert("Could not extract thumbnail!");
      return;
    }

    const newReel = {
      url: reelUrl,
      thumbnail,
      title: title || "Untitled",
      collections: selectedCollections,
      tags: selectedTags,
    };

    addReel(newReel);
    setReelUrl("");
    setTitle("");
    setSelectedCollections([]);
    setSelectedTags([]);
    onClose();
  };

  const handleAddCollection = () => {
    const newCollections = newCollection
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col !== "" && !collections.includes(col));

    newCollections.forEach((col) => addCollection(col));
    setSelectedCollections([...selectedCollections, ...newCollections]);
    setNewCollection("");
  };

  const handleAddTag = () => {
    const newTags = newTag
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !tags.includes(tag));

    newTags.forEach((tag) => addTag(tag));
    setSelectedTags([...selectedTags, ...newTags]);
    setNewTag("");
  };

  const toggleCollectionSelection = (col) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const toggleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDeleteCollection = (name) => {
    if (
      window.confirm(
        `Are you sure you want to delete the collection "${name}"? This will remove it from all reels.`
      )
    ) {
      deleteCollection(name);
    }
  };

  const handleDeleteTag = (name) => {
    if (
      window.confirm(
        `Are you sure you want to delete the tag "${name}"? This will remove it from all reels.`
      )
    ) {
      deleteTag(name);
    }
  };

  const visibleCollections = showAllCollections
    ? collections
    : collections.slice(0, 6);
  const visibleTags = showAllTags ? tags : tags.slice(0, 6);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white w-full h-[80vh] p-4 rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-red-500">
            Cancel
          </button>
          <button onClick={handleSaveReel} className="text-green-500">
            Save
          </button>
        </div>
        <input
          type="text"
          placeholder="Paste Instagram Reel URL..."
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
          className="p-2 border rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded-md w-full mb-2"
        />
        {/* Collections */}
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
                onClick={() => handleDeleteCollection(col)}
                className="text-red-500 text-xs"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
        {collections.length > 6 && (
          <button
            onClick={() => setShowAllCollections(!showAllCollections)}
            className="text-blue-500 text-sm"
          >
            {showAllCollections ? "Show Less" : "Show More"}
          </button>
        )}
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
        {/* Tags */}
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
                onClick={() => handleDeleteTag(tag)}
                className="text-red-500 text-xs"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
        {tags.length > 6 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-blue-500 text-sm"
          >
            {showAllTags ? "Show Less" : "Show More"}
          </button>
        )}
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
      </div>
    </div>
  );
}
