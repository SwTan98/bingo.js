<script setup lang="ts">
const props = defineProps<{
  title: string;
  isSelected: boolean;
}>();
</script>

<template>
  <div
    class="flex items-center justify-center aspect-square border border-gray-300 rounded-lg transition-all transform hover:scale-95 touch-none select-none"
    :class="{
      'bg-primary-500 text-white': props.isSelected,
      'bg-white text-black': !props.isSelected,
    }"
  >
    <div>
      <h2 class="text-xs">{{ props.title }}</h2>
    </div>
  </div>
</template>
