import { useState } from "react";
import SavedReels from "./SavedReels";
import AddReelModal from "../components/AddReelModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Instagram Reel Organizer</h1>
      <p className="text-gray-600 mb-6">Save & Organize your Instagram Reels easily!</p>

      {/* Display Saved Reels */}
      <div className="w-full max-w-3xl">
        <SavedReels />
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl"
      >
        +
      </button>

      {/* Full-Screen Modal */}
      <AddReelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
