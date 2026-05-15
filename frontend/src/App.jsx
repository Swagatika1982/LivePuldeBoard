import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import PublicPoll from "./pages/PublicPoll";
import Analytics from "./pages/Analytics";
import Results from "./pages/Results";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    setIsLoggedIn(false);

    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl text-indigo-600">
        PulseBoard LivePoll
      </h1>

      <div className="flex gap-4 items-center">
        {isLoggedIn && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {" "}
            <Link to="/create-poll">Create Poll</Link>
          </>
        )}
        {" "} 
        <br />
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <> <br />
            <span className="text-sm text-slate-600">
              Hi, {user?.name}
            </span>
            {" "}
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200">
        <Navbar />
        <Toaster position="top-right" />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-poll"
            element={
              <ProtectedRoute>
                <CreatePoll />
              </ProtectedRoute>
            }
          />

          <Route path="/poll/:pollId" element={<PublicPoll />} />

          <Route
            path="/analytics/:pollId"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route path="/results/:pollId" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;