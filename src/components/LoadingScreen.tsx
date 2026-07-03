import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [statusText, setStatusText] = useState("Whispering secrets...");
  const [isVisible, setIsVisible] = useState(true);

  const statuses = [
    "Whispering secrets...",
    "Arranging stars...",
    "Gathering warmth...",
    "Almost ready..."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setStatusText(statuses[index]);
    }, 700);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600); // Wait for the exit animation to complete before calling onComplete
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07050e] text-white"
        >
          {/* Ambient golden and purple backdrop glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-900/10 blur-[120px] pointer-events-none" />

          {/* Central Heart Animation */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Pulsing ring 1 */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-pink-500/30"
            />
            {/* Pulsing ring 2 */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
              className="absolute w-24 h-24 rounded-full border border-rose-500/10"
            />

            {/* Main pulsing heart icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 0.95, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)] cursor-default"
            >
              <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
            </motion.div>
          </div>

          {/* Elegant Status Typography */}
          <div className="text-center">
            <motion.h2
              initial={{ letterSpacing: "0.1em" }}
              animate={{ letterSpacing: "0.18em" }}
              transition={{ duration: 2 }}
              className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gray-300 mb-2"
            >
              Romantic Secret
            </motion.h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={statusText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="font-serif italic text-xs text-rose-300"
              >
                {statusText}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Luxury bottom ornament line */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 flex items-center justify-between">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/40" />
            <Heart className="w-2.5 h-2.5 text-pink-500/40 fill-pink-500/20" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
