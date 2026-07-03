import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Lock, Unlock, Music, Volume2, VolumeX } from "lucide-react";
import { CONFIG } from "./config";
import BackgroundEffects from "./components/BackgroundEffects";
import LoadingScreen from "./components/LoadingScreen";
import QuotesModal from "./components/QuotesModal";
import TypewriterText from "./components/TypewriterText";
import { AmbientSynth } from "./components/AmbientSynth";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  
  // Audio handling
  const [audioSource, setAudioSource] = useState<"none" | "mp3" | "synth">("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Desktop cursor glow tracking
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [isDesktop, setIsDesktop] = useState(false);

  // Focus ref for input
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize synth
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    
    // Check if device is desktop for cursor glow
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 768 && !("ontouchstart" in window));
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Track cursor position
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  // Handle playing / pausing music and synthesis fallback
  const toggleMusic = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      // Pause both possible streams
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
      setAudioSource("none");
    } else {
      // Attempt to play MP3 first
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setAudioSource("mp3");
          })
          .catch((err) => {
            console.warn("MP3 play failed, falling back to Ambient Synthesizer:", err);
            // Fall back to our beautiful procedural Web Audio synthesizer
            if (synthRef.current) {
              synthRef.current.start();
              setAudioSource("synth");
            }
          });
      } else {
        // Direct synth start if audio tag isn't initialized
        if (synthRef.current) {
          synthRef.current.start();
          setAudioSource("synth");
        }
      }
    }
  };

  // Submit Password Validation
  const handleUnlock = (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const cleanInput = password.trim().toLowerCase();
    const cleanSecret = CONFIG.SECRET_CODE.trim().toLowerCase();

    if (cleanInput === cleanSecret) {
      // Success Unlock
      setIsUnlocked(true);
      setError("");
      
      // Haptic Vibration feedback on mobile (Vibration API)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch (err) {
          console.log("Vibrate not supported or allowed by iframe", err);
        }
      }
    } else {
      // Failure Shake
      setError("That's not the nickname I call you 😊");
      setIsShaking(true);
      
      // Reset shaking status after animation completes
      setTimeout(() => {
        setIsShaking(false);
      }, 400);

      // Vibration warning feedback on mobile
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(200);
        } catch (err) {}
      }
    }
  };

  // Handle auto-focusing on input when loading screen clears
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none bg-gradient-to-tr from-[#05030a] via-[#0d091a] to-[#160c29] text-white">
      {/* 1. Loading Overlay */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* 2. Audio Player (Muted by default to respect browser policies) */}
      <audio
        ref={audioRef}
        src={CONFIG.MUSIC_URL}
        loop
        className="hidden"
        onError={() => {
          // If MP3 fails to load, configure fallback
          if (!isMuted && audioSource === "none") {
            console.log("MP3 failed to load. Initiating ambient synthesiser...");
            if (synthRef.current) {
              synthRef.current.start();
              setAudioSource("synth");
            }
          }
        }}
      />

      {/* 3. High Performance Background Effects (Hearts, Stars, Rays, Explosion) */}
      <BackgroundEffects isUnlocked={isUnlocked} />

      {/* 4. Desktop Cursor Glow Effect */}
      {isDesktop && (
        <div
          className="pointer-events-none fixed z-10 w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(168, 85, 247, 0.03) 50%, rgba(0,0,0,0) 100%)",
            opacity: isLoading ? 0 : 1,
          }}
        />
      )}

      {/* Floating Sparkle accent details */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-float-medium pointer-events-none" />

      {/* Header Spacer (For vertical rhythm) */}
      <div className="h-12 md:h-16" />

      {/* 5. Main Screen Content Container */}
      <main className="flex-grow flex items-center justify-center px-4 relative z-20">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ==================== LANDING/PASSWORD STATE ==================== */
            <motion.div
              key="unlock-screen"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              <div className="relative glass-card glass-card-glow rounded-3xl p-8 md:p-10 text-center border border-pink-500/10 shadow-[0_15px_40px_rgba(236,72,153,0.05)]">
                {/* Decorative Heart Accent */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                  <Lock className="w-5 h-5 text-white" />
                </div>

                <div className="mt-4 mb-8">
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-100 tracking-tight leading-snug">
                    A Little Secret Awaits You <span className="text-rose-500 inline-block animate-heartbeat">❤️</span>
                  </h1>
                  <p className="font-serif italic text-xs md:text-sm text-gray-400 mt-3 leading-relaxed">
                    "Only one special person can unlock what's hidden here."
                  </p>
                </div>

                {/* Password Unlock Input Form */}
                <form onSubmit={handleUnlock} className="space-y-6">
                  <div className={`relative ${isShaking ? "shake-animation" : ""}`}>
                    <input
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(""); // Clear error on type
                      }}
                      placeholder="Enter your secret nickname..."
                      className="w-full px-6 py-4 rounded-full font-sans text-sm text-center text-white glass-input text-gray-100 placeholder-gray-500"
                    />

                    {/* Subtle inline feedback icon */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-500/50">
                      <Heart className={`w-4 h-4 fill-pink-500/10 ${password ? "animate-pulse" : ""}`} />
                    </div>
                  </div>

                  {/* Gentle Red Error Prompt */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-rose-400 text-xs font-serif italic text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="relative w-full py-4 px-6 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-display font-semibold tracking-wider text-sm shadow-[0_4px_25px_rgba(236,72,153,0.35)] hover:shadow-[0_4px_35px_rgba(236,72,153,0.6)] active:scale-98 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Glowing highlight reflection */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <span className="flex items-center justify-center gap-2">
                      Unlock Website <Sparkles className="w-4 h-4 text-yellow-200" />
                    </span>
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ==================== APPRECIATION STATE ==================== */
            <motion.div
              key="appreciation-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
              className="w-full max-w-2xl py-12"
            >
              <div className="glass-card glass-card-glow rounded-[40px] p-8 md:p-14 text-center border border-pink-500/10 shadow-[0_20px_60px_rgba(236,72,153,0.06)] relative overflow-hidden">
                {/* Visual backdrops inside card */}
                <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

                {/* Success Banner Title */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mb-8 flex flex-col items-center"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4 animate-float-medium">
                    <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
                    <span className="font-display font-medium text-[10px] tracking-widest uppercase text-pink-300">Unlocked Private Secret</span>
                  </div>

                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-rose-100 to-gray-100">
                    {CONFIG.APPRECIATION_TITLE}
                  </h1>
                </motion.div>

                {/* Glowing Circular Profile Photo */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 120 }}
                  className="relative mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full mb-10 group"
                >
                  {/* Glowing neon halo backing */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-rose-400 opacity-50 blur-xl group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                  
                  {/* Dual layered border wrapper */}
                  <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-600 to-rose-400">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0d091a]">
                      <img
                        src={CONFIG.PHOTO_URL}
                        alt="Truly Special Portrait"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          // Clean visual fallback if file isn't uploaded yet
                          (e.currentTarget as HTMLImageElement).src =
                            "https://picsum.photos/seed/romantic/400/400?blur=1";
                        }}
                      />
                    </div>
                  </div>

                  {/* Tiny floating particle decorations around photo */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#18112e] border border-pink-500/30 flex items-center justify-center text-xs shadow-md animate-bounce">
                    ✨
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#18112e] border border-purple-500/30 flex items-center justify-center text-xs shadow-md animate-pulse">
                    💖
                  </div>
                </motion.div>

                {/* Interactive Letter Body via Typewriter */}
                <div className="relative border-t border-white/5 pt-8 mb-4">
                  <TypewriterText lines={CONFIG.APPRECIATION_MESSAGE} typingSpeed={30} lineDelay={600} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. Floating Controls Footer Row (Music & Quotes) */}
      <div className="relative z-30 px-6 py-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        
        {/* Play/Pause Background Music control */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className={`p-3.5 rounded-full ${
              isMuted
                ? "bg-white/5 border border-white/10 text-gray-400"
                : "bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            } transition-all duration-300 flex items-center justify-center cursor-pointer`}
            title="Toggle Music"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
          </motion.button>
          
          <AnimatePresence>
            {!isMuted && audioSource !== "none" && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-mono text-[9px] text-pink-300 tracking-wider uppercase hidden sm:inline"
              >
                {audioSource === "mp3" ? "music.mp3 🎵" : "Ambient Synth 🎹"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Small Elegant Footer Credits */}
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
          Made with <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 inline-block mx-0.5" /> just for you.
        </p>

        {/* Quotes trigger and optional popup */}
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsQuotesOpen(true)}
            className="p-3.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center justify-center animate-float-medium cursor-pointer"
            title="A Sweet Reminder"
          >
            <Heart className="w-5 h-5 fill-white animate-pulse" />
          </motion.button>

          <QuotesModal isOpen={isQuotesOpen} onClose={() => setIsQuotesOpen(false)} />
        </div>
      </div>
    </div>
  );
}
