"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";

export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const res = await axios.get("/auth/me");

        if (res.data.user.role !== "admin") {
          router.replace("/");
          return;
        }

        setLoading(false);
      } catch {
        localStorage.removeItem("token");
        router.replace("/admin/login");
      }
    };

    checkAdmin();
  }, []);

  return { loading };
}
