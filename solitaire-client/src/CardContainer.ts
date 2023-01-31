import { Container } from "pixi.js";
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

  constructor(public rowNumber: number, crds) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = crds;
    this.draggableContainer = new Container();
    this.draggableContainer.pivot.set(
      this.draggableContainer.width / 2,
      this.draggableContainer.height / 2
    );
    this.draggableContainer.position.set(
      (CANVAS_WIDTH * rowNumber) / 7,
      CANVAS_HEIGHT * 0.5
    );
    //all but the last one are reversed

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.draggableContainer.addChild(card);
      card.position.set(0, 40 * i);
    }
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.showface();
    this.addEvents(this.cards);
  }

  private addEvents(cards: any) {
    let startx = -1;
    let startY = -1;
    this.draggableContainer.interactive = true;
    this.draggableContainer.on("mousedown", (e) => {
      this.dragging = true;
      startx = e.globalX;
      startY = e.globalY;
    });
    this.draggableContainer.on("mouseup", (e) => {
      this.dragging = false;
      let startx = -1;
      let startY = -1;
    });
    this.draggableContainer.on("globalmousemove", (e) => {
      let [x, y] = [e.globalX, e.globalY];
      console.log("x=", x, "y=", y);
      if (this.dragging) {
        const deltaY = y - this.draggableContainer.y;
        console.log(this.draggableContainer.position);
        console.log(this.draggableContainer.getGlobalPosition());

        console.log("deltaY=", deltaY);
        const index = 1;
        console.log("index", index);
        const cardsToMove = this.cards;

        cardsToMove.forEach((card, i) => {
          card.pivot.set(
            this.draggableContainer.x,
            this.draggableContainer.y - i * 40
          );
          card.position.set(e.globalX, e.globalY);
        });
        console.log(cardsToMove);
        console.log(cards);
      }
    });
  }

  private isCursorInContainer(x, y) {
    return (
      x <= this.draggableContainer.x + CARD_WIDTH / 2 &&
      x >= this.draggableContainer.x - CARD_WIDTH / 2 &&
      y <=
        this.draggableContainer.y +
          40 * this.cards.length -
          1 +
          CANVAS_HEIGHT / 2 &&
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
