<script setup lang="ts">
    export interface NavBarLinkProps {
        to: string;
        name: string;
    }

    const {to, name} = defineProps<NavBarLinkProps>();
</script>

<template>
    <li class="nav-item">
        <RouterLink class="nav-link active" :to="to">{{ name }}</RouterLink>
    </li>
</template> 

<style scoped>
.nav-link {
  text-decoration: none;
  color: #ec48a8;
  font-weight: bold;
  padding: 0 15px;

}
.nav-link:hover {
  color: #d63472;
  text-decoration: underline;
}
</style>