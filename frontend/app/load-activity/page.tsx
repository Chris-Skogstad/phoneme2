"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../lib/config";
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
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [wordSearches, setWordSearches] = useState<ActivitySummary[]>([]);
  const [wordles, setWordles] = useState<ActivitySummary[]>([]);
  const [loading, setLoading] = useState(false);

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch(`${getApiUrl()}/api/users`)
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
      fetch(`${getApiUrl()}/api/word-searches?creator=${encodeURIComponent(selectedUser)}`).then((res) => res.json()),
      fetch(`${getApiUrl()}/api/wordles?creator=${encodeURIComponent(selectedUser)}`).then((res) => res.json()),
    ])
      .then(([ws, wl]) => {
        setWordSearches(ws);
        setWordles(wl);
      })
      .catch((err) => console.error("Error fetching activities:", err))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  useEffect(() => {
    setShowDeleteConfirm(false);
    setConfirmText("");
    setDeleteError(null);
  }, [selectedUser]);

  const handleDeleteUser = async () => {
    setDeleteError(null);

    if (confirmText !== selectedUser) {
      setDeleteError("Name doesn't match — type it exactly to confirm.");
      return;
    }

    const user = users.find((u) => u.name === selectedUser);
    if (!user) return;

    setDeleting(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/users?id=${user.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        setDeleteError(await res.text());
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedUser("");
      setConfirmText("");
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      setDeleteError("Could not reach the server.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteActivity = async (
    kind: "word-searches" | "wordles",
    id: string,
    activityTitle: string
  ) => {
    if (!confirm(`Delete "${activityTitle}"? This can't be undone.`)) return;

    try {
      const res = await fetch(`${getApiUrl()}/api/${kind}?id=${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert(await res.text());
        return;
      }
      if (kind === "word-searches") {
        setWordSearches((prev) => prev.filter((ws) => ws.id !== id));
      } else {
        setWordles((prev) => prev.filter((wl) => wl.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach the server.");
    }
  };

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

      {selectedUser && !showDeleteConfirm && (
        <div className="w-full max-w-sm mb-8">
          <Button variant="warning" onClick={() => setShowDeleteConfirm(true)}>
            Delete Teacher
          </Button>
        </div>
      )}

      {selectedUser && showDeleteConfirm && (
        <div className="w-full max-w-sm mb-8 p-3 border border-red-300 dark:border-red-800 rounded-md flex flex-col gap-2">
          <p className="text-sm text-red-600 dark:text-red-400">
            Deleting <strong>{selectedUser}</strong> also permanently deletes all of their saved word searches and Wordles (the shared word bank is unaffected). This can&apos;t be undone.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type "${selectedUser}" to confirm`}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={deleting}
          />
          <div className="flex gap-2">
            <Button
              variant="warning"
              onClick={handleDeleteUser}
              disabled={deleting || confirmText !== selectedUser}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
              Cancel
            </Button>
          </div>
          {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
        </div>
      )}

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
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => router.push(`/word-search?id=${ws.id}`)}>
                      Load
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleDeleteActivity("word-searches", ws.id, ws.title)}
                    >
                      Delete
                    </Button>
                  </div>
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
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => router.push(`/wordle?id=${wl.id}`)}>
                      Load
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleDeleteActivity("wordles", wl.id, wl.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}