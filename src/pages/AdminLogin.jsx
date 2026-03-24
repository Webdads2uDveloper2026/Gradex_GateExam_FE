import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin(formData);
      onLogin(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 max-w-md w-full relative"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2">Admin Access</h1>
          <p className="text-gray-400">Enter your credentials to manage the portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[16px]  font-bold text-gray-400 ml-1">Email Address</label>
            <div className="relative mt-4">
              <Mail className="absolute left-4 top-[38px] -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="email"
                className="input-field pl-12 py-4"
                placeholder="admin@gradex.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[16px] font-bold text-gray-400 ml-1">Password</label>
            <div className="relative mt-4">
              <Lock className="absolute left-4 top-[38px] -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="password"
                className="input-field pl-12 py-4"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center shadow-xl hover:shadow-indigo-500/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Secure Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-600 uppercase tracking-widest font-bold">
          Graduate Entrance Excellence - Admin Portal
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
