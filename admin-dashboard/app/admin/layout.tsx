export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#F9BF01",
          color: "#000",
          padding: 20,
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: 30, fontWeight: 800 }}>Foodie Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href="/admin/dashboard" style={{ color: "#000", fontWeight: 600 }}>
            Dashboard
          </a>
          <a href="/admin/orders" style={{ color: "#000" }}>
            Orders
          </a>
          <a href="/admin/menu" style={{ color: "#000" }}>
            Menu
          </a>
          <a href="/admin/users" style={{ color: "#000" }}>
            Users
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 30,
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
