export interface IBaseCard {
  face: number | null;
  suit: "clubs" | "spades" | "hearts" | "diamonds" | null;
}

export interface ICard extends IBaseCard {
  faceUp: boolean;
}

export interface IStock extends ICard {
  movedFromStock: boolean;
}
export interface IState {
  piles: { cards: ICard[] };
  stock: { cards: IStock[] };
  waste: { cards: ICard[] };
  foundations: IFoundations;
}

export interface IMoves {
  piles: IPileMove[];
}
export interface IPileMove {
  flip: boolean;
  place: boolean;
  take: number[];
}

export interface IFoundations {
  clubs: { cards: ICard[] };
  diamonds: { cards: ICard[] };
  hearts: { cards: ICard[] };
  spades: { cards: ICard[] };
}

export type ZoneType = "stock" | "waste" | "foundations" | "piles";
