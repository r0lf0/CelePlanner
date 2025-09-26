import { useAuthStore } from "@/stores/auth";

import { useRoute, useRouter } from "vue-router";

import { toast } from "vue-sonner";

import { BASE_URL } from "./common";

export const customFetch = async (
  url: string,
  options: { method: string; headers?: {}; body?: string } = { method: "GET" }
) => {
  const authStore = useAuthStore();
  const route = useRoute();
  const router = useRouter();
  const accessToken = authStore.accessToken;

  const headers = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // Make the fetch request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token expiration (e.g., 401 status)
  if (response.status === 401 && authStore.refreshToken) {
    const tokens = await fetchRefreshToken(authStore.refreshToken);
    authStore.setTokens(tokens.access, tokens.refresh);

    const newAccessToken = tokens.access;
    if (newAccessToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    if (response.status === 401) {
      toast({ title: "L'utente non risulta autenticato" });
      authStore.clearTokens();
      router.push({
        name: "login",
        query: { redirect: route.fullPath },
      });
    }
  }

  return response;
};

const fetchRefreshToken = async (refreshToken: string) => {
  const response = await fetch(`${BASE_URL}/auth/jwt/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (response.ok) {
    const result = await response.json();
    return result;
  }

  // Panic (?)
  return undefined;
};
