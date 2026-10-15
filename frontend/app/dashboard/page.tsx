"use client";

import { useAuthStore } from "@/store/authStore";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  return <div>{user?.name}</div>;
}

export default Dashboard;
