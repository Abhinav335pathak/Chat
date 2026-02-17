import React from "react";
import { verifyOtpRegister } from "../services/api";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();

  const verifyemail = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    const otpToken = localStorage.getItem("otpToken");

    try {
      const response = await verifyOtpRegister(otp, otpToken);
      navigate("/"); 
    } catch (error) {
      console.error("OTP Verification failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] p-4">
      {/* Background Blur Effect */}
      <div className="absolute w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full" />

      <div className="relative w-full max-w-md bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-gray-400 text-sm mb-8">We've sent a 6-digit verification code to your inbox. Enter it below to secure your account.</p>

        <form onSubmit={verifyemail} className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              name="otp" 
              placeholder="0 0 0 0 0 0" 
              maxLength="6"
              required 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 text-center text-2xl font-mono tracking-[0.5em] text-emerald-500 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
            />
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95">
            Verify & Finish
          </button>
        </form>

        <div className="mt-8">
           <p className="text-xs text-gray-600">Didn't receive a code?</p>
           <button className="text-xs text-emerald-500 font-bold hover:underline mt-1">Resend Code</button>
        </div>
      </div>
    </div>
  );
};

export default Verify;