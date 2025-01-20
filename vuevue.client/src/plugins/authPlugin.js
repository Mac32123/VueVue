import { useAuthStore } from '../stores/Auth.js';

export default {
  install(app) {
    app.config.globalProperties.$getToken = () => {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.getToken;
    };
    app.config.globalProperties.$setToken = (token) => {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.setToken(token);
    };
    app.config.globalProperties.$clearToken = () => {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.clearToken();
    };
  },
};
