"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at?: string;
};

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [dark, setDark] = useState(false);

  const channelRef = useRef<any>(null);
  const hasSubscribed = useRef(false); // 🔥 prevents double subscription

  // ---------------------------------
  // FETCH + REALTIME (SAFE VERSION)
  // ---------------------------------
  useEffect(() => {
    if (hasSubscribed.current) return;
    hasSubscribed.current = true;

    const setup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Initial fetch
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setBookmarks(data);

      // Realtime
      channelRef.current = supabase
        .channel(`bookmarks-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => {
                // 🔥 prevent duplicates
                if (prev.some((b) => b.id === payload.new.id)) {
                  return prev;
                }
                return [payload.new as Bookmark, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // ---------------------------------
  // ADD BOOKMARK (NO OPTIMISTIC UI)
  // ---------------------------------
  const addBookmark = async () => {
    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setTitle("");
    setUrl("");
    setShowAdd(false);
  };

  // ---------------------------------
  // DELETE BOOKMARK
  // ---------------------------------
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

        {/* Controls */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Your Bookmarks
        </h1>

        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-2 bg-yellow-300 dark:bg-cyan-400 rounded-lg font-semibold mb-6"
          >
            Add Bookmark
          </button>
        )}

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col gap-4 max-w-xl"
            >
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addBookmark}
                className="px-6 py-2 bg-green-400 rounded-lg font-semibold"
              >
                Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No bookmarks currently.
            </p>
          ) : (
            bookmarks.map((b) => (
              <motion.div
                key={b.id}
                layout
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex justify-between items-center"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 dark:text-white break-all"
                >
                  {b.title}
                </a>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
