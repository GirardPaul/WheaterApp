import { defineStore } from "pinia";
import { initWeatherForAddress } from "../services/WeatherService.js";
export const useWeatherStore = defineStore({
  id: "wheather",
  state: () => ({
    address: localStorage.getItem("address")
      ? JSON.parse(localStorage.getItem("address"))
      : {
          lat: 48.8534951,
          lng: 2.3483915,
          city: "Paris",
        },
    weather: null,
    unit: "metric",
    isLoading: false,
  }),
  actions: {
    async initWeather() {
      this.isLoading = true;
      this.weather = await initWeatherForAddress(this.address, this.unit);
      this.isLoading = false;
    },
    addAddress(address) {
      this.address = address;
      localStorage.setItem("address", JSON.stringify(address));
      this.initWeather();
    },
    changeUnit(unit) {
      this.unit = unit;
      localStorage.setItem("unit", unit);
      this.initWeather();
    },
  },
});
