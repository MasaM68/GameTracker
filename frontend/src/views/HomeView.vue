<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const RAWG_KEY = '896f3407955c4cb9b6bb41b20f676ab1';
const trendingGames = ref<any[]>([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_KEY}&page_size=8&ordering=-rating`);
    trendingGames.value = response.data.results;
  } catch (e) {
    console.error("Greška pri učitavanju igrica:", e);
  }
});
</script>

<template>
  <div class="home-container">
    <div class="hero-section text-center py-5">
      <h1 class="text-pink fw-bold display-3">Dobrodošli na GameTracker 👾</h1>
      <p class="text-white fs-5">Pronađi, oceni i prati svoje omiljene video igrice.</p>
    </div>

    <div class="row row-cols-1 row-cols-md-4 g-4 mt-4">
      <div v-for="game in trendingGames" :key="game.id" class="col">
        <div
          class="card bg-dark border-pink h-100 game-card shadow"
          @click="router.push(`/game/${game.id}`)"
          style="cursor: pointer;"
        >
          <img
            :src="game.background_image"
            class="card-img-top"
            alt="game cover"
            style="height: 220px; object-fit: cover;"
          >
          <div class="card-body">
            <h6 class="text-pink card-title mb-1">{{ game.name }}</h6>
            <small class="text-white opacity-50" v-if="game.rating">
              ⭐ {{ game.rating.toFixed(1) }} / 5
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  transition: transform 0.2s ease;
}
.game-card:hover {
  transform: translateY(-5px);
}
</style>
