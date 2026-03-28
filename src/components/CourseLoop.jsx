import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const CourseLoop = ({ courses }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth / 2);
    }
  }, [courses]);

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        ref={containerRef}
        className="flex gap-12 items-center"
        animate={{ x: [0, -width] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {[...courses, ...courses].map((course, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-center min-w-[122px] shrink-0"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-6xl text-white mb-2">{course.icon}</span>
            <span className="text-xs md:text-sm text-white/80 text-center">
              {course.title}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CourseLoop;
