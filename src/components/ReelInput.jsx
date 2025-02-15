import { useState } from "react";
import { useReels } from "../context/ReelsContext";

export default function ReelInput() {
  const [reelUrl, setReelUrl] = useState("");
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [tags, setTags] = useState("");
  const { addReel } = useReels();

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
      collection: collection || "Uncategorized",
      tags: tags.split(",").map(tag => tag.trim()),
    };

    addReel(newReel);
    setReelUrl("");
    setTitle("");
    setCollection("");
    setTags("");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col w-full max-w-3xl">
      <input
        type="text"
        placeholder="Paste Instagram Reel URL..."
        value={reelUrl}
        onChange={(e) => setReelUrl(e.target.value)}
        className="p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Enter collection name..."
        value={collection}
        onChange={(e) => setCollection(e.target.value)}
        className="p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Enter tags (comma-separated)..."
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleSaveReel}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Save Reel
      </button>
    </div>
  );
}
