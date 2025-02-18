import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleSharedReel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReelURL = params.get("url");

    if (sharedReelURL) {
      console.log("🔗 Shared URL detected:", sharedReelURL);

      // Check if inside the PWA
      if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
        console.log("✅ Opened inside PWA, redirecting...");
        navigate(`/add-reel?url=${encodeURIComponent(sharedReelURL)}`);
      } else {
        console.log("🚨 Not inside PWA, prompting to open PWA...");
        window.location.href = `https://yourpwa.com/?source=pwa&url=${encodeURIComponent(sharedReelURL)}`;
      }
    }
  }, []);

  return null;
};

export default HandleSharedReel;
