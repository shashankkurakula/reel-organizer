import ReelInput from "../components/ReelInput";
import SavedReels from "./SavedReels";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Instagram Reel Organizer</h1>
      <p className="text-gray-600 mb-6">Save & Organize your Instagram Reels easily!</p>

      {/* Input Field to Add Reels */}
      <ReelInput />

      {/* Display Saved Reels */}
      <div className="w-full max-w-3xl mt-6">
        <SavedReels />
      </div>
    </div>
  );
}
