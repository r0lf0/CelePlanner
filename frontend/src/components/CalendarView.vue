<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Button } from "./ui/button";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { it } from "date-fns/locale";
import type { CelePlannerEvent } from "@/types/event";
import { useEventsQuery } from "@/queries/events";

const selectedDate = ref<Date>(new Date());

const { data: events } = useEventsQuery();

const monthName = computed(() => {
  const name = selectedDate.value.toLocaleString("it-IT", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const onUpdateMonth = (amount: number) => {
  selectedDate.value = addMonths(selectedDate.value, amount);
};

const calendarDates = computed(() => {
  const monthStart = startOfMonth(selectedDate.value);
  const monthEnd = endOfMonth(selectedDate.value);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 1 = Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
});

const hasEvent = (date: Date) => {
  return (
    events.value?.some(
      (event: CelePlannerEvent) =>
        format(event.eventDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    ) || false
  );
};

const isSelectedDate = (date: Date) => {
  return (
    format(date, "yyyy-MM-dd") === format(selectedDate.value, "yyyy-MM-dd")
  );
};
</script>

<template>
  <h1>Calendar View</h1>
  <section class="mx-4 my-4">
    <div class="flex items-center justify-between">
      <Button @click="onUpdateMonth(-1)"><</Button>
      <h2 class="text-xl font-bold">
        {{ monthName }} {{ selectedDate.getFullYear() }}
      </h2>
      <Button @click="onUpdateMonth(1)">></Button>
    </div>

    <div class="mt-4">
      <div class="grid grid-cols-7 mb-4">
        <span
          class="text-center"
          v-for="day in ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']"
          :key="day">
          {{ day }}
        </span>
      </div>
      <div class="grid grid-cols-7 gap-x-1 gap-y-3">
        <div
          v-for="date in calendarDates"
          :key="date.toISOString()"
          @click="selectedDate = date"
          class="p-2 text-center border rounded-md text-sm cursor-pointer relative"
          :class="{
            'bg-gray-100 text-gray-400':
              date.getMonth() !== selectedDate.getMonth(),
            'bg-blue-100 font-semibold':
              date.getMonth() === selectedDate.getMonth() &&
              !isSelectedDate(date),
            'bg-blue-500 text-white font-bold border-2 border-blue-700':
              isSelectedDate(date),
            'ring-2 ring-green-400': hasEvent(date) && !isSelectedDate(date),
            'ring-2 ring-green-300': hasEvent(date) && isSelectedDate(date),
          }">
          {{ date.getDate() }}
          <div
            v-if="hasEvent(date)"
            class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"
            :class="{ 'bg-green-300': isSelectedDate(date) }"></div>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-xl font-bold">
        {{ format(selectedDate, "EEEE dd MMMM yyyy", { locale: it }) }}
      </h2>
      <div
        v-for="event in events?.filter(
          (event: CelePlannerEvent) => event.eventDate.toISOString() === selectedDate.toISOString()
        )"
        :key="event.event_id">
        {{ event.title }}
      </div>
    </div>
  </section>
</template>
