<script setup lang="ts">
import type { Card } from "~/models/Card";

const { card } = defineProps<{
  card: Card;
}>();
</script>

<template>
  <div
    class="flex items-center justify-center aspect-square rounded-lg drop-shadow transition-all transform hover:scale-95 touch-none select-none"
    :class="{
      'bg-primary-500 text-white': card.isSelected,
      'bg-slate-200 text-black dark:bg-slate-800 dark:text-slate-300':
        !card.isSelected,
    }"
  >
    <div>
      <h2 class="text-xs text-center">{{ card.title }}</h2>
    </div>
  </div>
</template>
