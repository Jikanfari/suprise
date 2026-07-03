import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  lines: string[];
  typingSpeed?: number; // ms per character
  lineDelay?: number;   // ms before starting next line
}

export default function TypewriterText({
  lines,
  typingSpeed = 35,
  lineDelay = 600,
}: TypewriterTextProps) {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize typedLines array with empty strings
  useEffect(() => {
    setTypedLines(lines.map(() => ""));
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
  }, [lines]);

  // Typing logic
  useEffect(() => {
    if (lines.length === 0 || currentLineIndex >= lines.length) return;

    const currentFullLine = lines[currentLineIndex];

    // Handle empty line immediately
    if (currentFullLine === "") {
      const timer = setTimeout(() => {
        setTypedLines((prev) => {
          const next = [...prev];
          next[currentLineIndex] = "";
          return next;
        });
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay / 2);
      return () => clearTimeout(timer);
    }

    if (currentCharIndex < currentFullLine.length) {
      // Type next character
      const timer = setTimeout(() => {
        setTypedLines((prev) => {
          const next = [...prev];
          next[currentLineIndex] = currentFullLine.substring(0, currentCharIndex + 1);
          return next;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed + (Math.random() - 0.5) * 15); // Add organic variety to typing speed
      return () => clearTimeout(timer);
    } else {
      // Line is finished typing, wait then move to next line
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        
        // Gently scroll window to bottom as new lines appear
        try {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
          });
        } catch (e) {
          // Fallback if smooth scrolling isn't supported or errors
        }
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, typingSpeed, lineDelay]);

  return (
    <div ref={containerRef} className="space-y-4 max-w-xl mx-auto text-left font-serif text-base md:text-lg text-gray-200 leading-relaxed px-4">
      {typedLines.map((line, idx) => {
        const isCurrentLine = idx === currentLineIndex;
        const isFinishedLine = idx < currentLineIndex;

        // Skip rendering unreached lines
        if (idx > currentLineIndex) return null;

        // Render empty lines as spacers
        if (lines[idx] === "") {
          return <div key={idx} className="h-4" />;
        }

        return (
          <p key={idx} className="min-h-[1.5em] transition-opacity duration-300">
            {line}
            {isCurrentLine && (
              <span className="inline-block w-[3px] h-[1.25em] bg-pink-500 ml-1 typewriter-cursor align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}
