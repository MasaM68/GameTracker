<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import NavBarLink from './components/NavBarLink.vue'
import SearchBar from './components/SearchBar.vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth"; 

const auth = useAuthStore()
const router = useRouter()
const title = ref('GameTracker')
const results = ref([])

const isNotProfilePage = computed(() => {
  return router.currentRoute.value.path !== '/profile';
});

const RAWG_KEY = '896f3407955c4cb9b6bb41b20f676ab1';

const onSearch = async (searchTerm: string) => {
  if (!searchTerm.trim()) {
    results.value = [];
    return;
  }
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${searchTerm}`)
    results.value = response.data.results
    if (router.currentRoute.value.path !== '/gamelist') {
      router.push('/gamelist')
    }
  } catch (e) {
    console.error('Greška pri pretrazi:', e)
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-pink sticky-top">
    <div class="container-fluid px-4">
      <RouterLink class="navbar-brand fw-bold fs-3 me-4" to="/">
        {{ title }} <span>👾</span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav"> 
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center gap-2">
          <li class="nav-item"><NavBarLink to="/" name="Početna" /></li>
          <li class="nav-item"><NavBarLink to="/gamelist" name="Igrice" @click="results = []" /></li>
          <li v-if="auth.isLoggedIn" class="nav-item"><NavBarLink to="/profile" name="Profil" /></li>
          <li v-else class="nav-item"><NavBarLink to="/login" name="Prijava" /></li>
          <li v-if="auth.isLoggedIn"><NavBarLink to="/favorites" name="Moja lista" /></li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <template v-if="auth.isLoggedIn && isNotProfilePage">
            <div class="d-none d-xl-block">
              <span class="text-pink small italic me-2">Dobrodošli, {{ auth.user?.username }}</span>
            </div>
            <button 
              @click="handleLogout" 
              class="btn btn-outline-pink-nav btn-sm rounded-pill px-3 py-1"
              style="color: #ffb7c5 !important; border: 1px solid #ffb7c5 !important; display: inline-block !important;"
            >
              Odjava
            </button>
          </template>
          
          <div class="search-wrapper">
            <SearchBar @search="onSearch" />
          </div>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mt-5">
    <RouterView :searchResults="results" />
  </main>
</template>

<style>
body, #app {
  background-color: #421d2c !important; /* Tvoja tamna tema */
  color: white;
  min-height: 100vh;
}
.text-pink { color: #ffb7c5 !important; }
.italic { font-style: italic; }
.border-pink { border-color: #ffb7c5 !important; }
.btn-outline-pink-nav {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease-in-out;
  background-color: transparent !important;
}
.btn-outline-pink-nav:hover {
  background-color: #ffb7c5 !important;
  color: #421d2c !important;
  box-shadow: 0 0 15px rgba(255, 183, 197, 0.6) !important;
}
.search-wrapper { min-width: 200px; }
.navbar-nav .nav-link, .navbar-nav .nav-item a {
  color: #ffb7c5 !important;
  padding: 0.5rem 1rem !important;
}
.navbar-nav .router-link-active {
  color: #ff69b4 !important;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5) !important;
}

</style>