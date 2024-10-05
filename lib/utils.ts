import type { Card } from "~/models/Card";
import { createShuffle } from "fast-shuffle";
import Prando from "prando";

const MIN = 100000000;
const MAX = 999999999;

export const shuffle = (array: Card[], seed: string | number): Card[] => {
  const numberSeed = new Prando(seed).nextInt(MIN, MAX);
  const shuffle = createShuffle(numberSeed);
  return shuffle(array);
};
