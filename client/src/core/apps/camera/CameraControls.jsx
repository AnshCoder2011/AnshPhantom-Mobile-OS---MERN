import { motion } from "framer-motion";

export default function CameraControls({
  hasPhoto,
  onCapture,
  onSwitch,
  onClosePreview,
  bindSwipe,
  lastPhoto,
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-10">
      <div className="p-6 pt-12 flex justify-between items-center pointer-events-auto">
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
          ⚡
        </button>
        <button className="px-4 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold">
          1x
        </button>
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
          ⚙️
        </button>
      </div>

      <div className="relative bg-gradient-to-t from-black/90 via-black/20 to-transparent pt-20 pb-10 px-8 pointer-events-auto">
        <div className="flex justify-between items-center mb-8 px-4">
          {/* Thumbnail Preview of Last Photo */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 overflow-hidden"
          >
            {lastPhoto ? (
              <img
                src={lastPhoto}
                className="w-full h-full object-cover"
                alt="last"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20 text-[10px]">
                IMG
              </div>
            )}
          </motion.div>

          {!hasPhoto ? (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onCapture}
              className="w-20 h-20 rounded-full border-[4px] border-white p-1"
            >
              <div className="w-full h-full rounded-full bg-white" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClosePreview}
              className="w-20 h-20 rounded-full border-[4px] border-white flex items-center justify-center bg-white/10 text-white text-2xl"
            >
              ✕
            </motion.button>
          )}

          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={onSwitch}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl"
          >
            🔄
          </motion.button>
        </div>

        <div className="flex justify-center gap-6 text-white text-[10px] font-bold uppercase tracking-widest opacity-60 pb-4">
          <span>Video</span> <span className="text-yellow-400">Photo</span>{" "}
          <span>Portrait</span>
        </div>

        <div
          {...bindSwipe()}
          className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center"
        >
          <div className="w-32 h-1.5 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
