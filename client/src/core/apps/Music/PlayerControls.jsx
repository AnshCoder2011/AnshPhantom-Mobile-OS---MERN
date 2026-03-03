import React from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { motion } from "framer-motion";

const PlayerControls = ({ isPlaying, setIsPlaying, nextSong, prevSong }) => {
  return (
    <div className="flex items-center gap-10 text-3xl">
      <motion.button
        whileTap={{ scale: 0.8, x: -5 }}
        onClick={prevSong}
        className="text-white/80 active:text-white transition-colors"
      >
        <FaBackward />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white text-black p-5 rounded-full shadow-xl flex items-center justify-center"
      >
        {isPlaying ? (
          <FaPause size={20} />
        ) : (
          <FaPlay size={20} className="ml-1" />
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.8, x: 5 }}
        onClick={nextSong}
        className="text-white/80 active:text-white transition-colors"
      >
        <FaForward />
      </motion.button>
    </div>
  );
};

export default PlayerControls;
