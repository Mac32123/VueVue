import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router/router.js'
import vuetify from '@/plugins/vuetify';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; 

import authPlugin from '@/plugins/authPlugin.js';

console.log('Before Pinia setup');
const pinia = createPinia();
console.log('After Pinia setup');
const app = createApp(App);
console.log('Before Pinia usage');
app.use(pinia);
console.log('After Pinia usage');
app.use(router);
app.use(vuetify);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

app.use(authPlugin);
//app.use(Auth)
app.mount('#app');


