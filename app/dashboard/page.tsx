"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
      } else {
        setUser(data.user);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.email}
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
