import { useState, useRef } from "react";
import { motion } from "framer-motion";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => setTime((prev) => prev + 10), 10);
    }
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const ms = Math.floor((time % 1000) / 10);
    return {
      main: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      ms: ms.toString().padStart(2, "0"),
    };
  };

  const formatted = formatTime();

  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
      <div className="relative flex items-baseline mb-20">
        <h1 className="text-8xl font-extralight tabular-nums tracking-tighter">
          {formatted.main}
        </h1>
        <span className="text-4xl font-light text-zinc-500 tabular-nums ml-2">
          .{formatted.ms}
        </span>
      </div>

      <div className="flex justify-between w-full px-4">
        <button
          onClick={reset}
          className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium active:scale-95 transition-transform"
        >
          Reset
        </button>

        {!running ? (
          <button
            onClick={start}
            className="w-20 h-20 rounded-full bg-green-900/30 text-green-500 flex items-center justify-center font-medium active:scale-95 transition-transform"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="w-20 h-20 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center font-medium active:scale-95 transition-transform"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
