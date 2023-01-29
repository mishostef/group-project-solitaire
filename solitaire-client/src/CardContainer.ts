import { DisplayObject, Sprite } from "pixi.js";
import { BaseCard } from "./BaseCard";
import { Card } from "./Card";
import { gsap } from "gsap";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constans";

export class CardContainer extends BaseCard {
  cardsOpen: Card[];
  cardsClosed: Sprite[];
  constructor(rowNumber: number) {
    super();
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.position.set(CANVAS_WIDTH / (rowNumber - 1), CANVAS_HEIGHT * 0.2);
    for (let i = 0; i < rowNumber; i++) {
      const card = this.getCardBack();
      card.position.set(this.x, this.y + 20 * i);
      console.log("x=", card.x, "y=", card.y);
      this.addChild(card);
    }

    console.log(this.cardsClosed);
    console.log(this.children);
  }
}
