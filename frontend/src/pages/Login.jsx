import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";


function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/login", loginData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", response.data.user.email);

    toast.success("Login successful!");
    
    window.location.href = "/dashboard";
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>

        <p className="text-slate-500 mt-2">
          Login to manage your live polls
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={loginData.email}
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
              value={loginData.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;