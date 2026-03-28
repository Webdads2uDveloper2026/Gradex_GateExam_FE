import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import CourseLoop from "../components/CourseLoop";

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
    <>
      <div className="flex flex-col items-center justify-center   text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass-card p-12 max-w-7xl w-full flex flex-col items-center"
        >
          <motion.img
            src={Gradex}
            alt="GATE-X Logo"
            className="w-48 md:w-100 object-contain opacity-90 mb-6"
            variants={fadeUp}
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div variants={fadeUp} className="mb-4">
            <TextCycle texts={texts} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-lg md:text-xl font-semibold mb-1"
          >
            GATE-X Scholarship Exam at Gradex | Up to 80% Discount on Tech
            Courses
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm md:text-base mb-6 ">
            Join the GATE-X Scholarship Exam by Gradex and get up to 80%
            scholarship on courses like Python, Data Analytics, Full-Stack,
            UI/UX, Graphic Design & Digital Marketing.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="w-full my-10 overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4">Courses Covered</h3>

            <CourseLoop courses={courses} />
            <motion.div variants={fadeUp} className="w-full mt-6">
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
    </>
  );
};

export default Landing;
