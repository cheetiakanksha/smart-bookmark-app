"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">

      {/* Floating Background Blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/10 p-12 rounded-3xl shadow-2xl border border-white/20 max-w-xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Smart Bookmark Vault
        </h1>

        <p className="text-lg opacity-90 mb-4">
          Save it. Organize it. Access it anywhere.
        </p>

        <p className="text-sm opacity-75 mb-8">
          Your private, real-time bookmark manager built for speed and simplicity.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="px-8 py-3 bg-black text-white rounded-xl font-medium shadow-lg hover:bg-gray-900 transition"
        >
          Continue with Google
        </motion.button>
      </motion.div>
    </main>
  );
}
