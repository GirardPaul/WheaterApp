<template>
  <section v-if="currentWeather" class="flex">
    <Sidebar :currentWeather="currentWeather" />

    <main class="flex column">
      <div class="flex align-center justify-end">
        <button class="btn-change-metrics pointer white">C°</button>
        <button class="btn-change-metrics pointer white ml-12">F°</button>
      </div>
      <!-- Projections -->
      <div></div>
      <!-- Météo du jour -->
      <h3>Météo actuelle</h3>
      <div class="grid-today-highlights">
        <TodayWeatherCard
          title="Vent"
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
import TodayWeatherCard from "./components/TodayWeatherCard.vue";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useWeatherStore } from "./store/store";
const store = useWeatherStore();
onBeforeMount(async () => {
  await store.initWeather();
});
const currentWeather = computed(() => {
  return store.weather && store.weather.current;
});
</script>

<style scoped>
h3 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #e7e7eb;
  margin-top: 7.2rem;
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

.btn-change-metrics:hover {
  background: #e7e7eb;
  color: #110e3c;
}

.ml-12 {
  margin-left: 1.2rem;
}
</style>
