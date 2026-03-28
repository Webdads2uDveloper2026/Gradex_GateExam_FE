import { useEffect, useState } from "react";

const Timer = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("time_left");
    const exam = localStorage.getItem("exam_time");
    if (saved) return Number(saved);
    return exam ? Number(exam) * 60 : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("time_left", timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp && onTimeUp();
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center text-xl font-bold">
      ⏳ {minutes}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default Timer;
