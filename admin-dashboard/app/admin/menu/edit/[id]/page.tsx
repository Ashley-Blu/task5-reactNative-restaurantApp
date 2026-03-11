// admin-dashboard/app/admin/menu/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MenuForm from "@/components/admin/MenuForm";
import { getMenuItem, updateMenuItem } from "@/lib/menu";

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getMenuItem(id).then((res) => {
      setInitial(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>
      <MenuForm
        initial={initial}
        onSubmit={async (data) => {
          if (!id) return;
          await updateMenuItem(id as string, data);
          router.push("/admin/menu");
        }}
      />
    </div>
  );
}
