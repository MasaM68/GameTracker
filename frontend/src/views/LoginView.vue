<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref(''); 
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  if (email.value && password.value) {
    try {
      await auth.login({
        email: email.value,
        password: password.value
      });

      router.push('/profile'); 
      alert('Welcome! 👾');
    } catch (error) {
      alert('Login failed! Please check your credentials. 🌸');
    }
  } else {
    alert('Please fill in all fields! 👾');
  }
};
</script>

<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card login-card shadow-lg">
      <div class="card-body p-5 text-center">
        <h2 class="text-pink mb-4 fw-bold">Login 👾</h2>
        
        <form @submit.prevent="handleLogin" class="text-start">
          <div class="mb-4">
            <label class="form-label text-pink small fw-bold">Email</label>
            <input 
              v-model="email" 
              type="email" 
              class="form-control custom-input" 
              required
            >
          </div>

          <div class="mb-5">
            <label class="form-label text-pink small fw-bold">Password</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-control custom-input" 
              required
            >
          </div>

          <button type="submit" class="btn btn-pink w-100 fw-bold py-2 shadow mb-4">
            Login
          </button>
        </form>

        <div class="register-link mt-2">
          <p class="text-white small mb-1 opacity-75">Don't have an account yet?</p>
          <router-link to="/register" class="text-pink fw-bold text-decoration-none">
            Create account here gamers
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh;
}
.login-card {
  background-color: #212529 !important;
  border: 1px solid #ffb7c5 !important;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
}
.custom-input {
  background-color: #252525 !important;
  border: 1px solid #444 !important;
  color: white !important;
}
.custom-input:focus {
  background-color: #2a2a2a !important;
  border-color: #ff69b4 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 105, 180, 0.25) !important;
}
.btn-pink {
  background-color: #ffb7c5 !important;
  color: #1a1a1a !important;
  border: none;
  transition: all 0.3s ease;
}
.btn-pink:hover {
  background-color: #ff69b4 !important;
  color: white !important;
  transform: translateY(-2px);
}
.text-pink {
  color: #ffb7c5 !important;
}
.register-link a:hover {
  color: #ff69b4 !important;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
}
</style> 