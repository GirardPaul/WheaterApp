<script setup>
import { watchEffect } from "vue";
const props = defineProps({
  weather: Object,
  unit: String,
});
</script>
<template>
  <div class="container flex column justify-between align-center">
    <p class="date">{{ weather.date }}</p>
    <img :src="weather.imgUrl" alt="weather icons" />
    <div class="full flex justify-between align-center">
      <p class="value-max">
        {{ weather.maxTemp }} {{ unit === "imperial" ? "°F" : "°C" }}
      </p>
      <p class="value-min">
        {{ weather.minTemp }} {{ unit === "imperial" ? "°F" : "°C" }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.value-min {
  font-size: 1.6rem;
  font-weight: 500;
  color: #a09fb1;
}
.value-max {
  font-size: 1.6rem;
  font-weight: 500;
  color: #e7e7eb;
}
.date {
  font-size: 1.6rem;
  font-weight: 500;
  color: #e7e7eb;
}
.container {
  background: #1e213a;
  padding: 1.8rem 2.2rem;
}
</style>
