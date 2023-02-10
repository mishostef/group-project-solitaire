import { app } from "./app";
import { BaseCardContainer } from "./BaseCardContainer";
import { Card } from "./Card";
import { CardContainer } from "./CardContainer";
import { Suits, CARD_SCALE } from "./constants";

export class StockZone1 {
  stock: BaseCardContainer;
  /// waste: BaseCardContainer;
  countCreateStockContainer = 1;

  constructor(cards: Card[]) {
    this.stock = new CardContainer(77);
    this.stock.X = 100;
    this.stock.Y = 100;
    this.stock.addCards(cards);
  }
}
