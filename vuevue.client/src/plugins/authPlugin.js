import { useAuthStore } from '../stores/auth';

export default {
  install(app) {
    app.config.globalProperties.$getToken = function () {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.getToken();
    };
    app.config.globalProperties.$setToken = function () {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.setToken();
    };
    app.config.globalProperties.$clearToken = function () {
      // Dostęp do magazynu Pinia
      const authStore = useAuthStore();
      return authStore.clearToken();
    };
  },
};
