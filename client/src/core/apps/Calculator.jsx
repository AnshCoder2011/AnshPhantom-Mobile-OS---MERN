import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useOSStore } from "../../store/useOSStore";
import { useGesture } from "@use-gesture/react";

export default function Calculator() {
  const closeApp = useOSStore((s) => s.closeApp);
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Swipe-to-close logic
  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bindClose = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (down) {
        if (my < 0) {
          dragY.set(my);
          const newScale = Math.max(0.9, 1 + my / 1000);
          dragScale.set(newScale);
        }
      } else {
        if (my < -100 || vy > 0.5) {
          closeApp();
        } else {
          animate(dragY, 0, { type: "spring", stiffness: 300, damping: 30 });
          animate(dragScale, 1, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
        }
      }
    },
  });

  const calculate = (prev, next, op) => {
    switch (op) {
      case "+":
        return prev + next;
      case "-":
        return prev - next;
      case "×":
        return prev * next;
      case "÷":
        return prev / next;
      default:
        return next;
    }
  };

  const handleDigit = useCallback(
    (digit) => {
      setDisplay((prev) => {
        if (waitingForOperand) {
          setWaitingForOperand(false);
          return String(digit);
        }
        if (prev.length >= 9) return prev;
        return prev === "0" ? String(digit) : prev + digit;
      });
    },
    [waitingForOperand],
  );

  const handleOperator = useCallback(
    (nextOp) => {
      const inputValue = parseFloat(display);
      if (prevValue === null) {
        setPrevValue(inputValue);
      } else if (operator && !waitingForOperand) {
        const result = calculate(prevValue, inputValue, operator);
        setPrevValue(result);
        setDisplay(String(result).slice(0, 10));
      }
      setWaitingForOperand(true);
      setOperator(nextOp);
    },
    [display, operator, prevValue, waitingForOperand],
  );

  const handleEqual = useCallback(() => {
    const inputValue = parseFloat(display);
    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      setDisplay(String(result).slice(0, 10));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, operator, prevValue]);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length > 1) return prev.slice(0, -1);
      return "0";
    });
  }, []);

  const clear = useCallback(() => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(parseInt(e.key));
      if (e.key === ".") !display.includes(".") && setDisplay(display + ".");
      if (e.key === "+") handleOperator("+");
      if (e.key === "-") handleOperator("-");
      if (e.key === "*" || e.key === "x") handleOperator("×");
      if (e.key === "/") handleOperator("÷");
      if (e.key === "Enter" || e.key === "=") handleEqual();
      if (e.key === "Backspace") handleBackspace();
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    display,
    handleDigit,
    handleOperator,
    handleEqual,
    handleBackspace,
    clear,
  ]);

  // Display swipe for backspace
  const bindBackspace = useGesture({
    onDragEnd: ({ movement: [mx] }) => {
      if (Math.abs(mx) > 50) handleBackspace();
    },
  });

  const buttons = [
    {
      label: display === "0" ? "AC" : "C",
      action: clear,
      color: "bg-neutral-300 text-black",
    },
    {
      label: "+/-",
      action: () =>
        setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display),
      color: "bg-neutral-300 text-black",
    },
    {
      label: "%",
      action: () => setDisplay(String(parseFloat(display) / 100)),
      color: "bg-neutral-300 text-black",
    },
    {
      label: "÷",
      action: () => handleOperator("÷"),
      color: "bg-orange-500",
      type: "operator",
    },
    { label: "7", action: () => handleDigit(7), color: "bg-neutral-800" },
    { label: "8", action: () => handleDigit(8), color: "bg-neutral-800" },
    { label: "9", action: () => handleDigit(9), color: "bg-neutral-800" },
    {
      label: "×",
      action: () => handleOperator("×"),
      color: "bg-orange-500",
      type: "operator",
    },
    { label: "4", action: () => handleDigit(4), color: "bg-neutral-800" },
    { label: "5", action: () => handleDigit(5), color: "bg-neutral-800" },
    { label: "6", action: () => handleDigit(6), color: "bg-neutral-800" },
    {
      label: "-",
      action: () => handleOperator("-"),
      color: "bg-orange-500",
      type: "operator",
    },
    { label: "1", action: () => handleDigit(1), color: "bg-neutral-800" },
    { label: "2", action: () => handleDigit(2), color: "bg-neutral-800" },
    { label: "3", action: () => handleDigit(3), color: "bg-neutral-800" },
    {
      label: "+",
      action: () => handleOperator("+"),
      color: "bg-orange-500",
      type: "operator",
    },
    {
      label: "0",
      action: () => handleDigit(0),
      color: "bg-neutral-800 col-span-2 text-left px-8",
    },
    {
      label: ".",
      action: () => !display.includes(".") && setDisplay(display + "."),
      color: "bg-neutral-800",
    },
    { label: "=", action: handleEqual, color: "bg-orange-500" },
  ];

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="flex flex-col h-full bg-black text-white p-6 pt-20 select-none touch-none"
    >
      {/* Display Area */}
      <div
        {...bindBackspace()}
        className="flex-1 flex flex-col justify-end items-end pb-8 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={display}
            initial={{ opacity: 0.8, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-light tracking-tight truncate w-full text-right transition-all duration-200 ${
              display.length > 7 ? "text-6xl" : "text-8xl"
            }`}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 mb-12">
        {buttons.map((btn, i) => {
          const isActive =
            btn.type === "operator" &&
            operator === btn.label &&
            waitingForOperand;
          return (
            <button
              key={i}
              onClick={btn.action}
              className={`${
                isActive ? "bg-white text-orange-500" : btn.color
              } ${
                btn.label === "0"
                  ? "col-span-2 rounded-[2.5rem]"
                  : "rounded-full"
              } aspect-square flex items-center justify-center text-3xl font-medium active:brightness-150 transition-all duration-200`}
              style={btn.label === "0" ? { aspectRatio: "auto" } : {}}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Swipe Handle Area */}
      <div
        {...bindClose()}
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50"
      >
        <div className="w-32 h-1.5 bg-white/40 rounded-full" />
      </div>
    </motion.div>
  );
}
