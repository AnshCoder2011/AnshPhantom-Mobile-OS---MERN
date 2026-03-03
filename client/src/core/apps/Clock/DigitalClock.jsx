import { useEffect, useState } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full pt-10">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-8xl font-thin tracking-tighter">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </h1>
        <p className="text-zinc-500 text-lg font-medium uppercase tracking-widest mt-2">
          {time.toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <h3 className="text-zinc-400 font-semibold text-sm uppercase px-2">
          Sleep | Wake Up
        </h3>
        <div className="bg-zinc-900/50 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-zinc-400 text-sm">Tomorrow Morning</p>
            <p className="text-2xl font-semibold">07:00</p>
          </div>
          <div className="w-12 h-7 bg-zinc-800 rounded-full relative">
            <div className="absolute left-1 top-1 w-5 h-5 bg-zinc-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
