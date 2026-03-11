"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMenu, deleteMenuItem } from "@/lib/menu";

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<any[]>([]);

  const loadMenu = async () => {
    const res = await getMenu();
    setMenu(res.data);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteMenuItem(id);
    loadMenu();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Menu</h1>
          <Link
            href="/admin/categories"
            className="bg-gray-200 text-black px-3 py-1 rounded text-sm"
          >
            Manage Categories
          </Link>
        </div>
        <Link
          href="/admin/menu/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Item
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded object-cover"
                  />
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>R{item.price}</td>
              <td className="flex gap-3">
                <Link
                  href={`/admin/menu/edit/${item.id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
