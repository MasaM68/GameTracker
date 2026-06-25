<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import api from '@/plugins/axios';

const RAWG_KEY = '896f3407955c4cb9b6bb41b20f676ab1';

const route = useRoute();
const auth = useAuthStore();
const game = ref<any>(null);
const status = ref('plan_to_watch');
const rating = ref(0);
const commentText = ref("");

onMounted(async () => {
    const id = route.params.id;
    try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`);
        game.value = response.data;
    } catch (e) {
        console.error("Greška pri učitavanju igrice:", e);
    }
});

const getScoreLabel = (n: number) => {
    const labels: Record<number, string> = {
        10: "Remek-delo", 9: "Odlično", 8: "Vrlo dobro", 7: "Dobro", 6: "Solidno",
        5: "Prosečno", 4: "Loše", 3: "Vrlo loše", 2: "Užasno", 1: "Katastrofa"
    };
    return labels[n] || "";
};

const addToMyList = async () => {
    if (!auth.user || !auth.user.id) {
        alert("Morate biti prijavljeni!");
        return;
    }

    const payload = {
        userId: auth.user.id,
        animeId: game.value.id,
        status: status.value,
        title: game.value.name,
        imageUrl: game.value.background_image,
        rating: rating.value,
        comment: commentText.value
    };

    try {
        await api.post('/watch-status', payload);
        alert(`Uspešno dodato na listu! ✨`);
        commentText.value = "";
    } catch (error) {
        console.error("Greška pri dodavanju:", error);
        alert("Greška pri dodavanju igrice.");
    }
};
</script>

<template>
    <div v-if="game" class="container mt-5 pb-5">
        <div class="row">
            <div class="col-md-4 text-center">
                <img :src="game.background_image" class="img-fluid rounded border-pink shadow-lg" />

                <div v-if="auth.isLoggedIn" class="mt-4 p-3 bg-dark rounded border border-pink text-start">
                    <label class="text-white mb-2 d-block small">Izaberi status:</label>
                    <select v-model="status" class="form-select bg-dark text-white border-pink mb-3">
                        <option value="watching">Igram</option>
                        <option value="completed">Završeno</option>
                        <option value="plan_to_watch">Planiram</option>
                        <option value="dropped">Napušteno</option>
                    </select>

                    <label class="text-white mb-2 d-block small">Ocena:</label>
                    <select v-model="rating" class="form-select bg-dark text-white border-pink mb-3">
                        <option :value="0">Izaberi ocenu</option>
                        <option v-for="n in 10" :key="n" :value="n">({{ n }}) {{ getScoreLabel(n) }}</option>
                    </select>

                    <label class="text-white mb-2 d-block small">Komentar (opciono):</label>
                    <textarea v-model="commentText" class="form-control bg-dark text-white border-pink mb-3" rows="3" placeholder="Utisci..."></textarea>

                    <button @click="addToMyList" class="btn btn-pink w-100 fw-bold">Dodaj na listu 🌸</button>
                </div>
            </div>

            <div class="col-md-8 text-white ps-md-5">
                <h1 class="text-pink fw-bold display-4 mb-3">{{ game.name }}</h1>

                <div class="mb-4">
                    <span v-for="genre in game.genres" :key="genre.id" class="badge bg-dark border-pink text-pink me-2">
                        {{ genre.name }}
                    </span>
                    <span v-if="game.rating" class="text-warning fw-bold ms-1">
                        ⭐ {{ game.rating.toFixed(2) }} / 5
                    </span>
                    <span v-if="game.metacritic" class="badge ms-2" style="background:#6c3;">
                        Metacritic: {{ game.metacritic }}
                    </span>
                </div>

                <div class="synopsis-section mb-4">
                    <h4 class="text-pink border-bottom border-pink pb-2 mb-3">Opis</h4>
                    <p class="synopsis-text">{{ game.description_raw }}</p>
                </div>

                <div class="info-grid bg-dark p-3 rounded border border-pink">
                    <div class="row">
                        <div class="col-6 mb-2">
                            <span class="text-pink small d-block">Datum izlaska:</span>
                            <span>{{ game.released || 'Nepoznato' }}</span>
                        </div>
                        <div class="col-6 mb-2">
                            <span class="text-pink small d-block">Vreme igranja:</span>
                            <span>{{ game.playtime ? game.playtime + ' sati' : 'N/A' }}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-pink small d-block">Platforme:</span>
                            <span v-for="p in game.platforms" :key="p.platform.id" class="me-1 small">
                                {{ p.platform.name }},
                            </span>
                        </div>
                        <div class="col-6">
                            <span class="text-pink small d-block">Razvijač:</span>
                            <span v-for="dev in game.developers" :key="dev.id" class="me-1 small">
                                {{ dev.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.border-pink { border-color: #ffb7c5 !important; }
.text-pink   { color: #ffb7c5 !important; }
.btn-pink {
    background-color: #ffb7c5;
    color: #421d2c;
    border: none;
}
.btn-pink:hover {
    background-color: #ff8da1;
    color: #421d2c;
}
.synopsis-text {
    line-height: 1.6;
    font-size: 1rem;
    text-align: justify;
    color: #e0e0e0;
    white-space: pre-line;
}
</style>
