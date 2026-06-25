<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const RAWG_KEY = '896f3407955c4cb9b6bb41b20f676ab1';

const emit = defineEmits(['search'])
const searchTerm = ref('')
const suggestions = ref<any[]>([])
const router = useRouter()

watch(searchTerm, async (newVal) => {
  if (newVal.length > 2) {
    try {
      const res = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${newVal}&page_size=5`)
      suggestions.value = res.data.results
    } catch (e) {
      console.error(e)
    }
  } else {
    suggestions.value = []
  }
})

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    emit('search', searchTerm.value)
    suggestions.value = []
  }
}

const selectGame = (id: number) => {
  searchTerm.value = ''
  suggestions.value = []
  router.push(`/game/${id}`)
}
</script>

<template>
  <div class="search-container">
    <div class="input-wrapper">
      <input
        type="text"
        placeholder="Pretraži igrice..."
        v-model="searchTerm"
        @keyup.enter="handleSearch"
      />

      <ul v-if="suggestions.length > 0" class="mini-list">
        <li v-for="game in suggestions" :key="game.id" @click="selectGame(game.id)">
          <img :src="game.background_image" alt="thumb" />
          <div class="mini-text">
            <span class="mini-title">{{ game.name }}</span>
            <span class="mini-info" v-if="game.rating">⭐ {{ game.rating.toFixed(1) }}</span>
          </div>
        </li>
      </ul>
    </div>

    <button @click="handleSearch">Pretraži</button>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
  position: relative;
}
.input-wrapper {
  position: relative;
}
input {
  padding: 10px 15px;
  width: 300px;
  border: 1px solid #ffb7c5;
  border-radius: 20px;
  outline: none;
  transition: 0.3s;
  background-color: white;
  color: #333;
}
input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 8px rgba(255, 72, 168, 0.2);
}
button {
  padding: 10px 20px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}
button:hover {
  background-color: #ff1493;
  transform: scale(1.05);
}
.mini-list {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #2b131d;
  border: 1px solid #ffb7c5;
  border-radius: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
.mini-list li {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 183, 197, 0.1);
  transition: background 0.2s;
}
.mini-list li:hover {
  background: #ffb7c5;
}
.mini-list li:hover .mini-title,
.mini-list li:hover .mini-info {
  color: #421d2c;
}
.mini-list img {
  width: 55px;
  height: 35px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
}
.mini-text {
  display: flex;
  flex-direction: column;
}
.mini-title {
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.mini-info {
  color: #ffb7c5;
  font-size: 0.7rem;
}
</style>
