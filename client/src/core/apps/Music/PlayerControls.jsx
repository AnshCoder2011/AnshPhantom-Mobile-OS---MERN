import React from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const PlayerControls = ({ isPlaying, setIsPlaying, nextSong, prevSong }) => {
  return (
    <div className="flex items-center gap-8 text-2xl">
      <button onClick={prevSong} className="hover:scale-125 transition">
        <FaBackward />
      </button>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white text-black p-4 rounded-full hover:scale-110 transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <button onClick={nextSong} className="hover:scale-125 transition">
        <FaForward />
      </button>
    </div>
  );
};

export default PlayerControls;
