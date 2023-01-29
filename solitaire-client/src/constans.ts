//diamonds (♦), clubs (♣), hearts (♥) and spades (♠)

export const CARD_WIDTH = 410;
export const CARD_HEIGHT = 620;
export const CARD_SCALE = 0.2;
export const CANVAS_WIDTH = 1800;
export const CANVAS_HEIGHT = 1800;

export enum Suits {
  diamonds,
  clubs,
  hearts,
  spades,
}

export const cards = [
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
  | "K";
