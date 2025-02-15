import { useState } from "react";
import { useReels } from "../context/ReelsContext";

export default function AddReelModal({ isOpen, onClose }) {
  const { addReel, collections, addCollection, tags, addTag } = useReels();
  const [reelUrl, setReelUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newCollection, setNewCollection] = useState("");
  const [newTag, setNewTag] = useState("");

  if (!isOpen) return null;

  const extractThumbnail = (url) => {
    const reelId = url.split("/reel/")[1]?.split("/")[0];
    return reelId ? `https://www.instagram.com/p/${reelId}/media/?size=l` : null;
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
      .filter((col) => col !== "" && !collections.includes(col)); // Ensure unique values

    newCollections.forEach((col) => addCollection(col));
    setSelectedCollections([...selectedCollections, ...newCollections]);
    setNewCollection("");
  };

  const handleAddTag = () => {
    const newTags = newTag
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !tags.includes(tag)); // Ensure unique values

    newTags.forEach((tag) => addTag(tag));
    setSelectedTags([...selectedTags, ...newTags]);
    setNewTag("");
  };

  const toggleCollectionSelection = (col) => {
    if (selectedCollections.includes(col)) {
      setSelectedCollections(selectedCollections.filter((c) => c !== col));
    } else {
      setSelectedCollections([...selectedCollections, col]);
    }
  };

  const toggleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white w-full h-[80vh] p-4 rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-red-500">Cancel</button>
          <button onClick={handleSaveReel} className="text-green-500">Save</button>
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

        {/* Collections Input */}
        <label className="block mb-1">Select Collections:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {collections.map((col) => (
            <span
              key={col}
              onClick={() => toggleCollectionSelection(col)}
              className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                selectedCollections.includes(col) ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {col}
            </span>
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
          <button onClick={handleAddCollection} className="bg-blue-500 text-white px-2 py-1 rounded-md">
            Add
          </button>
        </div>

        {/* Selected Collections */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCollections.map((col) => (
            <span key={col} className="px-2 py-1 bg-blue-200 rounded-md text-sm">{col}</span>
          ))}
        </div>

        {/* Tags Input */}
        <label className="block mb-1">Select Tags:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              onClick={() => toggleTagSelection(tag)}
              className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                selectedTags.includes(tag) ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {tag}
            </span>
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
          <button onClick={handleAddTag} className="bg-green-500 text-white px-2 py-1 rounded-md">
            Add
          </button>
        </div>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-green-200 rounded-md text-sm">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
