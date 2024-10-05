<script setup lang="ts">
// Define the bingo grid size and create a reactive array for the cards
const GRID_SIZE = 5; // 5x5 grid
const cards = ref(
  Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
    title: `Card ${i + 1}`,
    isSelected: false,
  }))
);

// Function to toggle card selection
const toggleCard = (index: number) => {
  const wasSelected = cards.value[index].isSelected;
  cards.value[index].isSelected = !wasSelected;
  if (wasSelected) return;
  checkForBingo(index);
};

// Function to check for bingo based on the affected card
const checkForBingo = (index: number) => {
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
</script>

<template>
  <div :class="`grid grid-cols-5 gap-2 md:gap-8`">
    <AtomsCard
      v-for="(card, index) in cards"
      :key="index"
      :title="card.title"
      :isSelected="card.isSelected"
      @click="toggleCard(index)"
    />
  </div>
</template>
