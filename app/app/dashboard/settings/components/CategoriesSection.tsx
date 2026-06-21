"use client";

import { useState } from "react";

type CategoriesSectionProps = {
  categories: string[];
  onAdd: (category: string) => void;
  onDelete: (category: string) => void;
};

export default function CategoriesSection({ categories, onAdd, onDelete }: CategoriesSectionProps) {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory.trim() === "") return;
    onAdd(newCategory.trim());
    setNewCategory("");
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">Manage Product Categories</h2>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none flex-1 text-slate-200 placeholder:text-slate-500 focus:border-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[400px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat, idx) => (
              <tr
                key={idx}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3 text-slate-200">{cat}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onDelete(cat)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center text-slate-400">
                  No categories.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
