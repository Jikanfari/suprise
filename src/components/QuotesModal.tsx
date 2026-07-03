import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, X } from "lucide-react";
import { CONFIG } from "../config";

interface QuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuotesModal({ isOpen, onClose }: QuotesModalProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const handleNextQuote = () => {
    let nextIndex = Math.floor(Math.random() * CONFIG.SWEET_QUOTES.length);
    // Avoid showing the exact same quote twice in a row if possible
    if (nextIndex === currentQuoteIndex && CONFIG.SWEET_QUOTES.length > 1) {
      nextIndex = (nextIndex + 1) % CONFIG.SWEET_QUOTES.length;
    }
    setCurrentQuoteIndex(nextIndex);
  };

  const currentQuote = CONFIG.SWEET_QUOTES[currentQuoteIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Translucent overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Luxury Modal Body */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md glass-card glass-card-glow rounded-3xl p-8 text-center border border-pink-500/20 shadow-[0_20px_50px_rgba(244,63,94,0.15)] overflow-hidden"
          >
            {/* Glowing gradient lights in modal background */}
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing heart symbol at the top */}
            <div className="relative flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400"
              >
                <Heart className="w-6 h-6 fill-pink-500/30" />
              </motion.div>
              <Sparkles className="absolute -top-1 right-1/3 w-4 h-4 text-yellow-300 animate-pulse" />
            </div>

            {/* Sweet quote text content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="min-h-[90px] flex items-center justify-center px-4"
              >
                <p className="font-serif italic text-lg text-gray-100 leading-relaxed">
                  "{currentQuote}"
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Luxury divider line */}
            <div className="my-6 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/30" />
              <Heart className="w-2 h-2 text-pink-500/40 fill-pink-500/30" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/30" />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleNextQuote}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-display font-medium tracking-wide text-sm shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:shadow-[0_4px_25px_rgba(236,72,153,0.5)] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Next Quote ✨
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2.5 px-6 rounded-full text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
