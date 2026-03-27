import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TextCycle = ({ texts }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={texts[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className=" text-[22px]"
        >
          {texts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
