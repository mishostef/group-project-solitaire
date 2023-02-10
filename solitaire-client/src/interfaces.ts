export interface ICard {
  face: number;
  suit: "clubs" | "spades" | "hearts" | "diamonds" | null;
  faceUp: boolean;
}
export interface IStock {
  piles: { cards: ICard[] };
}