export async function getAdminUser() {
  const token = localStorage.getItem("admin_token");

  if (!token) return null;

  const res = await fetch("http://localhost:4000/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  if (data.user?.role !== "admin") {
    return null;
  }

  return data.user;
}
