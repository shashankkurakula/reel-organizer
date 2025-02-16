import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function AuthPage() {
  const { signUp, login, logout, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" }); // Stores error/success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Reset message on new attempt

    try {
      if (isLogin) {
        await login(email, password);
        setMessage({ type: "success", text: "✅ Login successful! Redirecting..." });
        setTimeout(() => navigate("/"), 2000);
      } else {
        await signUp(email, password);
        setMessage({ type: "success", text: "✅ Account created successfully! Redirecting..." });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    let errorMessage = "An error occurred. Please try again.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "⚠️ This email is already registered. Try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage = "⚠️ Invalid email format. Please enter a valid email.";
          break;
        case "auth/weak-password":
          errorMessage = "⚠️ Password must be at least 6 characters long.";
          break;
        case "auth/user-not-found":
          errorMessage = "⚠️ No account found with this email. Sign up first.";
          break;
        case "auth/wrong-password":
          errorMessage = "⚠️ Incorrect password. Please try again.";
          break;
        default:
          errorMessage = "⚠️ " + error.message;
      }
    }
    
    setMessage({ type: "error", text: errorMessage });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>

          {/* Show error/success messages */}
          {message.text && (
            <div
              className={`mb-3 px-4 py-2 text-white rounded-md ${
                message.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-80">
            <input
              type="email"
              placeholder="Email"
              className="border rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 mt-4">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </>
      )}
    </div>
  );
}
