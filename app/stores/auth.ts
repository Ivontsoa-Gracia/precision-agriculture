import { defineStore } from "pinia";

interface User {
  uuid: string | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): User => ({
    uuid: null,
    token: null,
  }),
  actions: {
    setAuth(token: string, uuid: string) {
      this.token = token;
      this.uuid = uuid;
    },
    clearAuth() {
      this.token = null;
      this.uuid = null;
    },
  },
});
