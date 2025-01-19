import userService from "../services/User";
import axios from "axios";

// Mockowanie axios i fetch
jest.mock('axios');
global.fetch = jest.fn();

describe('userService', () => {

  // Mockowanie metody getAuthToken
  const mockToken = 'mock-token';
  userService.getAuthToken = jest.fn(() => mockToken);

  describe('login', () => {
    it('should return "Ok" when login is successful', async () => {
      const response = { token: 'mock-token' };

      // Mockowanie fetch w metodzie _login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await userService.login("user", "password");
      expect(result).toBe("Ok");
    });

    it('should return "Error" when login fails', async () => {
      // Mockowanie nieudanego logowania
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const result = await userService.login("wrongUser", "wrongPassword");
      expect(result).toBe("Error");
    });
  });

  describe('register', () => {
    it('should return "OK" when registration is successful', async () => {
      // Mockowanie odpowiedzi na rejestrację
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'User created' }),
      });

      const result = await userService.register("user", "password");
      expect(result).toBe("OK");
    });

    it('should return "NotOK" when registration fails', async () => {
      // Mockowanie nieudanego logowania
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Registration failed' }),
      });

      const result = await userService.register("user", "password");
      expect(result).toBe("NotOK");
    });
  });

  describe('getBusStops', () => {
    it('should return filtered bus stops', async () => {
      const mockBusStops = [
        { stopId: 1, name: 'Stop 1' },
        { stopId: 2, name: 'Stop 2' },
      ];

      const busStopIds = [1]; // tylko pierwszy przystanek ma być zwrócony

      axios.get.mockResolvedValueOnce({ data: busStopIds });

      // Zakładając, że getPrzystaneki zwróci wszystkie przystanki
      jest.mock('./Przystanki.js', () => ({
        default: jest.fn(() => mockBusStops)
      }));

      const result = await userService.getBusStops();
      expect(result).toEqual([{ stopId: 1, name: 'Stop 1' }]);
    });

    it('should return empty array on error', async () => {
      axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

      const result = await userService.getBusStops();
      expect(result).toEqual([]);
    });
  });

  describe('getBusArrivals', () => {
    it('should return bus arrivals', async () => {
      const stopId = 1;
      const mockArrivals = [{ id: 1, time: "12:30" }, { id: 2, time: "13:00" }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArrivals,
      });

      const result = await userService.getBusArrivals(stopId);
      expect(result).toEqual(mockArrivals);
    });

    it('should return empty array if the API fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await userService.getBusArrivals(1);
      expect(result).toEqual([]);
    });
  });
});
