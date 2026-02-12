"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const [dark, setDark] = useState(true);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <main
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Right Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-sm hover:scale-105 transition"
        >
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Floating Bookmark Cards */}
      <motion.div
        className="absolute top-24 left-16 bg-indigo-500/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-indigo-400/30 shadow-lg"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        🔖 ChatGPT Docs
      </motion.div>

      <motion.div
        className="absolute bottom-28 right-20 bg-pink-500/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-pink-400/30 shadow-lg"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        🔖 Next.js Guide
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-10 bg-cyan-500/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-cyan-400/30 shadow-lg"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        🔖 Node.js API
      </motion.div>

      {/* Main Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/10 p-14 rounded-3xl shadow-2xl border border-white/20 max-w-2xl text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6">
          Smart Bookmark Vault
        </h1>

        <p className="text-xl mb-6">
          <Typewriter
            words={[
              "Save smarter.",
              "Organize beautifully.",
              "Access instantly.",
              "Private. Real-time. Secure.",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </p>

        <p className="opacity-80 mb-10">
          A modern bookmark manager designed for speed,
          clarity and seamless sync across your devices.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="px-10 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
        >
          Continue with Google
        </motion.button>
      </motion.div>
    </main>
  );
}
