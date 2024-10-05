<script setup lang="ts">
const { text } = defineProps<{
  text: string;
}>();
</script>

<template>
  <button type="button" class="grow py-2 px-8 rounded-md">
    {{ text }}
  </button>
</template>
