<template>
  <div class="loader-wrapper">
    <div class="loader"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1e213a;
  z-index: 9999;
  transition: 0.5s;
}

.loader {
  border: 0.5rem solid #a09fb1;
  border-top: 0.5rem solid #100e1d;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
