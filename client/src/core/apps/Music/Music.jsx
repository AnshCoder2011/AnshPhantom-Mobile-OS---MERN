import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import musicData from "./musicData";
import PlayerControls from "./PlayerControls";
import { useOSStore } from "../../../store/useOSStore";

const Music = () => {
  // ✅ Correctly pull the close function
  const closeApp = useOSStore((state) => state.closeApp);

  const [songs] = useState(musicData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentSong = songs[currentIndex];
  const y = useMotionValue(0);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, currentIndex]);

  const nextSong = () => setCurrentIndex((prev) => (prev + 1) % songs.length);
  const prevSong = () =>
    setCurrentIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));

  const handleTimeUpdate = () => {
    const cur = audioRef.current?.currentTime || 0;
    const dur = audioRef.current?.duration || 0;
    setDuration(dur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ✅ Drag to close logic
  const handleDragEnd = (event, info) => {
    // If pulled down more than 150px or flicked fast
    if (info.offset.y > 150 || info.velocity.y > 800) {
      closeApp();
    } else {
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <motion.div
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      className="relative w-full h-full overflow-hidden bg-black text-white"
    >
      {/* 1. Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSong.cover}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSong.cover}
            className="w-full h-full object-cover scale-150 blur-[80px] opacity-40"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Top Navigation Bar (The "Back" Button) */}
      <div className="relative z-20 w-full h-20 flex items-center px-6 justify-between pt-4">
        <motion.button
          whileTap={{ scale: 0.9, opacity: 0.6 }}
          onClick={() => closeApp()} // 🔥 This returns you to Home Screen
          className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
            Playing From Library
          </span>
          <span className="text-[13px] font-semibold">
            {currentSong.artist}
          </span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer for symmetry */}
      </div>

      {/* 3. Main Content */}
      <div className="relative z-10 flex flex-col items-center px-8 h-[calc(100%-120px)] justify-around">
        <motion.div
          animate={{ scale: isPlaying ? 1 : 0.88 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="w-full aspect-square max-w-[310px] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
          <img
            src={currentSong.cover}
            className="w-full h-full object-cover"
            alt="cover"
          />
        </motion.div>

        <div className="w-full">
          <motion.h2
            key={currentSong.title}
            className="text-2xl font-bold tracking-tight"
          >
            {currentSong.title}
          </motion.h2>
          <p className="text-xl text-white/50">{currentSong.artist}</p>

          <div className="mt-8">
            <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[12px] font-medium opacity-40 tabular-nums">
              <span>{formatTime(audioRef.current?.currentTime)}</span>
              <span>
                -{formatTime(duration - (audioRef.current?.currentTime || 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center pb-12">
          <PlayerControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            nextSong={nextSong}
            prevSong={prevSong}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />

      {/* 4. Home Indicator (Visual Clue to Swipe Up) */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none pb-2">
        <div className="w-32 h-1.5 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  );
};

export default Music;
