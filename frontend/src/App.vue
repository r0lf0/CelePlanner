<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import CalendarView from './components/CalendarView.vue'


import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initTokens();
});

</script>

<template>
  <CalendarView />
  <Toaster />
</template>
