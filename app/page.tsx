"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const [dark, setDark] = useState(false);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  // Generate 40 floating dots
  const dots = Array.from({ length: 40 }, (_, i) => ({
    key: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 6 + 4}px`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <main
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ===== Floating Dots ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((dot) => (
          <div
            key={dot.key}
            className={`absolute rounded-full opacity-30 animate-float ${
              dark ? "bg-cyan-400/30" : "bg-yellow-300/30"
            }`}
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* ===== Dark/Light Mode Toggle ===== */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setDark(!dark)}
          className={`px-4 py-2 text-sm rounded-lg border backdrop-blur-md transition hover:scale-105 ${
            dark
              ? "border-white/20 bg-white/5"
              : "border-gray-300 bg-white"
          }`}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* ===== Main Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative max-w-xl w-full mx-6 p-16 rounded-3xl shadow-2xl text-center border backdrop-blur-xl transition-colors ${
          dark
            ? "bg-white/5 border border-white/10"
            : "bg-white border border-gray-200"
        }`}
      >
        <h1 className="text-5xl font-bold mb-6">
          Smart Bookmark Vault
        </h1>

        <p className="text-lg mb-6 opacity-80">
          <Typewriter
            words={[
              "Save your links beautifully.",
              "Access anywhere, anytime.",
              "Private, minimal, elegant.",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
          />
        </p>

        <p className="text-gray-500 mb-10 opacity-80">
          A neat and simple bookmark manager that feels premium and minimal.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className={`px-8 py-4 font-semibold rounded-xl shadow-md transition ${
            dark
              ? "bg-cyan-400/30 text-gray-900 hover:opacity-90"
              : "bg-yellow-300 text-gray-900 hover:opacity-90"
          }`}
        >
          Continue with Google
        </motion.button>
      </motion.div>

      {/* ===== Soft Glow Behind Card ===== */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
          dark ? "bg-cyan-500/20" : "bg-yellow-200/20"
        }`}
      />

      {/* ===== Floating Animation Keyframes ===== */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
      `}</style>
    </main>
  );
}
