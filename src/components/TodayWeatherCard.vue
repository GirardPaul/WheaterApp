<script setup>
defineProps({
  title: String,
  value: Number,
  unity: String,
});
</script>
<template>
  <div class="flex column justify-between align-center">
    <h4>{{ title }}</h4>
    <p>
      {{ value }}<span class="unity">{{ unity }}</span>
    </p>
  </div>
</template>

<style scoped>
h4 {
  font-weight: 500;
  font-size: 1.6rem;
  color: #e7e7eb;
}
p {
  font-size: 6.4rem;
  font-weight: 700;
  color: #e7e7eb;
}
.unity {
  font-size: 3.6rem;
  font-weight: 500;
  color: #e7e7eb;
}
div {
  padding: 2.2rem 0 4.1rem 0;
  background: #1e213a;
}
</style>
