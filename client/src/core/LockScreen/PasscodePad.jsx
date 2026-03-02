import { useOSStore } from "../../store/useOSStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PasscodePad() {
  const { showPasscode, passcode, addDigit, deleteDigit, checkPasscode } =
    useOSStore();

  // Auto-check when 4 digits entered
  useEffect(() => {
    if (passcode.length === 4) {
      // Delay slightly for visual feedback of the 4th dot filling
      const timer = setTimeout(() => {
        checkPasscode(passcode);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [passcode, checkPasscode]);

  const numMap = [
    { n: 1, l: "" },
    { n: 2, l: "A B C" },
    { n: 3, l: "D E F" },
    { n: 4, l: "G H I" },
    { n: 5, l: "J K L" },
    { n: 6, l: "M N O" },
    { n: 7, l: "P Q R S" },
    { n: 8, l: "T U V" },
    { n: 9, l: "W X Y Z" },
    { n: "", l: "" },
    { n: 0, l: "" },
    { n: "del", l: "" },
  ];

  if (!showPasscode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center z-20"
    >
      <div className="text-center mb-10">
        <h2 className="text-lg font-semibold tracking-tight">Enter Passcode</h2>

        {/* Passcode Dots */}
        <div className="flex gap-5 mt-6 justify-center">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: passcode.length === i ? 1.2 : 1,
                backgroundColor:
                  passcode.length > i
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0)",
              }}
              className="w-3.5 h-3.5 rounded-full border-[1.5px] border-white"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5">
        {numMap.map((item, i) => {
          if (item.n === "") return <div key={i} />;
          if (item.n === "del")
            return (
              <button
                key={i}
                onClick={deleteDigit}
                className="w-20 h-20 flex items-center justify-center text-sm font-medium active:opacity-40"
              >
                Delete
              </button>
            );

          return (
            <button
              key={i}
              onClick={() => addDigit(item.n.toString())}
              className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/40 transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-3xl font-light">{item.n}</span>
              <span className="text-[10px] font-bold tracking-widest mt-0.5 opacity-80">
                {item.l}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
