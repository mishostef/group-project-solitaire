import { Container, DisplayObject } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone extends Container {
  cardDeck: Card[];
  constructor(cards: Card[]) {
    super();
    this.cardDeck = cards;
    this.interactive = true;
    this.position.set(500, 500);
    this.cardDeck.forEach((card, i) => {
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.addChild(card);
      console.log("i=", i);
      this.zIndex = i;
    });
    app.stage.addChild(this);
    this.addClickHandler();
  }

  private addClickHandler() {
    let i = 0;
    let prev: DisplayObject = null;
    this.on("pointertap", (e) => {
      if (i > this.cardDeck.length) {
        i = 0;
      }
      const current = this.cardDeck[this.cardDeck.length - i];
      if (prev) {
        current.zIndex = prev.zIndex + 1;
      }
      this.move(current);
      i++;
      prev = current;
      this.sortChildren();
    });
    
  }

  async move(card: Card) {
    const duration = 2;
    const tl = gsap.timeline();
    await tl.to(card, { pixi: { x: "+=100" }, duration });
    card && card.showface();
  }
}
