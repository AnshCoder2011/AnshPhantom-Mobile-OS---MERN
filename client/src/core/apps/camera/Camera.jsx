import { useEffect, useRef, useState } from "react";
import CameraControls from "./CameraControls";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useOSStore } from "../../../store/useOSStore";
import { useGesture } from "@use-gesture/react";
import { savePhoto, getPhotos } from "../../../utils/photoStorage";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const closeApp = useOSStore((s) => s.closeApp);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [lastPhoto, setLastPhoto] = useState(null);

  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bind = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
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

  useEffect(() => {
    const photos = getPhotos();
    if (photos.length > 0) setLastPhoto(photos[0]);
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setLoading(false);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Trigger Shutter Animation
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 100);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    savePhoto(imageData); // Save to Storage
    setLastPhoto(imageData); // Update Gallery Thumb
    setPhoto(imageData); // Show Preview
  };

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full bg-black relative flex flex-col select-none touch-none overflow-hidden rounded-[40px]"
    >
      <AnimatePresence>
        {isShutterActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[100]"
          />
        )}
      </AnimatePresence>

      {!photo && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {photo && (
        <img
          src={photo}
          alt="Captured"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {loading && !photo && (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}

      <CameraControls
        hasPhoto={!!photo}
        onCapture={capturePhoto}
        onSwitch={() =>
          setFacingMode((f) => (f === "user" ? "environment" : "user"))
        }
        onClosePreview={() => setPhoto(null)}
        bindSwipe={bind}
        lastPhoto={lastPhoto}
      />
    </motion.div>
  );
}
