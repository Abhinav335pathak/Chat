import React from 'react';
import { register } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import video from "../assets/Login.mp4"

const Signup = () => {
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    const name = `${e.target.first_name.value} ${e.target.last_name.value}`;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await register(name, email, password);
      localStorage.setItem("otpToken", response.data.otpToken);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] p-4 font-sans">
        <video 
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover z-0">
              <source src={video} type="video/mp4" />
            </video>
      <div className="relative w-full max-w-5xl bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">
        
        {/* Left Side: Signup Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join the ChatSphere community today.</p>
          </div>

          <form onSubmit={registerUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">First Name</label>
                <input name="first_name" type="text" required className="w-full bg-[#222] border border-white/5 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Last Name</label>
                <input name="last_name" type="text" required className="w-full bg-[#222] border border-white/5 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
              <input name="email" type="email" required className="w-full bg-[#222] border border-white/5 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Password</label>
              <input name="password" type="password" required className="w-full bg-[#222] border border-white/5 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all" />
            </div>

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="text-emerald-500 font-semibold hover:underline">Log in</button>
          </p>
        </div>

        {/* Right Side: Visual Side */}
        <div className="hidden md:flex w-1/2 p-6 bg-[#111]">
          <div className="w-full bg-emerald-500 rounded-[24px] p-10 flex flex-col justify-end relative overflow-hidden">
             <div className="absolute top-10 left-10 text-black/20 text-9xl font-black select-none">JOIN</div>
             <div className="relative z-10">
                <h2 className="text-black text-4xl font-black leading-tight mb-4">Start your<br/>conversation.</h2>
                <p className="text-black/60 font-medium">Fast, secure, and encrypted end-to-end.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;