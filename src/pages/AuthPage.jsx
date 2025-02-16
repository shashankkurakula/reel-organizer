import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { signUp, login, logout, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("❌ Authentication Error:", error.message);
    }
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
