import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";

const BottomGestureBar = () => {
  const closeApp = useOSStore((s) => s.closeApp);
  const y = useMotionValue(0);

  // iOS-style scale down as you pull up to close
  const scale = useTransform(y, [0, -200], [1, 0.85]);
  const opacity = useTransform(y, [0, -200], [1, 0]);

  const handleDragEnd = (_, info) => {
    // iOS gesture is usually swipe UP to close
    if (info.offset.y < -100 || info.velocity.y < -500) {
      closeApp();
    } else {
      animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] flex items-end justify-center">
      {/* Invisible handle that actually receives the drag */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -200, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="w-full h-10 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center pb-2"
      >
        <div className="w-28 h-1.5 bg-gray-400/60 rounded-full" />
      </motion.div>
    </div>
  );
};

export default BottomGestureBar;
