import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReelsProvider } from "./context/ReelsContext";
import Home from "./pages/Home";
import SavedReels from "./pages/SavedReels";

export default function App() {
  return (
    <ReelsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<SavedReels />} />
        </Routes>
      </Router>
    </ReelsProvider>
  );
}
