<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';

const RAWG_KEY = '896f3407955c4cb9b6bb41b20f676ab1';

const props = defineProps({
    searchResults: Array
});

const displayList = ref<any[]>([]);
const currentPage = ref(1);
const hasNextPage = ref(true);
const isSearching = ref(false);
const filterGenre = ref('');

const fetchGames = async (page = 1) => {
    try {
        const genreParam = filterGenre.value ? `&genres=${filterGenre.value}` : '';
        const response = await axios.get(
            `https://api.rawg.io/api/games?key=${RAWG_KEY}&page=${page}&page_size=20${genreParam}`
        );
        displayList.value = response.data.results;
        hasNextPage.value = !!response.data.next;
        isSearching.value = false;
    } catch (e) {
        console.error("Greška pri učitavanju igrica:", e);
    }
};

watch(filterGenre, () => {
    currentPage.value = 1;
    fetchGames(1);
});

watch(() => props.searchResults, (newResults) => {
    if (newResults && newResults.length > 0) {
        displayList.value = newResults;
        isSearching.value = true;
        hasNextPage.value = false;
    } else {
        fetchGames(1);
    }
}, { immediate: true });

const changePage = (step: number) => {
    currentPage.value += step;
    fetchGames(currentPage.value);
    window.scrollTo(0, 0);
};
</script>

<template>
    <div class="game-list-page container-fluid px-4">
        <div class="row align-items-center mb-5 g-3">
            <div class="col-12 col-md-6 text-center text-md-start">
                <h2 class="text-pink fw-bold m-0">
                    {{ isSearching ? 'Rezultati pretrage 🔍' : 'Popularne igrice 👾' }}
                </h2>
            </div>

            <div v-if="!isSearching" class="col-12 col-md-6 text-center text-md-end">
                <div class="d-inline-block">
                    <label class="text-white me-2 d-none d-md-inline">Žanr:</label>
                    <select v-model="filterGenre"
                        class="form-select d-inline-block w-auto bg-dark text-white border-pink shadow-sm custom-select">
                        <option value="">Svi žanrovi</option>
                        <option value="action">Akcija</option>
                        <option value="rpg">RPG</option>
                        <option value="strategy">Strategija</option>
                        <option value="adventure">Avantura</option>
                        <option value="shooter">Pucačina</option>
                        <option value="puzzle">Puzzle</option>
                        <option value="sports">Sport</option>
                        <option value="racing">Trke</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="game in displayList" :key="game.id" class="col">
                <router-link :to="'/game/' + game.id" class="text-decoration-none">
                    <div class="card bg-dark border-pink h-100 game-card shadow">
                        <div class="img-container">
                            <img :src="game.background_image" class="card-img-top game-img" alt="cover">
                        </div>
                        <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <h6 class="text-white text-center m-0 small">{{ game.name }}</h6>
                            <small class="text-pink mt-1 opacity-75" v-if="game.rating">
                                ⭐ {{ game.rating.toFixed(1) }}
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <div v-if="!isSearching" class="pagination-container">
            <button class="btn-game" @click="changePage(-1)" :disabled="currentPage === 1">
                ← Prethodna
            </button>
            <span class="page-info">Strana {{ currentPage }}</span>
            <button class="btn-game" @click="changePage(1)" :disabled="!hasNextPage">
                Sledeća →
            </button>
        </div>
    </div>
</template>

<style scoped>
.text-pink {
    color: #ffb7c5;
    text-shadow: 0 0 10px rgba(255, 183, 197, 0.3);
}
.border-pink {
    border-color: #ffb7c5 !important;
}
.game-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}
.game-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(255, 183, 197, 0.2) !important;
    border-color: #ff69b4 !important;
}
.img-container {
    height: 200px;
    overflow: hidden;
}
.game-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.custom-select {
    border-radius: 20px;
    padding-left: 15px;
    padding-right: 35px;
}
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 60px 0;
}
.btn-game {
    background-color: transparent;
    border: 2px solid #ffb7c5;
    color: #ffb7c5;
    padding: 8px 25px;
    border-radius: 30px;
    font-weight: bold;
    transition: all 0.3s ease;
}
.btn-game:hover:not(:disabled) {
    background-color: #ffb7c5;
    color: #421d2c;
}
.btn-game:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
.page-info {
    color: white;
    font-size: 1.1rem;
}
</style>
