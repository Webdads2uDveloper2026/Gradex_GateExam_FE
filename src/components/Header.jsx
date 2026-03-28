import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <motion.div className="flex justify-start p-2">
      <Link to="/">
        <motion.img
          src={logo}
          alt="Gradex Logo"
          className="w-[181px] mb-2 object-contain cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      </Link>
    </motion.div>
  );
};

export default Header;
