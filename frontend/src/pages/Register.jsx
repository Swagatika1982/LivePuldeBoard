import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/register", user);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", response.data.user.email);

    toast.success("Account created successfully!");
    window.location.href = "/dashboard";
  } catch (error) {
    toast.error(error.response?.data?.message || "Register failed");
  }
};

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>

        <p className="text-slate-500 mt-2">
          Start creating live polls and collecting responses
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              value={user.password}
              onChange={handleChange}
              type="password"
              placeholder="Create password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
            Create Account
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;