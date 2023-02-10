import { Container } from "pixi.js";
import { Card } from "./Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "./constants";
import { app } from "./app";
import { BaseCardContainer } from "./BaseCardContainer";
const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;
export class CardContainer extends BaseCardContainer {
  cards: Card[];
  draggableContainer: Container;
  staticContainer: Container;
  dragging = false;
  public containersInitialX: number;
  public containersInitialY: number;
  public draggableLength = 0;
  public isReturningCards = true;

  constructor(public rowNumber: number) {
    super(rowNumber);
    this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
  }

  private handleMouseDown(e) {
    if (this.draggableContainer == null) {
      this.draggableContainer = new Container();
    }
    const deltaY =
      e.globalY - (this.staticContainer.y - (CARD_HEIGHT * CARD_SCALE) / 2);
    let index = Math.floor(deltaY / CARD_OFFSET);

    if (index > this.cards.length - 1) {
      index = this.cards.length - 1;
    }
    this.dragging = true;
    this.cards.forEach((card, i) => {
      if (i >= index) {
        this.draggableContainer.addChild(card);
        card.position.set(0, (i - index) * CARD_OFFSET);
      }
      this.draggableLength = this.draggableContainer.children.length;
    });
  }
}
