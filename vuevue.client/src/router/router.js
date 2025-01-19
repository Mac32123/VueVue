import { createRouter, createWebHistory } from 'vue-router'
import HomeHome from '@/components/HomeHome.vue'
import LoginLogin from '@/components/LoginLogin.vue'
import BusStopList from '@/components/BusStopList.vue'
import AddPrzystanki from '@/components/AddPrzystanki.vue'

const routes = [
{
    path: "/",
    name: "Login",
    component: LoginLogin
  },
  {
    path: "/myAccount",
    name: "Przystanki",
    component: BusStopList
  },
  {
    path: "/add",
    name: "AddPrzystanki",
    component: AddPrzystanki
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
