<template>
  <Loader v-if="isLoading" />
  <section
    v-if="
      currentWeather && forecastWeather && forecastWeather.length && !isLoading
    "
    class="flex"
  >
    <Sidebar
      class="sidebar"
      :unit="currentUnit"
      :currentWeather="currentWeather"
    />

    <main class="flex column">
      <div class="flex align-center justify-end">
        <button
          :class="[
            'btn-change-metrics',
            'pointer',
            'white',
            currentUnit === 'metric' ? 'btn-active' : '',
          ]"
          @click="changeUnit('metric')"
        >
          C°
        </button>
        <button
          :class="[
            'btn-change-metrics',
            'pointer',
            'white',
            'ml-12',
            currentUnit === 'imperial' ? 'btn-active' : '',
          ]"
          @click="changeUnit('imperial')"
        >
          F°
        </button>
      </div>
      <!-- Projections -->
      <div class="grid-projection-hightlights">
        <ForecastWeatherCard
          v-for="forecast in forecastWeather"
          :key="forecast.date"
          :weather="forecast"
          :unit="currentUnit"
        />
      </div>
      <!-- Météo du jour -->
      <h3>Météo actuelle</h3>
      <div class="grid-today-highlights">
        <TodayWeatherCard
          title="Vent"
          :windDirection="currentWeather.windDirection"
          :windDegree="currentWeather.windDegree"
          :value="currentWeather.windSpeed"
          unity="km/h"
        />
        <TodayWeatherCard
          title="Humidité"
          :value="currentWeather.humidity"
          unity="%"
        />
        <TodayWeatherCard
          title="Visibilité"
          :value="currentWeather.visibility"
          unity="km"
        />
        <TodayWeatherCard
          title="Pression de l'air"
          :value="currentWeather.pressure"
          unity="hPa"
        />
      </div>
    </main>
  </section>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import Loader from "./components/Loader.vue";
import TodayWeatherCard from "./components/TodayWeatherCard.vue";
import ForecastWeatherCard from "./components/ForecastWeatherCard.vue";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useWeatherStore } from "./store/store";
const store = useWeatherStore();
onBeforeMount(async () => {
  await store.initWeather();
});
const currentWeather = computed(() => {
  return store.weather && store.weather.current;
});
const forecastWeather = computed(() => {
  return store.weather && store.weather.forecast;
});
const currentUnit = computed(() => {
  return store.unit;
});
const isLoading = computed(() => {
  return store.isLoading;
});
function changeUnit(unit) {
  store.changeUnit(unit);
}
</script>

<style scoped>
h3 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #e7e7eb;
  margin-top: 7.2rem;
}
.grid-projection-hightlights {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2.6rem;
  margin: 7rem 0;
}
.grid-today-highlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 4.8rem;
  margin-top: 3.2rem;
}
main {
  flex: 1;
  background: #100e1d;
  padding: 4.2rem 12.3rem 15rem 12.3rem;
}

.btn-change-metrics {
  border-radius: 50%;
  padding: 0.9rem;
  border: none;
  background: #585676;
  width: 4rem;
  font-weight: 700;
}

.btn-active {
  background: #e7e7eb;
  color: #110e3c;
}

.btn-change-metrics:hover {
  background: #e7e7eb;
  color: #110e3c;
}

section:has(.btn-change-metrics:hover) .btn-active {
  background: #585676 !important;
  color: #fff !important;
}

.ml-12 {
  margin-left: 1.2rem;
}

@media screen and (max-width: 576px) {
  section {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .grid-today-highlights {
    grid-template-columns: 1fr;
  }
  .grid-projection-hightlights {
    grid-template-columns: 1fr;
  }
  main {
    padding: 4.2rem 5rem 15rem 5rem;
  }
}
</style>
