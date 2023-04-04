<script setup>
const props = defineProps({
  title: String,
  value: Number,
  windDirection: String,
  windDegree: Number,
  unity: String,
});
</script>
<template>
  <div class="container flex column justify-between align-center">
    <h4>{{ title }}</h4>
    <p class="value">
      {{ value }}<span class="unity">{{ unity }}</span>
    </p>
    <div class="flex align-center" v-if="title === 'Vent'">
      <span
        :style="{
          transform: `rotate(${windDegree - 180}deg)`,
        }"
        class="material-icons white"
        >navigation</span
      >
      <p class="wind-direction">{{ windDirection }}</p>
    </div>
    <div v-else-if="title === 'Humidité'" class="flex column full">
      <div class="flex justify-between align-center">
        <p class="legend-humidity">0</p>
        <p class="legend-humidity">50</p>
        <p class="legend-humidity">100</p>
      </div>
      <div
        :style="{
          background: `linear-gradient(to right, #FFEC65, ${value}%, #E7E7EB ${value}%)`,
        }"
        class="humidity-bar"
      ></div>
      <p class="humidity-unity">%</p>
    </div>
  </div>
</template>

<style scoped>
.humidity-unity {
  font-size: 1.2rem;
  font-weight: 700;
  color: #a09fb1;
  align-self: flex-end;
}
.humidity-bar {
  border-radius: 8rem;
  height: 0.8rem;
  margin-top: 0.2rem;
  margin-bottom: 0.4rem;
}
.legend-humidity {
  font-size: 1.2rem;
  font-weight: 700;
  color: #a09fb1;
}
.wind-direction {
  font-size: 1.4rem;
  font-weight: 500;
  color: #e7e7eb;
  margin-left: 1.4rem;
}
.material-icons {
  padding: 0.7rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #e7e7eb;
}
h4 {
  font-weight: 500;
  font-size: 1.6rem;
  color: #e7e7eb;
}
.value {
  font-size: 6.4rem;
  font-weight: 700;
  color: #e7e7eb;
}
.unity {
  font-size: 3.6rem;
  font-weight: 500;
  color: #e7e7eb;
}
.container {
  padding: 2.2rem 5rem 2.2rem 5rem;
  background: #1e213a;
}

.container div:last-of-type {
  padding-bottom: 0 !important;
}
</style>
