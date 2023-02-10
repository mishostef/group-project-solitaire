import { app } from "./app";
import { Card } from "./Card";
import { CardContainer } from "./CardContainer";
import { Suits, CARD_SCALE } from "./constants";

export class StockZone {
  stock: CardContainer;
  waste: CardContainer;
  countCreateStockContainer = 0;

  constructor(cards: Card[]) {
    this.stock = new CardContainer(0);
    this.stock.containersInitialX = 100;
    this.stock.containersInitialY = 100;
  }
}
