import { useReels } from "../context/ReelsContext";
import ReelCard from "../components/ReelCard";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function SavedReels() {
  const { reels, searchResults, searchReels } = useReels();
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    searchReels(query);
  };

  const clearSearch = () => {
    setSearch("");
    searchReels(""); // Reset search to show all reels
  };

  // Default to all reels if searchResults is empty
  const displayReels = search ? searchResults : reels;

  return (
    <div className="w-full max-w-3xl p-4">
      {/* Search Box with Clear Button */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title, collection, or tags..."
          className="p-2 border rounded-md mb-4 w-full pr-10"
          value={search}
          onChange={handleSearchChange}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2 text-gray-500"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

      {/* Display Reels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayReels.length > 0 ? (
          displayReels.map((reel) => <ReelCard key={reel.id} reel={reel} />)
        ) : (
          <p className="text-gray-500">No reels found!</p>
        )}
      </div>
    </div>
  );
}
