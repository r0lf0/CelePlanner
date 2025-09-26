<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useEventsQuery } from '@/queries/events';

const { isLoading, data: events } = useEventsQuery();
</script>

<template>
  <h1 class="bg-blue-500">Test page</h1>
  <Button class="m-4">Click me</Button>
  <div v-if="isLoading">Loading...</div>
  <div v-else>
    <div v-for="event in events" :key="event.id">
      <h2>{{ event.title }}</h2>
      <p>{{ event.description }}</p>
    </div>
  </div>
</template>