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
  foundations: { cards: [] };
}

export interface IMoves {
  piles: IPileMove[];
}
export interface IPileMove {
  flip: boolean;
  place: boolean;
  take: number[]; 
}


export type ZoneType = "stock" | "waste" | "foundations" | "piles"