import { DisplayObject, Sprite } from "pixi.js";
import { BaseCard } from "./BaseCard";
import { Card } from "./Card";
import { gsap } from "gsap";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constans";
import { DraggableObject } from "./DraggableObject";

export class CardContainer extends BaseCard {
  cards: Card[];
  dragg:DraggableObject//otvorenite
  constructor(rowNumber: number, cards) {
    super();
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.position.set(CANVAS_WIDTH / (rowNumber - 1), CANVAS_HEIGHT * 0.2);
    //all but the last one are reversed
    for (let i = 0; i < rowNumber - 1; i++) {
      const card = cards[i];
      card.placeCardReverse(this.x, this.y + 20 * i);
      console.log("x=", card.x, "y=", card.y);
      this.addChild(card);
    }
    const lastCard = cards[cards.length - 1];
    lastCard.placeCard()
    console.log(this.cards);
    console.log(this.children);
  }
}
