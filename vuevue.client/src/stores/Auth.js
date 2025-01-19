import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null, // Przechowywany token JWT
  }),
  actions: {
    // Funkcja do ustawiania tokenu
    setToken(token) {
      this.token = token;
      // Możesz także zapisać token w localStorage lub sessionStorage, aby przechowywać go po odświeżeniu strony
      localStorage.setItem('token', token);
    },
    // Funkcja do pobierania tokenu
    getToken() {
      // Zwróci token, jeśli jest w stanie lub w localStorage
      return this.token || localStorage.getItem('token');
    },
    // Funkcja do usuwania tokenu
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});
