import { useAuth } from "../context/AuthContext";

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-20">
      <div className="w-full bg-white rounded-t-lg p-6 transition-transform translate-y-0">
        <div className="flex flex-col items-center">
          {/* Profile Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300 text-2xl font-semibold text-gray-700">
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <p className="mt-2 text-lg font-semibold">{user?.email || "User"}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
            onClick={() => alert("View Profile clicked (Dummy)")}
          >
            View Profile
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Close Button */}
        <button
          className="w-full text-center text-gray-500 mt-4"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
