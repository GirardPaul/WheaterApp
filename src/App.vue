<template>
  <section class="flex">
    <Sidebar />

    <main class="flex column">
      <p>Content</p>
    </main>
  </section>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import { onMounted, ref } from "vue";
import { useWeatherStore } from "./store/store";
const store = useWeatherStore();
onMounted(() => {
  store.initWeather();
});
</script>

<style scoped>
main {
  flex: 1;
  background: #100e1d;
}
</style>
