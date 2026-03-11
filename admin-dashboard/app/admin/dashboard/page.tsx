import { useEffect, useState } from "react";
import axios from "@/app/admin/lib/axios";

type TodayAnalytics = {
  totalOrders: number;
  totalRevenue: number;
};

type DailyPoint = {
  day: string;
  orders: number;
  revenue: number;
};

export default function AdminDashboardPage() {
  const [today, setToday] = useState<TodayAnalytics | null>(null);
  const [trend, setTrend] = useState<DailyPoint[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [todayRes, dailyRes] = await Promise.all([
          axios.get("/admin/analytics/today"),
          axios.get("/admin/analytics/daily"),
        ]);
        setToday(todayRes.data);
        setTrend(dailyRes.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load analytics. Make sure you are logged in as admin."
        );
      }
    };
    load();
  }, []);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: "#555" }}>
          Overview of orders and restaurant performance.
        </p>
      </header>

      {error && (
        <p style={{ color: "red", marginBottom: 8, fontSize: 14 }}>{error}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginTop: 12,
        }}
      >
        <div
          style={{
            background: "#FFF9E5",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #F9BF01",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Today&apos;s orders</h2>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
            {today ? today.totalOrders : "—"}
          </p>
        </div>
        <div
          style={{
            background: "#F7F7F7",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #eee",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Revenue</h2>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
            R {today ? today.totalRevenue.toFixed(2) : "—"}
          </p>
        </div>
      </div>

      {trend.length > 0 && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #eee",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Daily revenue trend
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12,
            }}
          >
            {trend.map((point) => (
              <div
                key={point.day}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: "#F9FAFB",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#666",
                    marginBottom: 4,
                  }}
                >
                  {new Date(point.day).toLocaleDateString()}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  R {Number(point.revenue).toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  {point.orders} orders
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
