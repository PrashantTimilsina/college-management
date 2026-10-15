import { ENDPOINTS } from "@/constants/endpoints";

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
