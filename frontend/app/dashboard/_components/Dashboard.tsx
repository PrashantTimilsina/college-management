"use client";

import { getMeAction } from "@/app/action/auth.action";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

function DashboardData() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isPending, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMeAction,
  });

  if (isPending) return <p>Loading user...</p>;
  if (isError) return <p>Error fetching user data</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <p>{data.role}</p>
    </div>
  );
}

export default DashboardData;
