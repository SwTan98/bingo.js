<script setup lang="ts">
import { CARDS_KEY, GRID_SIZE, PHRASES, SEED_KEY } from "~/lib/constants";
import { generateSeed, loadItem, saveItem, shuffle } from "~/lib/utils";
import type { Card } from "~/models/Card";

const seed = ref<string>();
const cards = ref<Card[]>();
const isUpdating = ref<Boolean>(false);

const createAndShuffleCards = (seed: string): Card[] => {
  const newCards = PHRASES.map((title) => ({
    title,
    isSelected: false,
  })).slice(0, GRID_SIZE ** 2);
  return shuffle(newCards, seed);
};

const toggleCard = (index: number) => {
  console.log(index);
  if (!cards.value) return;
  const wasSelected = cards.value[index].isSelected;
  cards.value[index].isSelected = !wasSelected;
};

const reset = () => {
  if (!seed.value) return;
  const confirmed = confirm("RESET bingo sheet?");
  if (!confirmed) return;
  cards.value = createAndShuffleCards(seed.value);
};

const updateSeed = () => {
  const value = prompt(
    "Updating seed RESETS your progress (Leave blank for random seed)."
  );
  if (value === null) return;
  isUpdating.value = true;
  seed.value = value || generateSeed();
};

onMounted(() => {
  seed.value = loadItem(SEED_KEY);
  cards.value = loadItem(CARDS_KEY);

  if (seed.value) return;
  const value = prompt(
    "Please enter a seed to start (Leave blank for random seed)."
  );
  seed.value = value || generateSeed();
});

watchEffect(() => {
  if (!cards.value) return;
  saveItem(CARDS_KEY, cards.value);
});

watchEffect(() => {
  if (!seed.value) return;
  saveItem(SEED_KEY, seed.value);
  if (!cards.value || isUpdating.value) {
    cards.value = createAndShuffleCards(seed.value);
    isUpdating.value = false;
  }
});
</script>

<template>
  <MoleculesGrid :cards="cards" @toggle="toggleCard" />
  <div class="flex gap-4 justify-between">
    <AtomsButton
      class="bg-red-500 dark:bg-red-900 text-slate-50"
      text="Reset"
      @click="reset"
    />
    <AtomsButton
      class="bg-primary-500 dark:bg-primary-900 text-slate-50"
      text="Update Seed"
      @click="updateSeed"
    />
  </div>
  <span class="text-xs text-center">Seed: {{ seed }}</span>
</template>
