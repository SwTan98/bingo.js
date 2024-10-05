<script setup lang="ts">
import { GRID_SIZE, PHRASES, CARDS_KEY, SEED_KEY } from "~/lib/constants";
import { loadItem, saveItem, shuffle } from "~/lib/utils";
import type { Card } from "~/models/Card";

const cards = ref<Card[]>();
const seed = ref<string>();

const createAndShuffleCards = (seed: string): Card[] => {
  const newCards = PHRASES.map((title) => ({
    title,
    isSelected: false,
  })).slice(0, GRID_SIZE ** 2);
  return shuffle(newCards, seed);
};

const toggleCard = (index: number) => {
  if (!cards.value) return;
  const wasSelected = cards.value[index].isSelected;
  cards.value[index].isSelected = !wasSelected;
  if (wasSelected) return;
  checkForBingo(index);
};

const checkForBingo = (index: number) => {
  if (!cards.value) return;
  const selectedCards = cards.value.map((card) => card.isSelected);

  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;

  // Check the affected row
  if (
    selectedCards
      .slice(row * GRID_SIZE, row * GRID_SIZE + GRID_SIZE)
      .every(Boolean)
  ) {
    alert(`Bingo! Row ${row + 1}`);
    return;
  }

  // Check the affected column
  if (
    Array.from(
      { length: GRID_SIZE },
      (_, r) => selectedCards[r * GRID_SIZE + col]
    ).every(Boolean)
  ) {
    alert(`Bingo! Column ${col + 1}`);
    return;
  }

  // Check diagonals if necessary
  if (row === col) {
    // Check top-left to bottom-right diagonal
    if (
      Array.from(
        { length: GRID_SIZE },
        (_, i) => selectedCards[i * GRID_SIZE + i]
      ).every(Boolean)
    ) {
      alert("Bingo! Diagonal from top-left to bottom-right");
      return;
    }
  }

  if (row + col === GRID_SIZE - 1) {
    // Check top-right to bottom-left diagonal
    if (
      Array.from(
        { length: GRID_SIZE },
        (_, i) => selectedCards[(GRID_SIZE - 1 - i) * GRID_SIZE + i]
      ).every(Boolean)
    ) {
      alert("Bingo! Diagonal from top-right to bottom-left");
      return;
    }
  }
};

onMounted(() => {
  const loadedSeed = loadItem(SEED_KEY) ?? "test";
  seed.value = loadedSeed;
  cards.value = loadItem(CARDS_KEY) ?? createAndShuffleCards(loadedSeed);
});

watchEffect(() => {
  if (!cards.value) return;
  saveItem(CARDS_KEY, cards.value);
});

watchEffect(() => {
  if (!seed.value) return;
  saveItem(SEED_KEY, seed.value);
});
</script>

<template>
  <div :class="`grid grid-cols-5 gap-2 md:gap-8`">
    <AtomsCard
      v-for="(card, index) in cards"
      :key="index"
      :card="card"
      @click="toggleCard(index)"
    />
  </div>
</template>
