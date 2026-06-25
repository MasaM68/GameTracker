<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import api from '@/plugins/axios';

const auth = useAuthStore();
const route = useRoute();
const myAnimeList = ref<any[]>([]);
const loading = ref(true);

const fetchMyList = async () => {
  if (auth.user?.id) {
    try {
      const response = await api.get(`/watch-status/${auth.user.id}`);
      myAnimeList.value = response.data;
    } catch (e) {
      console.error("Error loading list:", e);
    } finally {
      loading.value = false;
    }
  }
};

const filteredAnimeList = computed(() => {
  const filter = route.query.filter as string;
  if (!filter) return myAnimeList.value;
  return myAnimeList.value.filter(anime => anime.status === filter);
});

const pageTitle = computed(() => {
  const filter = route.query.filter as string;
  const labels: Record<string, string> = {
    watching: 'Igram',
    completed: 'Završeno',
    plan_to_watch: 'Planiram',
    dropped: 'Napušteno'
  };
  if (!filter) return "Moja lista igrica 🌸";
  return `Moja lista: ${labels[filter] || filter} ✨`;
});

onMounted(fetchMyList);

watch(() => route.query.filter, () => {
  
});

const getStatusClass = (status: string) => {
  return {
    'bg-success': status === 'watching',
    'bg-primary': status === 'completed',
    'bg-secondary': status === 'plan_to_watch',
    'bg-danger': status === 'dropped'
  };
};

const removeFromList = async (animeId: number) => {
  if (!auth.user?.id) return;
  if (!confirm("Da li sigurno želiš da ukloniš ovu igricu?")) return;

  try {
    await api.delete(`/watch-status/${auth.user.id}/${animeId}`);
    await fetchMyList();
  } catch (error) {
    alert("Greška pri brisanju igrice!");
  }
};

const updateReview = async (anime: any) => {
  if (!auth.user?.id) return;
  try {
    const payload = {
      userId: auth.user.id,
      animeId: anime.animeId,
      status: anime.status,
      rating: Number(anime.rating), 
      comment: anime.comment,       
      title: anime.title,
      imageUrl: anime.imageUrl
    };

    await api.post('/watch-status', payload);
    alert("Changes saved successfully! ✨");
    await fetchMyList(); 
  } catch (error) {
    console.error("Save error:", error);
    alert("Error saving your changes.");
  }
};
</script>

<template>
  <div class="container mt-5 pt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-pink fw-bold m-0">{{ pageTitle }}</h2>
      
      <router-link v-if="route.query.filter" to="/favorites" class="btn btn-sm btn-outline-pink rounded-pill px-3">
        <i class="fa-solid fa-list me-2"></i>Show All
      </router-link>
    </div>

    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-pink" role="status"></div>
    </div>

    <div v-else-if="filteredAnimeList.length === 0" class="text-white text-center p-5 bg-dark rounded border-pink shadow-lg">
      <h4 v-if="route.query.filter">Nema igrica sa ovim statusom. 🌸</h4>
      <h4 v-else>Lista ti je prazna. Pretraži i dodaj igrice! ✨</h4>
      <router-link to="/gamelist" class="btn btn-pink mt-3 px-4">Pretraži igrice</router-link>
    </div>

    <div v-else class="table-responsive bg-dark rounded shadow-lg border-pink p-3">
      <table class="table table-dark table-hover align-middle border-pink">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Status</th>
            <th>Score</th>
            <th>Comment</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(anime, index) in filteredAnimeList" :key="anime.animeId">
            <td>{{ index + 1 }}</td>
            <td><img :src="anime.imageUrl" width="50" height="70" class="rounded shadow-sm border-pink object-fit-cover" /></td>
            <td class="fw-bold small" style="max-width: 200px;">{{ anime.title }}</td>
            
            <td>
              <select v-model="anime.status" :class="['form-select form-select-sm text-white border-pink', getStatusClass(anime.status)]" 
                      style="width: 140px; background-color: #212529;">
                <option value="watching">Igram</option>
                <option value="completed">Završeno</option>
                <option value="plan_to_watch">Planiram</option>
                <option value="dropped">Napušteno</option>
              </select>
            </td>
            
            <td>
              <select v-model="anime.rating" class="form-select form-select-sm bg-dark text-white border-pink" style="width: 75px;">
                <option :value="0">--</option>
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
            </td>

            <td>
              <div class="d-flex align-items-center">
                <input v-model="anime.comment" 
                       class="form-control form-control-sm bg-dark text-white border-pink me-2"
                       placeholder="Add a comment..." />
                <button @click="updateReview(anime)" class="btn btn-sm btn-outline-pink" title="Save changes">
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
            </td>

            <td class="text-center">
              <button @click="removeFromList(anime.animeId)" class="btn btn-link text-danger p-0" title="Delete from list">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.text-pink {
  color: #ffb7c5;
}
.bg-pink {
  background-color: #ffb7c5;
  color: #1a1a1a;
}
.btn-pink {
  background-color: #ffb7c5;
  color: #421d2c;
  border: none;
  font-weight: bold;
}
.btn-pink:hover {
  background-color: #ff8da1;
}
.border-pink {
  border: 1px solid rgba(255, 183, 197, 0.3) !important;
}
.btn-outline-pink {
  border-color: #ffb7c5;
  color: #ffb7c5;
}
.btn-outline-pink:hover {
  background-color: #ffb7c5;
  color: #421d2c;
}
.table-hover tbody tr:hover {
  background-color: rgba(255, 183, 197, 0.05);
}
.form-select-sm, .form-control-sm {
  font-size: 0.85rem;
}
.object-fit-cover {
  object-fit: cover;
}
.bg-success { background-color: #2db039 !important; }
.bg-primary { background-color: #26448f !important; }
.bg-secondary { background-color: #969696 !important; }
.bg-danger { background-color: #a12d2d !important; }
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: #ffb7c5;
  border-radius: 10px;
}
</style>