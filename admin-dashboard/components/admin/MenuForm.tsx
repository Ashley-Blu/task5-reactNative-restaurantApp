// admin-dashboard/components/MenuForm.tsx
"use client";
import { useEffect, useState } from "react";
import { getCategories, MenuPayload } from "@/lib/menu";

type MenuFormProps = {
  initial?: any;
  onSubmit: (data: MenuPayload) => void;
};

type Category = {
  id: number;
  name: string;
};

export default function MenuForm({ initial, onSubmit }: MenuFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price || "",
    image: initial?.image || "",
    featured: initial?.featured || false,
    special: initial?.special || false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getCategories();
      const cats: Category[] = res.data;
      setCategories(cats);

      // If editing, try match existing category name to id
      if (initial?.category) {
        const match = cats.find((c) => c.name === initial.category);
        if (match) {
          setCategoryId(match.id);
          return;
        }
      }

      // Fallback to first category
      if (cats.length > 0 && categoryId === null) {
        setCategoryId(cats[0].id);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!categoryId) return;

    const payload: MenuPayload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      category_id: categoryId,
      featured: form.featured,
      special: form.special,
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="input"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="input"
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="input"
      />
      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
        className="input"
      />
      <select
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="input"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <label>
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        Featured
      </label>
      <label>
        <input
          type="checkbox"
          checked={form.special}
          onChange={(e) => setForm({ ...form, special: e.target.checked })}
        />
        Special
      </label>
      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}