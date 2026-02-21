import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import video from "../assets/Login.mp4";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] p-4 font-sans relative overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/10 blur-[120px] rounded-full"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-16 text-white flex flex-col justify-center">

          {/* Logo */}
          <div className="mb-10">
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <span className="text-black font-bold text-lg">C</span>
              </div>
              <span className="font-bold tracking-tight text-xl">
                ChatSphere
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Connect back.
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to jump back into the conversation.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-[#222] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium uppercase tracking-widest text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Forgot?
                </button>
              </div>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-[#222] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] mt-4"
            >
              {loading ? "Syncing..." : "Open Dashboard"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500 uppercase">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Signup */}
          <p className="mt-8 text-center text-sm text-gray-500">
            New to ChatSphere?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-emerald-500 font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-1/2 p-6">
          <div className="w-full bg-emerald-500 rounded-[28px] p-12 flex flex-col justify-between relative overflow-hidden group">

            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-black/10 text-black text-xs font-bold mb-6">
                v2.0 Now Live
              </div>

              <h2 className="text-black text-5xl font-extrabold leading-[1.1] mb-6">
                Messaging <br /> without <br /> borders.
              </h2>

              <p className="text-black/70 text-lg max-w-xs font-medium">
                Experience the next generation of real-time collaboration.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;