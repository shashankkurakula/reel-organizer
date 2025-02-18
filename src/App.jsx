import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ReelsProvider } from "./context/ReelsContext";
import Home from "./pages/Home";
import SavedReels from "./pages/SavedReels";
import AuthPage from "./pages/AuthPage";
import AddReelPage from "./pages/AddReelPage"; // Import AddReelPage
import Header from "./components/Header";
import HandleSharedReel from "./components/HandleSharedReel";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

export default function App() {
  return (
    <AuthProvider>
      <ReelsProvider>
        <Router>
          <HandleSharedReel />
          <Header />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedReels /></ProtectedRoute>} />
            <Route path="/add-reel" element={<ProtectedRoute><AddReelPage /></ProtectedRoute>} /> 
          </Routes>
        </Router>
      </ReelsProvider>
    </AuthProvider>
  );
}
