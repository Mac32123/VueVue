import przystankiService from "./Przystanki.js"
import axios from 'axios';
import { useAuthStore } from '@/stores/Auth.js';
//import authPlugin from 'authPlugin'


const UserUrl = {
  login: `https://localhost:7286/api/Auth/login`,
  register: `https://localhost:7286/api/Auth/register`,
  buses: `https://localhost:7286/api/Auth/busstops`,
  busArivals: (id) => `https://localhost:7286/api/Auth/busarrivals/${id}`,
  busDelete: (id) => `https://localhost:7286/api/Auth/busdelete/${id}`
}

const userService = {
  store() {
    return useAuthStore();
  },

  getAuthToken() {
    //this.$clearToken();
    return this.store().getToken;
  },

  async login(userName, password) {
    const token = this.getAuthToken();
    if (token !== null) {
      this.store().clearToken();
    }

    const result = await this._login(userName, password);
    if (result && result.token) {
      this.store().setToken(result.token);
      return "Ok";
    }

    return "Error";
  },

  generateRandomString() {
    // Długość losowego stringa (od 8 do 20)
    const length = Math.floor(Math.random() * (20 - 8 + 1)) + 8;

    // Zestaw dostępnych znaków (małe litery, wielkie litery, cyfry)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  },

  async _login(userName, password) {
    try {
      const res = await fetch(UserUrl.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "username": userName,
          "password": password
        })
      });

      if (!res.ok) {

        throw new Error('Login failed');
      }

      const data = await res.json();
      return data;
    }
    catch (error) {
      console.error(error);
      return null;
    }
  },

  async register(userName, password) {
    const result = await this._register(userName, password);
    if (result === "OK") {
      return "OK";
    }

    return "Error";
  },

  async _register(userName, password) {
    try {
      const res = await fetch(UserUrl.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "username": userName,
          "email": "string@string.pl",
          "password": password
        })
      });

      if (!res.ok) {

        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error('Registration failed');
      }

      return "OK";
    }
    catch (error) {
      console.error(error);
      return "NotOK";
    }
  },

  async getBusStops() {

    try {
      const token = this.getAuthToken();
      const response = await axios.get(UserUrl.buses, {
        headers: {
          Authorization: `Bearer ${token}`,  // Przesyłanie tokenu JWT w nagłówku
          'Accept': 'application/json',         // Określamy akceptowany typ odpowiedzi
        },
      });

      const busStopIds = response.data;  // Zwróci dane w formacie JSON, które będą w response.data
      const allPrzystaneki = await przystankiService.getPrzystaneki();  // Zwraca wszystkie przystanki
      const allBusStops = allPrzystaneki.stops;;
      const filteredBusStops = allBusStops.filter(busStop => busStopIds.includes(busStop.stopId.toString())); // Filtrowanie przystanków

      return filteredBusStops;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async deleteBusStop(stopId) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(UserUrl.busDelete(stopId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Przesyłanie tokenu JWT w nagłówku
        },
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania przyjazdów");
      }
      return await response.json(); // Zwróci tablicę przyjazdów
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getBusArrivals(stopId) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(UserUrl.busArivals(stopId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Przesyłanie tokenu JWT w nagłówku
        },
      });

      if (!response.ok) {
        throw new Error("Błąd podczas pobierania przyjazdów");
      }
      return await response.json(); // Zwróci tablicę przyjazdów
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export default userService;
