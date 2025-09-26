<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import Dashboard from './components/Dashboard.vue'


import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initTokens();
});

</script>

<template>
  <Dashboard />
  <Toaster />
</template>
