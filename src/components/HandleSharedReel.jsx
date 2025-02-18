import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleSharedReel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReelURL = params.get("url");

    if (sharedReelURL) {
      // Redirect to add reel page with pre-filled URL
      navigate(`/add-reel?url=${encodeURIComponent(sharedReelURL)}`);
    }
  }, []);

  return null;
};

export default HandleSharedReel;
