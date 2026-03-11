// admin-dashboard/app/admin/menu/new/page.tsx
"use client";
import { useRouter } from "next/navigation";
import MenuForm from "@/components/admin/MenuForm";
import { createMenuItem } from "@/lib/menu";

export default function NewMenuItem() {
  const router = useRouter();

  return (
    <MenuForm
      onSubmit={async (data) => {
        await createMenuItem(data);
        router.push("/admin/menu");
      }}
    />
  );
}