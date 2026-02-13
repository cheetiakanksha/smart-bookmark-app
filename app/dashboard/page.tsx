"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import "@/styles/dashboard.css";


type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
};

const pastelColors = [
  "#FFEBE8",
  "#FFF4CC",
  "#E8F6FF",
  "#E8FFE8",
  "#FDE8FF",
  "#E8FFF7",
];

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);

  // -----------------------------
  // FETCH + REALTIME
  // -----------------------------
  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/";
        return;
      }
      setUser({
        email: user.email!,
        name: user.user_metadata?.full_name || null,
      });

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setBookmarks(data);

      channel = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => {
                const exists = prev.find((b) => b.id === (payload.new as Bookmark).id);
                if (exists) return prev;
                return [payload.new as Bookmark, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              const deletedId = payload.old?.id;
              if (!deletedId) return;
              setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
            }
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // -----------------------------
  // ADD BOOKMARK
  // -----------------------------
  const addBookmark = async () => {
    if (!title || !url) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ title, url: formattedUrl, user_id: user.id }]);

    if (!error) {
      setToast("Bookmark added successfully!");
      setTimeout(() => setToast(""), 2000);
      setTitle("");
      setUrl("");
      setShowAdd(false);
    }

    setLoading(false);
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-6">
      {/* Navbar with Logout */}
      <Navbar showLogout={true} />

      <div className="dashboard-container">
  <div className="dashboard-header">
    {user && (
      <p className="greeting">
        Hey, <span>{user.name || user.email}</span>
      </p>
    )}
    <h1>Your Bookmark Vault</h1>
    <p className="tagline">
      Organize your favorite links quickly and beautifully
    </p>
  </div>

  {!showAdd && (
    <button onClick={() => setShowAdd(true)} className="add-bookmark-btn">
      + Add Bookmark
    </button>
  )}

  {showAdd && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="add-bookmark-form"
    >
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="example.com" value={url} onChange={(e) => setUrl(e.target.value)} />

      <div className="form-buttons">
        <button onClick={addBookmark} className="add-btn">{loading ? "Adding..." : "Add"}</button>
        <button onClick={() => setShowAdd(false)} className="cancel-btn">Cancel</button>
      </div>
    </motion.div>
  )}

  {toast && <div className="toast">{toast}</div>}

  <div className={`bookmarks-grid ${bookmarks.length === 1 ? "single-card" : ""}`}>
    {bookmarks.map((b, idx) => (
      <div key={b.id} className="bookmark-card" style={{ backgroundColor: pastelColors[idx % pastelColors.length] }}>
        <div>
          <h3>{b.title}</h3>
          <p>{b.url}</p>
        </div>
        <div className="card-buttons">
          <button onClick={() => window.open(b.url, "_blank")} className="open-btn">Open</button>
          <button onClick={() => deleteBookmark(b.id)} className="delete-btn">Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
