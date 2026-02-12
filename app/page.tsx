"use client";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6">
          Smart Bookmark Vault
        </h1>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-80"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
