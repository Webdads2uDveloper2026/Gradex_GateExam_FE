import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Trophy, ArrowLeft } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const result = location.state?.result;

  const [score, setScore] = useState(0);
  const [scholarship, setScholarship] = useState(0);

  if (!result) return <Navigate to="/" />;

  const isEligible = result.scholarship > 0;

  // 🔥 Counter Animation
  useEffect(() => {
    let scoreStart = 0;
    let scholarshipStart = 0;

    const duration = 1000; // animation time
    const incrementTime = 20;

    const scoreStep = Math.ceil(result.score / (duration / incrementTime));
    const scholarshipStep = Math.ceil(result.scholarship / (duration / incrementTime));

    const interval = setInterval(() => {
      scoreStart += scoreStep;
      scholarshipStart += scholarshipStep;

      if (scoreStart >= result.score) scoreStart = result.score;
      if (scholarshipStart >= result.scholarship) scholarshipStart = result.scholarship;

      setScore(scoreStart);
      setScholarship(scholarshipStart);

      if (scoreStart === result.score && scholarshipStart === result.scholarship) {
        clearInterval(interval);
      }
    }, incrementTime);

    return () => clearInterval(interval);
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-8 md:mt-10 p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card md:p-12 sm:p-20 max-w-2xl w-full flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className='flex gap-10 mt-20 md:mt-0 md:block'>
            <div className="md:w-24 md:h-24 w-12 md:bg-green-500/10 rounded-full flex items-center justify-center mb-8 md:border md:border-green-500/20">
            <Trophy size={48} className="text-green-500" />
        </div>
        
        <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Assessment Completed!
        </h2>
        </div>

        <p className="text-gray-400 mb-4 md:mb-12 text-[18px]">
          Thank you for participating in the Gradex Skill Assessment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:mb-12 mb-8">
            {/* Score */}
            <div className="md:p-8 p-2 rounded-3xl bg-slate-900/50 border border-glass-border flex flex-col items-center">
                <span className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-bold">
                  Your Score
                </span>
                <span className="text-5xl font-black text-white">
                  {Math.round(score)}%
                </span>
            </div>
            
            {/* Scholarship */}
            <div className={`md:p-8 p-4 rounded-3xl border flex flex-col items-center ${
              isEligible 
                ? 'bg-indigo-500/10 border-indigo-500/30' 
                : 'bg-red-500/10 border-red-500/20 opacity-50'
            }`}>
                <span className="text-sm text-indigo-300 uppercase tracking-widest mb-2 font-bold">
                  Scholarship Eligibility
                </span>
                <div className="flex items-center gap-4 space-x-2">
                    <Award className={isEligible ? 'text-indigo-400' : 'text-red-400'} />
                    <span className={`text-5xl font-black ${
                      isEligible ? 'text-white' : 'text-gray-500 line-through'
                    }`}>
                      {Math.round(scholarship)}%
                    </span>
                </div>
            </div>
        </div>

        {/* Result Message */}
        {isEligible ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-green-500/20 text-green-400 p-6 rounded-2xl w-full mb-12 border border-green-500/30 font-medium"
            >
                Congratulations! You are eligible for a scholarship based on your performance.
            </motion.div>
        ) : (
            <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl w-full mb-12 border border-red-500/20 font-medium">
                Minimum score for scholarship not reached. Keep practicing!
            </div>
        )}

        {/* Back Button */}
        <div className="w-full">
            <Link 
              to="/" 
              className="btn-primary w-full py-5 flex items-center justify-center font-black text-xl shadow-2xl"
            >
                <ArrowLeft size={20} className="mr-3" />
                Back to Home Page
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;