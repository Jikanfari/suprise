/**
 * Romantic Surprise Website - Configurable Parameters
 * Grouped together to make editing simple and fast.
 */

export const CONFIG = {
  // 1. Secret Nickname / Code
  // The person must enter this exact word (case-insensitive) to unlock the website.
  SECRET_CODE: "Softie",

  // 2. Profile Image Path
  // Put your image in the public folder (e.g. /public/imtinan.jpeg)
  PHOTO_URL: "/imtinan.jpeg",

  // 3. Background Music Path
  // Put your MP3 in the public folder (e.g. /public/music.mp3)
  // If the file is not found or cannot be played, we fall back to a beautiful
  // real-time Web Audio API synthesizer that plays a soothing, warm, romantic ambient chord progression!
  MUSIC_URL: "/music.mp3",

  // 4. Appreciation Page Header
  APPRECIATION_TITLE: "For Someone Truly Special ❤️ Adam Fari(Jikan_fari)",

  // 5. Beautiful Appreciation Message (lines will be typed out or animated gracefully)
  APPRECIATION_MESSAGE: [
    "Hey Imtinan,",
    "",
    "If you're reading this, it means you unlocked the little secret I made just for you. ❤️",
    "",
    "I wanted to create something different—not because words alone aren't enough, but because you deserve something made with thought and care.",
    "",
    "Thank you for being such an incredible person. Your kindness, your beautiful heart, your smile, and the positive energy you bring into the lives of those around you are truly special. You have a way of making ordinary moments feel brighter, and that is a gift not everyone has.",
    "",
    "Sometimes people don't hear how much they are appreciated, so I wanted to make sure you do. Thank you for being yourself, for the laughter we've shared, for the memories we've created, and for simply existing as the wonderful person you are.",
    "",
    "No matter where life takes you, I hope you continue chasing your dreams with confidence, smiling through every challenge, and believing in yourself even on the difficult days. You are stronger, wiser, and more amazing than you probably realize.",
    "",
    "Never let anyone make you doubt your worth. Keep being kind. Keep shining your light. Keep inspiring people without even trying.",
    "",
    "This little website is my way of saying that you matter, you are valued, and someone genuinely appreciates having you in their life.",
    "",
    "May your days be filled with happiness, your heart with peace, and your future with endless success and beautiful moments. You deserve every good thing that comes your way.",
    "",
    "Thank you for being you.",
    "",
    "Always remember: you are appreciated more than words can ever express. ❤️"
  ],

  // 6. Random Sweet Quotes (shown in elegant popups when clicking the bottom-right heart)
  SWEET_QUOTES: [
    "❤️ Some people make the world brighter simply by being in it. You're one of them.",
    "🌸 Never forget how deeply appreciated you are.",
    "✨ Your smile has a way of making everything feel a little better.",
    "💖 You're a beautiful reminder that kindness still exists.",
    "🌷 You may not realize it, but you leave happiness wherever you go.",
    "🌙 The world is a better place because you're in it.",
    "🌹 You're rare, genuine, and truly unforgettable.",
    "🌼 Stay exactly who you are—the world needs more people like you.",
    "💫 You deserve every happiness life has to offer.",
    "❤️ Your heart is one of the most beautiful things about you.",
    "🌺 Thank you for being a chapter worth remembering.",
    "✨ Keep smiling. It suits you more than you know.",
    "🌸 You are loved, appreciated, and valued more than words can express.",
    "🌙 Some people cross our paths and quietly change our lives for the better. Thank you for being one of them.",
    "💖 No matter where life takes you, never doubt how special you are.",
    "🌹 May your heart always find peace, your dreams find wings, and your smile never fade.",
    "✨ You're not just appreciated today—you'll always have a special place in my heart.",
    "❤️ This little surprise is only a small reflection of how much I appreciate you.",
    "🌷 Always remember: you are enough, you are amazing, and you are deeply appreciated.",
    "💫 If kindness had a face, it would look a lot like yours."
  ],

  // 7. Core Style & Colors (tailored for luxurious dark purple-pink-gold aesthetic)
  THEME: {
    accentGlow: "rgba(236, 72, 153, 0.4)", // glowing pink
    cardBg: "rgba(15, 12, 26, 0.6)" // deep elegant translucent purple-slate
  }
};
