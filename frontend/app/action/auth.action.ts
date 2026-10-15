"use server";

import { cookies } from "next/headers";
import { login, LoginCredentials } from "../api/auth.api";

export const loginAction = async (credentials: LoginCredentials) => {
  const response = await login(credentials);
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
  }
  return response;
};
