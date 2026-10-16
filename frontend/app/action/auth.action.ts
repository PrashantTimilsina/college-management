"use server";

import { cookies } from "next/headers";
import { getMe, login, LoginCredentials } from "../api/auth.api";

import { ENDPOINTS } from "@/constants/endpoints";

export const loginAction = async (credentials: LoginCredentials) => {
  const response = await login(credentials);
  const user = {
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
  };
  if (response) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: response.tokens.accessToken,
      httpOnly: true,
    });

    cookieStore.set({
      name: "refresh_token",
      value: response.tokens.refreshToken,
      httpOnly: true,
    });
    cookieStore.set({
      name: "user",
      value: JSON.stringify(user),
      httpOnly: true,
    });
  }
  return response;
};

export const getMeAction = async () => {
  try {
    return await getMe();
  } catch (error) {
    if (
      !(error instanceof Error) ||
      (error.message !== "UNAUTHORIZED" &&
        error.message !== "Access token not found")
    ) {
      throw error;
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) {
      throw new Error("Please login again");
    }
    const response = await fetch(`${ENDPOINTS.refresh}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("user");
      throw new Error("Session expired. Please login again");
    }
    const tokens = await response.json();

    cookieStore.set({
      name: "access_token",
      value: tokens.accessToken,
      httpOnly: true,
    });
    cookieStore.set({
      name: "refresh_token",
      value: tokens.refreshToken,
      httpOnly: true,
    });
    return await getMe();
  }
};
