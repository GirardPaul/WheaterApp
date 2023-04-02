<template>
  <div class="flex column container">
    <div class="flex align-center full justify-between">
      <button class="btn-search-places pointer">Search for places</button>
      <button class="btn-search-localisation pointer">
        <span class="material-icons white">my_location</span>
      </button>
    </div>
    <img src="../assets/Shower.png" alt="Shower Logo" class="logo-weather" />
    <h3>15<span class="metric">°C</span></h3>
    <p class="wheater">Shower</p>
    <div class="day-informations flex justify-between align-center">
      <p>Aujourd'hui</p>
      <p class="m-16">•</p>
      <p>Dim, 2 Avr</p>
    </div>
    <div class="localisation flex align-center">
      <span class="material-icons">location_on</span>
      <p>Paris</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
</script>

<style scoped>
.logo-weather {
  margin: 10rem 0 9rem 0;
}
.m-16 {
  margin: 0 1.6rem;
}
.localisation p,
.localisation span {
  font-weight: 600;
  font-size: 1.8rem;
  color: #88869d;
  margin-top: 3.2rem;
}

.day-informations p {
  font-weight: 500;
  font-size: 1.8rem;
  color: #88869d;
}
.wheater {
  font-weight: 600;
  font-size: 3.6rem;
  color: #a09fb1;
  margin: 9rem 0;
}
h3 {
  font-size: 14.4rem;
  color: #e7e7eb;
  font-weight: 500;
}
.metric {
  font-size: 4.8rem;
  font-weight: 300;
  color: #a09fb1;
}
.container {
  position: relative;
  background-color: #1e213a;
  background-image: url("../assets/Cloud-background.png");
  background-blend-mode: soft-light;
  background-position: 50% 20%;
  background-repeat: no-repeat;
  background-size: 150%;
  padding: 4.2rem 4.6rem;
  width: 46rem;
  align-items: center;
}

img {
  width: 20rem;
}
.btn-search-localisation {
  display: flex;
  border-radius: 50%;
  padding: 0.9rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.btn-search-places {
  background: #6e707a;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.1rem 1.8rem;
}
</style>
