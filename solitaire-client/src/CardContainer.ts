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

export class CardContainer {
  cards: Card[];
  draggableContainer: Container;
  constructor(rowNumber: number, cards) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.draggableContainer = new Container();

    this.draggableContainer.position.set(
      (CANVAS_WIDTH * rowNumber) / 7,
      CANVAS_HEIGHT * 0.2
    );
    //all but the last one are reversed
    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      console.log("x=", card.x, "y=", card.y);
      this.draggableContainer.addChild(card);
      card.position.set(0, 20 * i);
    }

    const lastCard = cards[cards.length - 1];
    this.draggableContainer.addChild(lastCard);
    lastCard.position.set(0, 20 * cards.length);
    lastCard.showface();

    console.log(this.cards);
    console.log(this.draggableContainer.children);

    this.draggableContainer.interactive = true;
    //add
    this.draggableContainer.on("globalmousemove", (e) => {
      console.log("yes");
      console.log(e.target);
      const [x, y] = [e.globalX, e.globalY];
      if (
        x <= this.draggableContainer.x + CARD_WIDTH / 2 &&
        x >= this.draggableContainer.x - CARD_WIDTH / 2 &&
        y <= this.draggableContainer.y + 21 * cards.length &&
        y >= this.draggableContainer.y
      ) {
        const index = ((y - this.draggableContainer.y) / 20) | 0;
        console.log("index", index);
        const cardsToMove = this.cards.slice(index);
        this.draggableContainer.removeChildren();
        this.draggableContainer.addChild(...cardsToMove);
        this.draggableContainer.position.set(x, y);
      }
    });

  }
}
