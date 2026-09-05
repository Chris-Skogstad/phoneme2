"use client";

import { useEffect, useState } from "react";
import { APIURL } from "../lib/config";
import PageHeading from "../components/PageHeading";
import Button from "../components/Button";

type User = { id: string; name: string };
type ActivitySummary = {
  id: string;
  title: string;
  difficulty: string;
  createdAt: string;
  words: { text: string }[];
};

export default function LoadActivityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [wordSearches, setWordSearches] = useState<ActivitySummary[]>([]);
  const [wordles, setWordles] = useState<ActivitySummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${APIURL}/api/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setWordSearches([]);
      setWordles([]);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch(`${APIURL}/api/word-searches?creator=${encodeURIComponent(selectedUser)}`).then((res) => res.json()),
      fetch(`${APIURL}/api/wordles?creator=${encodeURIComponent(selectedUser)}`).then((res) => res.json()),
    ])
      .then(([ws, wl]) => {
        setWordSearches(ws);
        setWordles(wl);
      })
      .catch((err) => console.error("Error fetching activities:", err))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Load Saved Activity"
        description="Pick a teacher to see their saved word searches and Wordles."
      />

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="mb-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">-- Select a teacher --</option>
        {users.map((u) => (
          <option key={u.id} value={u.name}>
            {u.name}
          </option>
        ))}
      </select>

      {loading && <p className="text-gray-500">Loading...</p>}

      {selectedUser && !loading && (
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Word Searches ({wordSearches.length})
            </h3>
            <div className="flex flex-col gap-2">
              {wordSearches.length === 0 && (
                <p className="text-gray-500 text-sm">None saved yet.</p>
              )}
              {wordSearches.map((ws) => (
                <div
                  key={ws.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ws.title}</p>
                    <p className="text-xs text-gray-500">
                      {ws.difficulty} · {ws.words.map((w) => w.text).join(", ")}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => alert(`Load ${ws.id} — coming next`)}>
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Wordles ({wordles.length})
            </h3>
            <div className="flex flex-col gap-2">
              {wordles.length === 0 && (
                <p className="text-gray-500 text-sm">None saved yet.</p>
              )}
              {wordles.map((wl) => (
                <div
                  key={wl.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{wl.title}</p>
                    <p className="text-xs text-gray-500">
                      {wl.difficulty} · {wl.words.map((w) => w.text).join(", ")}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => alert(`Load ${wl.id} — coming next`)}>
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}