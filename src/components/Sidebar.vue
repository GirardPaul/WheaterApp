<script setup>
import { computed, onMounted, ref } from "vue";
import { useWeatherStore } from "../store/store";
const URL_SEARCH_CITY =
  "https://nominatim.openstreetmap.org/search?format=json";
const URL_REVERSE_GEOCODING =
  "https://nominatim.openstreetmap.org/reverse?format=json";
const dateNow = ref(null);
const searchLocation = ref(false);
const cityField = ref(""),
  currentPage = ref(1),
  citySearchResults = ref([]);
const store = useWeatherStore();
const citySelected = computed(() => store.address && store.address.city);

defineProps({
  currentWeather: Object,
  unit: String,
});

const paginationResults = computed(() => {
  const startIndex = (currentPage.value - 1) * 3;
  const endIndex = startIndex + 3;
  return citySearchResults.value.slice(startIndex, endIndex);
});

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(citySearchResults.value.length / 3);
  return currentPage.value < totalPages;
});
const hasPreviousPage = computed(() => currentPage.value > 1);
async function searchCity() {
  if (!cityField.value) return;

  const response = await fetch(`${URL_SEARCH_CITY}&city=${cityField.value}`);
  if (response.ok) {
    citySearchResults.value = await response.json();
  }
}

function nextPage() {
  const totalPages = Math.ceil(citySearchResults.value.length / 3);
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

async function reverseLatLng(lat, lng) {
  const response = await fetch(
    `${URL_REVERSE_GEOCODING}&lat=${lat}&lon=${lng}`
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return null;
}
function findMyLocation() {
  store.isLoading = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const retreiveCity = await reverseLatLng(
          coords.latitude,
          coords.longitude
        );
        if (
          retreiveCity &&
          retreiveCity.address &&
          retreiveCity.address.village
        ) {
          store.addAddress({
            city: retreiveCity.address.village,
            lat: coords.latitude,
            lng: coords.longitude,
          });
        }
      },
      (error) => {
        store.isLoading = false;
        searchLocation.value = true;
      }
    );
  } else {
    store.isLoading = false;
    searchLocation.value = true;
  }
}

function selectAddress(city) {
  store.addAddress({
    city: city && city.display_name ? city.display_name.split(",")[0] : "",
    lat: city.lat,
    lng: city.lon,
  });
  searchLocation.value = false;
}

onMounted(() => {
  const currentDate = new Date();
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const day = dayNames[currentDate.getDay()];
  const date = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];

  dateNow.value = `${day}, ${date} ${month}`;
});
</script>

<template>
  <div
    :class="[
      'flex',
      'column',
      'container',
      !searchLocation ? 'no-search' : 'min-h-100',
    ]"
  >
    <div v-if="!searchLocation" class="flex align-center full justify-between">
      <button
        @click="searchLocation = !searchLocation"
        class="btn-search-places pointer"
      >
        Rechercher une ville
      </button>
      <button @click="findMyLocation()" class="btn-search-localisation pointer">
        <span class="material-icons white">my_location</span>
      </button>
    </div>
    <div v-else class="flex column align-center full">
      <span
        @click="searchLocation = !searchLocation"
        class="material-icons white align-self-end pointer"
        >close</span
      >
      <div class="flex mt-45 full">
        <div class="flex align-center flex-1 container-search-input">
          <span class="material-icons">search</span>
          <input
            class="search-input"
            type="text"
            placeholder="Exemple : Paris"
            v-model="cityField"
            @keyup.enter="searchCity()"
          />
        </div>

        <button
          @click="searchCity()"
          :class="[
            'btn-search',
            'transition',
            'pointer',
            'ml-12',
            !cityField ? 'disabled' : '',
          ]"
        >
          Search
        </button>
      </div>
    </div>
    <div v-if="!searchLocation" class="flex column align-center">
      <img
        :src="currentWeather.imgUrl"
        alt="Shower Logo"
        class="logo-weather"
      />
      <h3>
        {{ currentWeather.temperature
        }}<span class="metric">{{ unit === "imperial" ? "°F" : "°C" }}</span>
      </h3>
      <p class="wheater">{{ currentWeather.weather }}</p>
      <div class="day-informations flex justify-between align-center">
        <p>Aujourd'hui</p>
        <p class="m-16">•</p>
        <p>{{ dateNow }}</p>
      </div>
      <div class="localisation flex align-center">
        <span class="material-icons">location_on</span>
        <p class="ml-9">{{ citySelected }}</p>
      </div>
    </div>
    <div v-else class="flex column">
      <div class="grid city">
        <div
          @click="selectAddress(city)"
          v-for="city in paginationResults"
          :key="city.place_id"
          class="flex align-center result-city pointer justify-between"
        >
          <p>{{ city.display_name }}</p>
          <span class="material-icons"> chevron_right </span>
        </div>
      </div>
      <div
        v-if="hasNextPage || hasPreviousPage"
        class="grid container-pagination"
      >
        <button
          @click="previousPage()"
          :class="[
            'btn-search',
            'transition',
            'pointer',
            hasPreviousPage ? '' : 'disabled',
          ]"
        >
          Précédent
        </button>
        <button
          @click="nextPage()"
          :class="[
            'btn-search',
            'transition',
            'pointer',
            hasNextPage ? '' : 'disabled',
          ]"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
p,
h3 {
  text-align: center;
}
.ml-9 {
  margin-left: 0.9rem;
}
.container-pagination {
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  margin-top: 7.2rem;
}
.result-city span {
  color: transparent;
}
.result-city {
  padding: 2.3rem 1.2rem;
}
.result-city:hover {
  border: 1px solid #616475;
  transition: 0.5s;
}
.result-city:hover span {
  color: #616475;
}
.result-city p {
  font-weight: 500;
  font-size: 1.6rem;
  color: #e7e7eb;
}
.city {
  gap: 7.2rem;
  margin-top: 7.2rem;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.ml-12 {
  margin-left: 1.2rem;
}
.mt-45 {
  margin-top: 4.5rem;
}
.min-h-100 {
  min-height: 100vh;
}
.container-search-input {
  border: 1px solid #e7e7eb;
  padding: 1.5rem;
}
.search-input {
  border: none;
  font-weight: 500;
  font-size: 1.6rem;
  color: #616475;
  background-color: transparent;
  margin-left: 1.6rem;
}
.container-search-input span {
  color: #616475;
}
.search-input:focus {
  outline: none;
  border: none;
}
.container-search-input:has(input:focus) {
  border: 1px solid #3c47e9;
}
.btn-search {
  border: none;
  background: #3c47e9;
  font-size: 1.6rem;
  font-weight: 600;
  color: #e7e7eb;
  padding: 1.4rem 1.9rem;
}
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
.no-search {
  background-image: url("../assets/Cloud-background.png");
  background-position: 50% 20%;
  background-blend-mode: soft-light;
}
.container {
  background-color: #1e213a;
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
.btn-search-localisation:hover,
.btn-search-places:hover {
  background: #e7e7eb;
  color: #110e3c;
}
.btn-search-localisation:hover .material-icons {
  color: #110e3c;
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
