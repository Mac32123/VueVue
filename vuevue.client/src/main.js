import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import { createPinia } from 'pinia'
import authPlugin from '@/plugins/authPlugin';
import '@/assets/styles/tailwind.css';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(authPlugin);
//app.use(Auth)
app.mount('#app');


