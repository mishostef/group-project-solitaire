import { Container, FederatedPointerEvent } from "pixi.js";
import { Card } from "../Card";
import {
  CARD_HEIGHT,
  CARD_SCALE,
} from "../constants";

import { BaseCardContainer } from "./BaseCardContainer";
const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;

export class CardContainer extends BaseCardContainer {
  public cb: Function;

  constructor(public rowNumber: number) {
    super(rowNumber);
    this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
  }
  handleMouseUp(e) {
    this.cb && this.cb(this);
    this.dragging = false;
  }

  public addCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      this.cards.push(card);
      this.staticContainer.addChild(card);
      card.position.set(0, (this.cards.length - 1) * CARD_OFFSET);
    }
  }
  protected handleMouseDown(e: FederatedPointerEvent) {
    if (this.draggableContainer == null) {
      this.draggableContainer = new Container();
    }
    let index = this.getIndex(e);
    this.dragging = true;
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
