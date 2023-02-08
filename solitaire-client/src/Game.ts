import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IStock } from "./interfaces";
import { StockZone } from "./StockZone";

export class Game {
  foundations: Foundations[];
  stockZone: StockZone;
  piles: CardContainer[];

  constructor(stock: IStock) {
    for (let i = 0; i < 7; i++) {
      const currentPileInfo = stock.piles[i];
      this.piles[i] = new CardContainer(i + 1);
      
    }
  }
}
