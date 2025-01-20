<template>
  <div class="w-80 mx-auto p-6 border border-gray-300 rounded-lg bg-gray-100">
    <div v-if="isLogin">
      <h2 class="text-2xl font-semibold mb-4">Logowanie</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="login-email" class="block text-sm font-medium text-gray-700">Nazwa</label>
          <input type="text"
                 id="login-email"
                 v-model="loginEmail"
                 required
                 class="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <div class="mb-4">
          <label for="login-password" class="block text-sm font-medium text-gray-700">Hasło</label>
          <input type="password"
                 id="login-password"
                 v-model="loginPassword"
                 required
                 class="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <button type="submit"
                class="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-400">
          Zaloguj
        </button>
        <p class="mt-4 text-center text-sm">
          Nie masz konta? <a href="#" @click="switchToRegister" class="text-blue-500 hover:underline">Zarejestruj się</a>
        </p>
      </form>
    </div>

    <div v-else>
      <h2 class="text-2xl font-semibold mb-4">Rejestracja</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="register-email" class="block text-sm font-medium text-gray-700">Nazwa</label>
          <input type="text"
                 id="register-email"
                 v-model="registerEmail"
                 required
                 class="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <div class="mb-4">
          <label for="register-password" class="block text-sm font-medium text-gray-700">Hasło</label>
          <input type="password"
                 id="register-password"
                 v-model="registerPassword"
                 required
                 class="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <button type="submit"
                class="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-400">
          Zarejestruj się
        </button>
        <p class="mt-4 text-center text-sm">
          Masz już konto? <a href="#" @click="switchToLogin" class="text-blue-500 hover:underline">Zaloguj się</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import userService from '@/services/User.js';

  export default {
    data() {
      return {
        isLogin: true, // Flaga wskazująca, czy pokazujemy formularz logowania czy rejestracji
        loginEmail: "",
        loginPassword: "",
        registerEmail: "",
        registerPassword: "",
      };
    },
    methods: {
      // Zmiana formularza na logowanie
      switchToLogin() {
        this.isLogin = true;
      },
      // Zmiana formularza na rejestrację
      switchToRegister() {
        this.isLogin = false;
      },
      // Metoda logowania
      async login() {
        var res = await userService.login(this.loginEmail, this.loginPassword);
        if (res === "Ok") {
          this.$router.push('/myAccount');
        }
        // Przykładowa logika: czyszczenie pól po udanym logowaniu
        this.loginEmail = "";
        this.loginPassword = "";
      },
      // Metoda rejestracji
      async register() {
        var res = await userService.register(this.registerEmail, this.registerPassword);
        if (res === "OK") {
          this.loginEmail = this.registerEmail;
          this.loginPassword = this.registerPassword;
          this.login();
        }
        // Przykładowa logika: czyszczenie pól po udanej rejestracji
        this.registerEmail = "";
        this.registerPassword = "";
      },
    },
  };
</script>

<style scoped>
  /* Usuwamy niestandardowe style CSS, ponieważ Tailwind CSS już zajmuje się stylami */
</style>
