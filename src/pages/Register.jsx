import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerStudent, sendOTP } from "../api";
import logo from "../assets/logo.png";

const Register = ({ onNext }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "School",
    language: "English",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerStudent(formData);
      await sendOTP(formData.phone);
      onNext(formData.phone, formData.language);
      navigate("/otp");
    } catch (err) {
      alert(
        err.response?.data?.detail || "An error occurred during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 sm:p-10 max-w-lg w-full border rounded-t-xl border-indigo-500/30"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Gradex Logo" className="w-20  object-contain" />
        </div>
        <h2 className="md:text-3xl  text-center font-medium text-[20px] mb-8">
          Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-16 font-medium mb-2 text-gray-400">
              Language for Assessment
            </label>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className={`flex-1 cursor-pointer md:px-6  md:py-3 px-4 py-2 rounded-xl border-2 font-bold  transition-all ${formData.language === "English" ? "border-primary bg-primary/20 text-white" : "border-glass-border text-gray-400"}`}
                onClick={() =>
                  setFormData({ ...formData, language: "English" })
                }
              >
                English
              </button>
              <button
                type="button"
                className={`flex-1 cursor-pointer md:px-6  md:py-3 px-4 py-2 rounded-xl border-2 font-bold transition-all ${formData.language === "Tamil" ? "border-primary bg-primary/20 text-white" : "border-glass-border text-gray-400"}`}
                onClick={() => setFormData({ ...formData, language: "Tamil" })}
              >
                <span className="hidden md:block">தமிழ் (Tamil)</span>{" "}
                <span className="md:hidden">தமிழ்</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium mb-2 text-gray-400">
              Full Name
            </label>
            <input
              required
              name="name"
              className="input-field"
              placeholder="e.g. John Doe"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[16px] font-medium mb-2 text-gray-400">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              className="input-field"
              placeholder="john@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col ">
            <label className="text-[16px] font-medium mb-2  text-gray-400">
              Phone Number (with +CountryCode)
            </label>
            <input
              required
              name="phone"
              className="input-field"
              placeholder="+919000000000"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col ">
            <label className="text-[16px] font-medium mb-2 text-gray-400">
              Institution Type
            </label>
            <div className="flex space-x-4 gap-4">
              <label
                className={`flex-1 px-6 py-3 rounded-xl border-2 cursor-pointer  transition-all flex items-center justify-center font-bold ${formData.category === "School" ? "border-primary bg-primary/10" : "border-glass-border"}`}
                onClick={() => setFormData({ ...formData, category: "School" })}
              >
                School
              </label>
              <label
                className={`flex-1 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center font-bold ${formData.category === "College" ? "border-primary bg-primary/10" : "border-glass-border"}`}
                onClick={() =>
                  setFormData({ ...formData, category: "College" })
                }
              >
                College
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full md:py-4 md:text-lg text-sm mt-8"
            disabled={loading}
          >
            {loading ? "Processing..." : "Verify Phone Number"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
