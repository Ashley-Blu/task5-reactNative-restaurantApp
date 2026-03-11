"use client";

import { useAdminAuth } from "@/admin/hooks/useAdminAuth";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAdminAuth()

  if (loading) {
    return <p className="p-6">Checking admin access...</p>;
  }

  return <>{children}</>;
}
