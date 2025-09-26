import { defineStore } from "pinia";

const parseExpiration = (token: string) => {
  const jwtContent = JSON.parse(atob(token.split(".")[1]));
  return new Date(jwtContent["exp"] * 1000);
};

export const useAuthStore = defineStore("auth", {
  state: (): {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    accessTokenExpiresAt: Date | undefined;
    refreshTokenExpiresAt: Date | undefined;
  } => ({
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpiresAt: undefined,
    refreshTokenExpiresAt: undefined,
  }),

  getters: {
    isAccessTokenValid: (state) => {
      return (
        state.accessTokenExpiresAt &&
        new Date() < new Date(state.accessTokenExpiresAt)
      );
    },

    isRefreshTokenValid: (state) => {
      return (
        state.refreshTokenExpiresAt &&
        new Date() < new Date(state.refreshTokenExpiresAt)
      );
    },

    isAuthenticated: (state) => {
      return (
        !!state.accessToken &&
        state.accessTokenExpiresAt &&
        new Date() < new Date(state.accessTokenExpiresAt)
      );
    },
  },

  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.accessTokenExpiresAt = parseExpiration(accessToken);
      this.refreshTokenExpiresAt = parseExpiration(refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    clearTokens() {
      this.accessToken = undefined;
      this.refreshToken = undefined;
      this.accessTokenExpiresAt = undefined;
      this.refreshTokenExpiresAt = undefined;
    },

    initTokens() {
      if (!this.accessToken || !this.refreshToken) {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (accessToken && refreshToken)
          this.setTokens(accessToken, refreshToken);
      }
    },

    updateAccessToken(accessToken: string, accessTokenExpiresAt: Date) {
      this.accessToken = accessToken;
      this.accessTokenExpiresAt = accessTokenExpiresAt;
    },

    updateRefreshToken(refreshToken: string, refreshTokenExpiresAt: Date) {
      this.refreshToken = refreshToken;
      this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    },
  },
});
