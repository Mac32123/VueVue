<template>
  <div class="auth-container">
    <div v-if="isLogin">
      <h2>Logowanie</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="login-email">Nazwa</label>
          <input type="text" id="login-email" v-model="loginEmail" required />
        </div>
        <div class="form-group">
          <label for="login-password">Hasło</label>
          <input type="password" id="login-password" v-model="loginPassword" required />
        </div>
        <button v-hover-color type="submit">Zaloguj</button>
        <p>
          Nie masz konta? <a href="#" @click="switchToRegister">Zarejestruj się</a>
        </p>
      </form>
    </div>

    <div v-else>
      <h2>Rejestracja</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="register-email">Nazwa</label>
          <input type="text" id="register-email" v-model="registerEmail" required />
        </div>
        <div class="form-group">
          <label for="register-password">Hasło</label>
          <input type="password" id="register-password" v-model="registerPassword" required />
        </div>
        <button v-hover-color type="submit">Zarejestruj się</button>
        <p>
          Masz już konto? <a href="#" @click="switchToLogin">Zaloguj się</a>
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
    directives: {
      // Dyrektywa zmieniająca tło przy najechaniu
      hoverColor: {
        // Hook, który będzie uruchamiany po zamontowaniu elementu
        mounted(el) {
          el.addEventListener('mouseenter', () => {
            el.style.backgroundColor = '#4caf00'; // Tło na zielone przy najechaniu
          });

          el.addEventListener('mouseleave', () => {
            el.style.backgroundColor = ''; // Tło wraca do normalnego po zjechaniu
          });
        },
      },
    },
  };
</script>

<style scoped>
  .auth-container {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

    button:hover {
      background-color: #45a049;
    }

  p {
    text-align: center;
  }

  a {
    color: #007bff;
    cursor: pointer;
  }

    a:hover {
      text-decoration: underline;
    }
</style>
