import { Container, FederatedPointerEvent } from "pixi.js";
import { Card } from "../src/Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "../src/constants";
import { app } from "../src/app";
import { BaseCardContainer } from "./BaseCardContainer";
const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;
export class CardContainer extends BaseCardContainer {
  cards: Card[];
  draggableContainer: Container;
  staticContainer: Container;
  dragging = false;
  public draggableLength = 0;
  public isReturningCards = true;

  constructor(public rowNumber: number) {
    super(rowNumber);
   // this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
  }
  public addCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      this.cards.push(card);
      this.staticContainer.addChild(card);
      card.position.set(0, (this.cards.length - 1) * CARD_OFFSET);
    }
  }
  
  private handleMouseDown(e: FederatedPointerEvent) {
    if (this.draggableContainer == null) {
      this.draggableContainer = new Container();
    }
    let index = this.getIndex(e);
   
    this.cards.forEach((card, i) => {
      if (i >= index) {
        this.draggableContainer.addChild(card);
        card.position.set(0, (i - index) * CARD_OFFSET);
      }
      this.draggableLength = this.draggableContainer.children.length;
    });
  }

  private getIndex(e: FederatedPointerEvent) {
    const deltaY =
      e.globalY - (this.staticContainer.y - (CARD_HEIGHT * CARD_SCALE) / 2);
    let index = Math.floor(deltaY / CARD_OFFSET);

    if (index > this.cards.length - 1) {
      index = this.cards.length - 1;
    }
    return index;
  }
}
