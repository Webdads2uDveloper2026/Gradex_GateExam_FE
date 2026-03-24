import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import image1 from '../assets/gradexlogo.webp'

const Landing = () => {
  const registerUrl = `${window.location.origin}/register`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 max-w-md w-full flex flex-col items-center"
      >
        <h1 className="md:text-4xl text-[30px] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Gradex Academy
        </h1>
        {/* <img src={image1} alt="Gradex Logo" className="w-32 h-32 mb-4" /> */}

        <p className="text-gray-400 mb-8 italic">Skill Assessment Panel</p>
        
        <div className="bg-white p-4 rounded-2xl shadow-xl mb-8">
          <QRCodeSVG value={registerUrl} size={200} />
        </div>
        
        <p className="text-sm text-gray-500 mb-8">Scan to begin registration</p>
        
        <Link to="/register" className="btn-primary w-full inline-block text-center py-3 no-underline">
          Go to Assessment
        </Link>
      </motion.div>
    </div>
  );
};

export default Landing;
