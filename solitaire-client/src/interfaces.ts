export interface ICard {
  face: number;
  suit: "clubs" | "spades" | "hearts" | "diamonds" | null;
  faceUp: boolean;
}
export interface IState {
  piles: { cards: ICard[] };
}
export interface IMoves {
  piles: IPileMove[];
}
export interface IPileMove {
  flip: boolean;
  place: boolean;//
  take: number[];//card indices from this column that can be taken
}
