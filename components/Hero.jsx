"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // next 13 app router
import { fredoka } from "../app/fonts";
import { supabase } from "@/lib/supabaseClient";

export default function Hero() {
  const router = useRouter(); // init router
  const slides = [
    { title: "Add URL", desc: "Paste your link and save instantly.", color: "#FFD6E8" },
    { title: "Manage", desc: "Delete or open bookmarks easily.", color: "#D6F5FF" },
    { title: "Access Anywhere", desc: "Your bookmarks are available anytime.", color: "#E7FFD6" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
 

  const handleLogin = async () => {
  

    const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`, // dynamic URL
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
    return;
  }

  // Supabase will automatically redirect to /dashboard after login
};

  
  return (
    <section className="hero">
      <div className="hero-container">
        {/* LEFT SIDE */}
        <div className="hero-left">
          <h1 className={`hero-heading ${fredoka.className}`}>
            <span className="small-text">Super</span>
            <span className="big-text">Bookmarks</span>
          </h1>
          <p className="hero-subtext">
            Save, organize and access your favorite links beautifully.
          </p>
          <button className="primary-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

        {/* RIGHT SIDE - AUTO SLIDER */}
        <div className="hero-right">
          <div
            className="slider-card"
            style={{ backgroundColor: slides[index].color }}
          >
            <h3>{slides[index].title}</h3>
            <p>{slides[index].desc}</p>
          </div>
        </div>
      </div>
      <div className="scallop-divider"></div>
    </section>
  );
}
