"use client";

import { useEffect, useState } from "react";
import { vintageFont } from "../app/fonts"; // logo font
import { inter } from "../app/fonts"; // dashboard font
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type NavbarProps = {
  showLogout?: boolean;
};

export default function Navbar({ showLogout }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-shadow" : ""}`}>
      <div className="nav-container flex justify-between items-center">
        <div className={`logo ${vintageFont.className}`}>BookMarkr</div>

        {showLogout && (
          <button
            onClick={handleLogout}
            className={`px-6 py-3 border border-black rounded-full font-bold hover:bg-black hover:text-white transition text-m ${vintageFont.className}`}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
