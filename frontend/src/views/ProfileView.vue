<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const auth = useAuthStore();
const router = useRouter();
const myAnimeList = ref<any[]>([]);
const loading = ref(true);

const fetchStats = async () => {
  if (auth.user?.id) {
    try {
      const response = await api.get(`/watch-status/${auth.user.id}`);
      myAnimeList.value = response.data;
    } catch (e) {
      console.error("Error fetching stats", e);
    } finally {
      loading.value = false;
    }
  }
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const stats = computed(() => {
  return {
    watching: myAnimeList.value.filter(a => a.status === 'watching').length,
    completed: myAnimeList.value.filter(a => a.status === 'completed').length,
    plan_to_watch: myAnimeList.value.filter(a => a.status === 'plan_to_watch').length,
    dropped: myAnimeList.value.filter(a => a.status === 'dropped').length,
    total: myAnimeList.value.length
  };
});

onMounted(fetchStats);
</script>

<template>
  <div class="container mt-5 pt-5">
    <div v-if="!loading" class="profile-card glass-effect p-0 rounded-4 shadow-lg overflow-hidden">
      <div class="row g-0">
        <div class="col-md-4 text-center profile-sidebar p-4 d-flex flex-column align-items-center justify-content-center">
          <div class="avatar-container mb-3">
            <img src="https://i.pinimg.com/originals/f1/0e/11/f10e115c735d39234190416957a0f670.jpg"
                 class="profile-img shadow-pink" />
            </div>
          <h2 class="text-pink fw-bold mb-1">{{ auth.user?.username }}</h2>
          <p class="text-white opacity-50 small mb-4">{{ auth.user?.email }}</p>
          
          <button @click="handleLogout" class="btn btn-outline-pink btn-sm px-4 rounded-pill">
            <i class="fa-solid fa-right-from-bracket me-2"></i>Logout
          </button>
        </div>

        <div class="col-md-8 p-4 p-lg-5 bg-dark-soft">
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom-pink pb-3">
            <h4 class="text-pink fw-bold m-0">Statistike igranja <i class="fa-solid fa-chart-simple ms-2"></i></h4>
          </div>

          <div class="stats-grid">
            <router-link :to="{ path: '/favorites', query: { filter: 'watching' } }" class="stat-card text-decoration-none">
              <div class="stat-icon-wrapper watching-bg">
                <i class="fa-solid fa-play text-white"></i>
              </div>
              <div class="ms-3">
                <div class="stat-value">{{ stats.watching }}</div>
                <div class="stat-label">Igram</div>
              </div>
            </router-link>

            <router-link :to="{ path: '/favorites', query: { filter: 'completed' } }" class="stat-card text-decoration-none">
              <div class="stat-icon-wrapper completed-bg">
                <i class="fa-solid fa-check text-white"></i>
              </div>
              <div class="ms-3">
                <div class="stat-value">{{ stats.completed }}</div>
                <div class="stat-label">Završeno</div>
              </div>
            </router-link>

            <router-link :to="{ path: '/favorites', query: { filter: 'plan_to_watch' } }" class="stat-card text-decoration-none">
              <div class="stat-icon-wrapper plan-bg">
                <i class="fa-solid fa-clock text-white"></i>
              </div>
              <div class="ms-3">
                <div class="stat-value">{{ stats.plan_to_watch }}</div>
                <div class="stat-label">Planiram</div>
              </div>
            </router-link>

            <router-link :to="{ path: '/favorites', query: { filter: 'dropped' } }" class="stat-card text-decoration-none">
              <div class="stat-icon-wrapper dropped-bg">
                <i class="fa-solid fa-trash-can text-white"></i>
              </div>
              <div class="ms-3">
                <div class="stat-value">{{ stats.dropped }}</div>
                <div class="stat-label">Napušteno</div>
              </div>
            </router-link>
          </div>

          <div class="total-bar mt-5">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-white fw-bold">Library Completion</span>
              <span class="text-pink fw-bold">{{ stats.total }} Titles</span>
            </div>
            <div class="progress bg-secondary" style="height: 10px;">
              <div class="progress-bar bg-pink" role="progressbar" :style="{ width: '100%' }"></div>
            </div>
          </div>

          <router-link to="/favorites" class="btn btn-pink w-100 mt-4 py-3 fw-bold rounded-3 shadow-pink-btn">
            MOJA LISTA IGRICA 🌸
          </router-link>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center mt-5">
      <div class="spinner-border text-pink" role="status"></div>
    </div>
  </div>
</template>

<style scoped>
.glass-effect {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 183, 197, 0.3);
}
.profile-sidebar {
  background: rgba(255, 183, 197, 0.05);
  border-right: 1px solid rgba(255, 183, 197, 0.1);
}
.bg-dark-soft {
  background: #1e1e1e;
}
.profile-img {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #ffb7c5;
}
.shadow-pink {
  box-shadow: 0 0 20px rgba(255, 183, 197, 0.3);
}
.avatar-container {
  position: relative;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 183, 197, 0.08);
  border-color: rgba(255, 183, 197, 0.4);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.watching-bg { background: #2db039; }
.completed-bg { background: #26448f; }
.plan-bg { background: #969696; }
.dropped-bg { background: #a12d2d; }
.stat-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}
.stat-label {
  font-size: 0.75rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.text-pink { color: #ffb7c5 !important; }
.bg-pink { background-color: #ffb7c5 !important; }
.bg-pink-light { background-color: rgba(255, 183, 197, 0.1); }
.border-bottom-pink { border-bottom: 1px solid rgba(255, 183, 197, 0.2); }
.btn-pink {
  background: #ffb7c5;
  color: #421d2c;
  border: none;
  transition: all 0.3s ease;
}
.btn-pink:hover {
  background: #ff8da1;
  transform: scale(1.02);
}
.shadow-pink-btn {
  box-shadow: 0 4px 15px rgba(255, 183, 197, 0.3);
}
.btn-outline-pink {
  border: 1px solid #ffb7c5;
  color: #ffb7c5;
}
.btn-outline-pink:hover {
  background: #ffb7c5;
  color: #1e1e1e;
}
</style>