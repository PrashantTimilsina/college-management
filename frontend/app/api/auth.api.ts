import { ENDPOINTS } from "@/constants/endpoints";
import { cookies } from "next/headers";

export interface LoginCredentials {
  email: string;
  password: string;
}
export async function login(credentials: LoginCredentials) {
  const response = await fetch(ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Login failed");
  }
  return response.json();
}
export async function getMe() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("Access token not found");
  }
  const response = await fetch(ENDPOINTS.me, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message);
  }
  return response.json();
}
