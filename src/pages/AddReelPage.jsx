import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddReelModal from "../components/AddReelModal";

export default function AddReelPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // Modal starts open

  useEffect(() => {
    // Close modal and return to Home when closed
    if (!isOpen) {
      navigate("/");
    }
  }, [isOpen, navigate]);

  return (
    <AddReelModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
