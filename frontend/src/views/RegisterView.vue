<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    alert("Please fill in all fields! 🌸");
    return;
  }

  loading.value = true;
  try {
    await api.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    alert("Registration successful! You can now log in. ✨");
    router.push('/login');
  } catch (error: any) {
    console.error("Registration error:", error);
    alert(error.response?.data?.message || "Registration failed. Try again!");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 75vh;">
    <div class="card bg-dark border-pink p-4 shadow-lg register-card">
      <h2 class="text-pink fw-bold text-center mb-4">Create Account 🌸</h2>
      
      <div class="mb-3">
        <label class="text-white small mb-1">Username</label>
        <input v-model="username" type="text" class="form-control bg-dark text-white border-pink" placeholder="Choose a username">
      </div>

      <div class="mb-3">
        <label class="text-white small mb-1">Email</label>
        <input v-model="email" type="email" class="form-control bg-dark text-white border-pink" placeholder="your@email.com">
      </div>

      <div class="mb-4">
        <label class="text-white small mb-1">Password</label>
        <input v-model="password" type="password" class="form-control bg-dark text-white border-pink" placeholder="Min. 6 characters">
      </div>

      <button @click="handleRegister" :disabled="loading" class="btn btn-pink w-100 fw-bold py-2">
        {{ loading ? 'Signing up...' : 'Register Now ✨' }}
      </button>
      
      <p class="text-center mt-3 small text-white opacity-75">
        Already have an account? 
        <router-link to="/login" class="text-pink text-decoration-none fw-bold ms-1">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-card {
  width: 100%;
  max-width: 400px;
}
.border-pink {
  border: 1px solid #ffb7c5 !important;
}
.text-pink {
  color: #ffb7c5 !important;
}
.btn-pink {
  background-color: #ffb7c5;
  color: #421d2c;
  border: none;
  transition: all 0.3s ease;
}
.btn-pink:hover:not(:disabled) {
  background-color: #ff8da1;
  box-shadow: 0 0 15px rgba(255, 183, 197, 0.4);
}
.form-control:focus {
  background-color: #2b2b2b;
  color: white;
  border-color: #ffb7c5;
  box-shadow: 0 0 8px rgba(255, 183, 197, 0.2);
}
</style>