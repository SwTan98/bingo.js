<script setup lang="ts">
import { useDraggable, type UseDraggableReturn } from "vue-draggable-plus";
import { CARDS_KEY, GRID_SIZE, PHRASES, SEED_KEY } from "~/lib/constants";
import { generateSeed, loadItem, saveItem, shuffle } from "~/lib/utils";
import type { Card } from "~/models/Card";

const seed = ref<string>();
const cards = ref<Card[]>();
const draggable = ref<UseDraggableReturn>();
const isUpdating = ref<Boolean>(false);
const isReordering = ref<Boolean>(false);

// Draggable
const el = ref<HTMLElement | null>(null);

const createAndShuffleCards = (seed: string): Card[] => {
  const newCards = PHRASES.map((title) => ({
    title,
    isSelected: false,
  })).slice(0, GRID_SIZE ** 2);
  return shuffle(newCards, seed);
};

const toggleCard = (index: number) => {
  if (isReordering.value) return;
  if (!cards.value) return;
  const wasSelected = cards.value[index].isSelected;
  cards.value[index].isSelected = !wasSelected;
};

const reset = () => {
  cards.value = cards.value?.map((card) => ({
    ...card,
    isSelected: false,
  }));
};

const onReset = () => {
  if (!seed.value) return;
  const confirmed = confirm("RESET bingo sheet?");
  if (!confirmed) return;
  save();
  reset();
};

const updateSeed = () => {
  const value = prompt(
    "Updating seed RESETS your progress (Leave blank for random seed)."
  );
  if (value === null) return;
  save();
  isUpdating.value = true;
  seed.value = value || generateSeed();
};

const reorder = () => {
  const confirmed = confirm("Reordering RESETS your progress.");
  if (!confirmed) return;

  isReordering.value = true;
  reset();
  draggable.value?.resume();
};

const save = () => {
  draggable.value?.pause();
  isReordering.value = false;
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

watch(
  cards,
  () => {
    draggable.value = useDraggable(el, cards, {
      animation: 150,
      disabled: true,
      ghostClass: "!bg-blue-500",
      chosenClass: "!bg-blue-400",
    });
  },
  { once: true }
);

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
  <MoleculesGrid ref="el" :cards="cards" @toggle="toggleCard" />
  <AtomsButton
    :class="[
      'bg-slate-500 dark:bg-slate-900 text-slate-50 grow-0',
      isReordering && '!bg-primary-800',
    ]"
    :text="isReordering ? 'Done' : 'Reorder'"
    @click="isReordering ? save() : reorder()"
  />
  <div class="flex gap-4 justify-between">
    <AtomsButton
      class="bg-red-500 dark:bg-red-900 text-slate-50"
      text="Reset"
      @click="onReset"
    />
    <AtomsButton
      class="bg-primary-500 dark:bg-primary-900 text-slate-50"
      text="Update Seed"
      @click="updateSeed"
    />
  </div>
  <span class="text-xs text-center">Seed: {{ seed }}</span>
</template>
