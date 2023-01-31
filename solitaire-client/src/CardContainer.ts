import { DisplayObject, Sprite } from "pixi.js";
import { BaseCard } from "./BaseCard";
import { Card } from "./Card";
import { gsap } from "gsap";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { DraggableObject } from "./DraggableObject";

export class CardContainer {
  cards: Card[];
  draggableContainer: DraggableObject;
  constructor(rowNumber: number, cards) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.draggableContainer = new DraggableObject();
    this.draggableContainer.position.set(
      (CANVAS_WIDTH * rowNumber) / 7,
      CANVAS_HEIGHT * 0.2
    );
    //all but the last one are reversed
    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      console.log("x=", card.x, "y=", card.y);
      this.draggableContainer.addChild(card);
      card.placeCardReverse(
        this.draggableContainer.x,
        this.draggableContainer.y + 20 * i
      );
    }

    const lastCard = cards[cards.length - 1];
    this.draggableContainer.addChild(lastCard);
    lastCard.placeCard(
      this.draggableContainer.x,
      this.draggableContainer.y + 20 * cards.length
    );

    console.log(this.cards);
    console.log(this.draggableContainer.children);
  }
}
