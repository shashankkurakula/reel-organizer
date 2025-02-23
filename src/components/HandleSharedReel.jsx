import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Detect local vs production URL
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://192.168.4.100:5173" // Local testing IP
    : "https://reel-organizer.vercel.app"; // Production URL

const HandleSharedReel = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReelURL = params.get("url");

    if (sharedReelURL) {
      console.log("🔗 Shared URL detected:", sharedReelURL);

      // Prevent infinite loop by checking if we're already on /add-reel
      if (location.pathname === "/add-reel") {
        console.log("⚠️ Already on /add-reel, stopping redirect loop.");
        return;
      }

      // Detect if app is running inside a PWA
      const isInPWA =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone;

      // Detect if the device is iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isInPWA) {
        console.log("✅ Opened inside PWA, redirecting...");
        navigate(`/add-reel?url=${encodeURIComponent(sharedReelURL)}`);
      } else if (isIOS && isSafari) {
        console.log("📱 iOS detected, PWA not opened automatically.");

        // Show an alert to guide the user
        alert("⚠️ Open this link in the installed PWA for the best experience. Close Safari and open the PWA manually.");

        // Redirect to PWA URL
        window.location.href = `${BASE_URL}/add-reel?url=${encodeURIComponent(sharedReelURL)}`;
      } else {
        console.log("🤖 Android detected, trying intent:// scheme...");

        // Android: Use intent:// to open installed PWA
        const intentURL = `intent://add-reel?url=${encodeURIComponent(sharedReelURL)}#Intent;scheme=https;package=com.android.chrome;end;`;

        window.location.href = intentURL;

        // Fallback: If PWA is not installed, open in browser
        setTimeout(() => {
          window.location.href = `${BASE_URL}/add-reel?url=${encodeURIComponent(sharedReelURL)}`;
        }, 2000);
      }
    }
  }, [navigate, location]); // Include location in dependencies

  return null;
};

export default HandleSharedReel;
