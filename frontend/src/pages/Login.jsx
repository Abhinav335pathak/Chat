import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import video from "../assets/Login.mp4"

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] p-4 font-sans selection:bg-emerald-500/30 background-video">
      <video 
        autoPlay
       muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={video} type="video/mp4" />
      </video>
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600/10 blur-[120px] rounded-full"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">
        
        {/* Left Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-16 text-white flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <span className="text-black font-bold text-lg">C</span>
              </div>
              <span className="font-bold tracking-tight text-xl">ChatSphere</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Connect back.</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to jump back into the conversation.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest text-gray-500">Email Address</label>
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
                <label className="block text-xs font-medium uppercase tracking-widest text-gray-500">Password</label>
                <button type="button" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">Forgot?</button>
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

          {/* Navigation to Signup */}
          <p className="mt-8 text-center text-sm text-gray-500">
            New to ChatSphere?{' '}
            <button 
              onClick={() => navigate('/signup')} 
              className="text-emerald-500 font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Right Side: Feature Section */}
        <div className="hidden md:flex w-1/2 p-6">
          <div className="w-full bg-emerald-500 rounded-[28px] p-12 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            </div>

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

            {/* Testimonial Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
              <p className="text-gray-800 font-semibold italic text-sm mb-4">
                "The cleanest chat interface we've ever used. Integration took minutes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                   <img src="https://i.pravatar.cc/150?u=4" alt="user" />
                </div>
                <div>
                  <p className="text-black font-bold text-xs">Alex Rivera</p>
                  <p className="text-gray-500 text-[10px]">Lead Developer at TechEase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
