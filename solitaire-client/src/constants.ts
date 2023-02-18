//diamonds (♦), clubs (♣), hearts (♥) and spades (♠)

export const CARD_WIDTH = 410;
export const CARD_HEIGHT = 620;
export const CARD_SCALE = 0.2;
export const CANVAS_WIDTH = 1800;
export const CANVAS_HEIGHT = 1800;

export const foundationsMap = {
  "-600": "hearts",
  "-700": "spades",
  "-800": "diamonds",
  "-900": "clubs",
  "0": "stock",
};

export enum Suits {
  diamonds,
  clubs,
  hearts,
  spades,
  null,
}

export const cardsConstants = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  null,
];
export type Face =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | null;

export const cardMap = {
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: null,
};

export const cardsFaces = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  null,
];
