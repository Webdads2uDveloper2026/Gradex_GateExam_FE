import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestions, submitAssessment } from "../api";

const Assessment = ({ phone, language }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestions(phone, language);
        setQuestions(res.data);
      } catch (err) {
        alert("Failed to fetch questions. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [language]);

  const handleSelect = (optionIndex) => {
    setAnswers({ ...answers, [questions[currentIndex]._id]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const submissionData = Object.keys(answers).map((qid) => ({
      question_id: qid,
      selected_option: answers[qid],
    }));

    try {
      const res = await submitAssessment(phone, submissionData);
      localStorage.removeItem("time_left");
      localStorage.removeItem("exam_time");
      navigate("/results", { state: { result: res.data } });
    } catch (err) {
      alert("Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Number(localStorage.getItem("time_left"));
      if (timeLeft <= 0) {
        clearInterval(interval);

        if (!submitting) {
          handleSubmit();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submitting]);

  if (loading)
    return (
      <div className="text-white text-3xl font-bold flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        Loading assessment...
      </div>
    );

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-slate-950">
        <div className="glass-card p-12 max-w-lg w-full border-red-500/30">
          <h2 className="text-4xl font-black mb-4 text-white">
            No Questions Available
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We couldn't find any questions for your selected group. The
            administrator might be updating the question bank.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary py-4 px-12 font-bold w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / (questions.length || 1)) * 100;

  return (
    <div>
      <div className="min-h-screen flex  flex-col items-center justify-center p-4 sm:p-12 relative overflow-hidden">
        <div className="absolute top-12 md:top-5 left-4 md:left-10 right-10 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-4xl mt-10 md:mt-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card md:p-10  sm:p-16 mb-8 mt-6 md:mt-10"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-semibold mb-4 md:mb-12">
                {currentQ?.text}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQ?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`md:p-6 p-2 cursor-pointer rounded-2xl text-left transition-all border-2 text-lg font-medium ${answers[currentQ._id] === idx ? "bg-primary border-primary text-white shadow-lg" : "bg-slate-900 border-slate-800 text-gray-400 hover:border-indigo-500"}`}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-white/10 mr-4 text-center leading-8 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-12 mb-10">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="btn-primary md:py-4 md:px-10 bg-slate-800 hover:bg-slate-700 font-bold"
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={
                  submitting || Object.keys(answers).length < questions.length
                }
                className="btn-primary md:py-4 md:px-12 bg-green-600 hover:bg-green-500 font-bold shimmer"
              >
                <span className="hidden md:block">
                  {submitting ? "Submitting..." : "Finish Assessment"}
                </span>
                <span className="md:hidden">
                  {submitting ? "..." : "Finish"}
                </span>
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={answers[currentQ._id] === undefined}
                className=" inline-block text-center md:py-4 md:px-20 w-40 font-bold  text-md text-white  rounded-xl cursor-pointer
                       bg-linear-to-r from-[#1e2a5a] via-[#2f4fa2] to-[#5fa8ff]
                        hover:shadow-xl transition-all duration-300"
              >
                <span className="hidden md:block">Next Question</span>
                <span className="md:hidden">Next</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
