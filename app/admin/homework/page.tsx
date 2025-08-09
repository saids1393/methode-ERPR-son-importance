"use client";

import { useEffect, useState } from "react";

type Homework = {
  id: string;
  chapterId: number;
  title: string;
  content: string;
};

export default function AdminHomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [chapterId, setChapterId] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchHomeworks() {
    const res = await fetch("/api/admin/homework");
    const data = await res.json();
    if (!data.error) {
      setHomeworks(data);
    }
  }

  async function addHomework() {
    if (!chapterId || !title || !content) {
      alert("Tous les champs sont requis");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/homework", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, title, content }),
    });
    setLoading(false);
    if (res.ok) {
      setChapterId(1);
      setTitle("");
      setContent("");
      fetchHomeworks();
    } else {
      const err = await res.json();
      alert(err.error || "Erreur");
    }
  }

  async function deleteHomework(id: string) {
    if (!confirm("Supprimer ce devoir ?")) return;
    const res = await fetch("/api/admin/homework", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchHomeworks();
    }
  }

  useEffect(() => {
    fetchHomeworks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des devoirs</h1>

      {/* Formulaire */}
      <div className="mb-6 space-y-3">
        <input
          type="number"
          value={chapterId}
          onChange={(e) => setChapterId(Number(e.target.value))}
          placeholder="Numéro de chapitre"
          className="border p-2 w-full"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          className="border p-2 w-full"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu"
          className="border p-2 w-full"
          rows={4}
        />
        <button
          onClick={addHomework}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Enregistrement..." : "Ajouter"}
        </button>
      </div>

      {/* Liste */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Chapitre</th>
            <th className="border p-2">Titre</th>
            <th className="border p-2">Contenu</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {homeworks.map((hw) => (
            <tr key={hw.id}>
              <td className="border p-2">{hw.chapterId}</td>
              <td className="border p-2">{hw.title}</td>
              <td className="border p-2">{hw.content}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteHomework(hw.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {homeworks.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Aucun devoir trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
