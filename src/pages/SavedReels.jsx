import { useReels } from "../context/ReelsContext";
import ReelCard from "../components/ReelCard";
import { useState } from "react";

export default function SavedReels() {
  const { reels } = useReels();
  const [search, setSearch] = useState("");

  const filteredReels = reels.filter((reel) =>
    reel.title.toLowerCase().includes(search.toLowerCase()) ||
    reel.collection.toLowerCase().includes(search.toLowerCase()) ||
    reel.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full max-w-3xl">
      <input
        type="text"
        placeholder="Search by title, collection, or tags..."
        className="p-2 border rounded-md mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReels.length > 0 ? (
          filteredReels.map((reel) => <ReelCard key={reel.id} reel={reel} />)
        ) : (
          <p className="text-gray-500">No reels found!</p>
        )}
      </div>
    </div>
  );
}
