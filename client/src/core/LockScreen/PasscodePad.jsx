import { motion } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import { useEffect } from "react";

export default function PasscodePad() {
  const { showPasscode, passcode, addDigit, deleteDigit, checkPasscode } =
    useOSStore();


  // Auto-check when 4 digits entered
  useEffect(() => {
    if (passcode.length === 4) {
      checkPasscode(passcode);
    }
  }, [passcode]);

  if (!showPasscode) return null;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      className="absolute inset-0 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-white z-20"
    >
      <h2 className="text-xl mb-6">Enter Passcode</h2>

      {/* PASSCODE DOTS */}
      <div className="flex gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border border-white ${
              passcode.length > i ? "bg-white" : ""
            }`}
          />
        ))}
      </div>

      {/* NUMBER PAD */}
      <div className="grid grid-cols-3 gap-6">
        {numbers.map((num, index) => {
          if (num === "") return <div key={index}></div>;

          if (num === "del") {
            return (
              <button
                key={index}
                onClick={deleteDigit}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-xl active:scale-90 transition"
              >
                ⌫
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => addDigit(num.toString())}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-xl active:scale-90 transition"
            >
              {num}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
