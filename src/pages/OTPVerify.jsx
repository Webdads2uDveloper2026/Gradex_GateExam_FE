import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyOTP } from "../api";

const OTPVerify = ({ phone, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOTP(phone, otp);
      const examTime = res.data.exam_time;
      localStorage.setItem("exam_time", examTime);
      onVerified(examTime);
      navigate("/assessment");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-md w-full"
      >
        <h2 className="md:text-3xl text-[36px] font-bold text-center mb-8 ">
          Verify Account
        </h2>
        <p className="text-center text-[18px] text-gray-400 mb-4">
          Please enter the 4-digit code sent to your phone
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="text-[12px] mb-4 font-medium  text-gray-400">
              One-Time Password (OTP)
            </label>
            <input
              required
              className="input-field text-center text-2xl tracking-widest font-bold h-16"
              placeholder="0000"
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full inline-block text-center py-2  text-md text-white font-medium rounded-xl cursor-pointer
                       bg-linear-to-r from-[#1e2a5a] via-[#2f4fa2] to-[#5fa8ff]
                        hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Continue to Assessment"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
