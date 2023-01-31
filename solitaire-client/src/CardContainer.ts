import { Container, DisplayObject, Sprite } from "pixi.js";
import { Card } from "./Card";
import { gsap } from "gsap";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_WIDTH,
} from "./constants";
import { DraggableObject } from "./DraggableObject";
import { app } from "./app";

export class CardContainer {
  cards: Card[];
  draggableContainer: Container;
  dragging = false;
  constructor(rowNumber: number, cards) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.draggableContainer = new Container();

    this.draggableContainer.position.set(
      (CANVAS_WIDTH * rowNumber) / 7,
      CANVAS_HEIGHT * 0.5
    );
    //all but the last one are reversed
    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      console.log("x=", card.x, "y=", card.y);
      this.draggableContainer.addChild(card);
      card.pivot.set(CARD_WIDTH / 2, 10 * i + CARD_HEIGHT / 2);
      card.position.set(0, 20 * i);
    }

    const lastCard = cards[cards.length - 1];

    this.draggableContainer.addChild(lastCard);
    // lastCard.position.set(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);
    // lastCard.pivot.set(0);
    lastCard.position.set(0, 20 * cards.length);
    lastCard.pivot.set(CARD_WIDTH / 2, 10 * cards.length + CARD_HEIGHT / 2);
    lastCard.showface();

    console.log(this.cards);
    console.log(this.draggableContainer.children);

    this.addEvents(cards);
  }
  private addEvents(cards: any) {
    this.draggableContainer.interactive = true;
    this.draggableContainer.on("mousedown", (e) => {
      this.dragging = true;
    });
    this.draggableContainer.on("mouseup", (e) => {
      this.dragging = false;
    });
    this.draggableContainer.on("globalmousemove", (e) => {
      let { x, y } = this.limitXY(e.globalX, e.globalY);
      if (this.isCursorInContainer(x, y)) {
        const index = ((y - this.draggableContainer.y) / 20) | 0;
        console.log("index", index);
        const cardsToMove = this.cards.slice(index);
        this.draggableContainer.removeChildren();
        this.draggableContainer.addChild(...cardsToMove);
        this.draggableContainer.position.set(x, y);
        console.log(cards);
      }
    });
  }

  private isCursorInContainer(x, y) {
    return (
      x <= this.draggableContainer.x + CARD_WIDTH / 2 &&
      x >= this.draggableContainer.x - CARD_WIDTH / 2 &&
      y <= this.draggableContainer.y + 21 * this.cards.length &&
      y >= this.draggableContainer.y
    );
  }
  private limitXY(x: number, y: number) {
    if (x > app.view.width) {
      x = app.view.width - CARD_WIDTH;
    }
    if (x < 0) {
      x = CARD_WIDTH;
    }
    if (y > app.view.height) {
      y = app.view.height - app.view.width;
    }
    if (y < 0) {
      y = app.view.width;
    }
    return { x, y };
  }
}
