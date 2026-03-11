// admin-dashboard/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

type AdminOrder = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  user_id?: number;
  name?: string;
  email?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/admin/orders");
      setOrders(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load orders. Make sure you are logged in as an admin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={loadOrders}
          className="bg-black text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && !error && (
        <p>No orders found yet.</p>
      )}

      {orders.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Order #</th>
              <th>User</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td>
                  <div className="flex flex-col">
                    <span>{order.name || "—"}</span>
                    <span className="text-xs text-gray-500">
                      {order.email || ""}
                    </span>
                  </div>
                </td>
                <td>{order.status}</td>
                <td>R{Number(order.total_price).toFixed(2)}</td>
                <td>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

