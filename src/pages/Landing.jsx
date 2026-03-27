import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { TextCycle } from "../utils/TextCycle";
import Gradex from "../assets/Gate-x-Logo.svg";
import {
  FaPython,
  FaChartBar,
  FaReact,
  FaLaptopCode,
  FaRobot,
  FaBook,
  FaPaintBrush,
  FaPalette,
  FaBullhorn,
} from "react-icons/fa";

const courses = [
  { icon: <FaPython />, title: "Advanced Python" },
  { icon: <FaChartBar />, title: "Data Analytics" },
  { icon: <FaReact />, title: "Full-Stack React Development" },
  { icon: <FaLaptopCode />, title: "Full-Stack Python Development" },
  { icon: <FaRobot />, title: "Python Data Science" },
  { icon: <FaBook />, title: "Python Basic" },
  { icon: <FaPaintBrush />, title: "UI/UX Design" },
  { icon: <FaPalette />, title: "Graphic Design" },
  { icon: <FaBullhorn />, title: "Digital Marketing" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const texts = ["Skill Assessment Panel", "Learn Smart", "Test Your Skills"];

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="glass-card p-12 max-w-5xl w-full flex flex-col items-center"
      >
        <motion.img
          src={logo}
          alt="Gradex Logo"
          className="w-40 mb-2 object-contain"
          variants={fadeUp}
        />
        <motion.img
          src={Gradex}
          alt="GATE-X Logo"
          variants={fadeUp}
          className="w-48 md:w-70 object-contain opacity-90 mb-6"
        />
        <motion.div variants={fadeUp} className="mb-8">
          <TextCycle texts={texts} />
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-lg md:text-xl font-semibold mb-2"
        >
          GATE-X Scholarship Exam at Gradex | Up to 80% Discount on Tech Courses
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sm md:text-base mb-6 ">
          Join the GATE-X Scholarship Exam by Gradex and get up to 80%
          scholarship on courses like Python, Data Analytics, Full-Stack, UI/UX,
          Graphic Design & Digital Marketing.
        </motion.p>

        <motion.div variants={fadeUp} className="w-full my-10 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Courses Covered</h3>

          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          >
            {[...courses, ...courses].map((course, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center min-w-[121px]"
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
          <motion.div variants={fadeUp} className="w-full mt-10">
            <Link
              to="/register"
              className="w-100 inline-block text-center py-3 text-white font-semibold rounded
                       bg-linear-to-r from-[#1e2a5a] via-[#2f4fa2] to-[#5fa8ff]
                       hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Go to Assessment
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
