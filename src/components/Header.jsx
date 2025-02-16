import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import { FiUser } from "react-icons/fi";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <h1 className="text-xl font-semibold">Reel Organizer</h1>
      
      {/* Show profile icon only if the user is logged in */}
      {user && (
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200"
        >
          {user.email ? (
            <span className="text-lg font-bold text-gray-700">
              {user.email[0].toUpperCase()}
            </span>
          ) : (
            <FiUser className="text-gray-500 text-xl" />
          )}
        </button>
      )}

      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
}
