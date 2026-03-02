import { useEffect, useState, useCallback } from "react";
import { getPhotos, deletePhoto } from "../../../utils/photoStorage";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useOSStore } from "../../../store/useOSStore";
import { useGesture } from "@use-gesture/react";
import {
  Trash2,
  Share,
  Heart,
  Info,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const closeApp = useOSStore((s) => s.closeApp);
  const activeApp = useOSStore((s) => s.activeApp);

  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  // ✅ Step 1: Memoize the fetch function
  const refreshGallery = useCallback(() => {
    const data = getPhotos();
    setPhotos(data);
  }, []);

  // ✅ Step 2: Refresh when app opens or becomes active
  useEffect(() => {
    if (activeApp === "Photos") {
      refreshGallery();
    }
  }, [activeApp, refreshGallery]);

  const bindExit = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (selectedPhotoIndex !== null) return;
      if (down) {
        if (my < 0) {
          dragY.set(my);
          dragScale.set(Math.max(0.9, 1 + my / 1000));
        }
      } else {
        if (my < -100 || vy > 0.5) closeApp();
        else {
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

  const handleDelete = (index) => {
    deletePhoto(index);
    refreshGallery(); // Refresh after delete
    setSelectedPhotoIndex(null);
  };

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full bg-black text-white relative flex flex-col select-none touch-none overflow-hidden rounded-[40px]"
    >
      <div className="flex-1 overflow-y-auto p-4 pt-12 pb-20 scrollbar-hide">
        <div className="flex justify-between items-end mb-6 px-2">
          <h1 className="text-4xl font-bold">Photos</h1>
          <span className="text-blue-500 font-medium">Select</span>
        </div>

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-white/20 italic">
            No Photos
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[2px]">
            {photos.map((photo, index) => (
              <motion.div
                layoutId={`photo-${index}`}
                key={index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="aspect-square relative"
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="p-4 pt-12 flex justify-between items-center bg-black">
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-2"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => handleDelete(selectedPhotoIndex)}
                className="p-2 text-red-500"
              >
                <Trash2 size={24} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <motion.img
                layoutId={`photo-${selectedPhotoIndex}`}
                src={photos[selectedPhotoIndex]}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPhotoIndex === null && (
        <div
          {...bindExit()}
          className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center z-50"
        >
          <div className="w-32 h-1.5 bg-white/20 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}
