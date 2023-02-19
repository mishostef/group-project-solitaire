import { Container, FederatedPointerEvent } from "pixi.js";
import { Card } from "../Card";
import { CardContainer } from "./CardContainer";

export class StockCardContainer extends CardContainer {
  constructor(public rowNumber: number) {
    super(rowNumber);
    this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
  }

  public addCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.zIndex = this.staticContainer.children.length + 1;
      console.log("card.zIndex", card.zIndex);
      this.cards.push(card);
      this.staticContainer.addChild(card);
      card.position.set(0, 0);
    }
  }

  protected handleMouseDown(e: FederatedPointerEvent) {
    if (this.draggableContainer == null) {
      this.draggableContainer = new Container();
    }
    const card = this.cards[this.cards.length - 1];
    this.draggableContainer.removeChildren();
    this.draggableContainer.addChild(this.cards[this.cards.length - 1]);
    card.position.set(0, 0);
  }
}
