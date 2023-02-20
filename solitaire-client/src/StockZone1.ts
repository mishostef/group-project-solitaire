import { BaseCardContainer } from "./cardContainers/BaseCardContainer";
import { Card } from "./Card";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { StockCardContainer } from "./cardContainers/StockCardContainer";
import { createCardContainer } from "./Game";
import { randomIntFromInterval } from "./utils";

export class StockZone1 extends BaseCardContainer {
  countCreateStockContainer = 1;
  stockCard: PIXI.Sprite;
  private cb: Function;
  waste: StockCardContainer;
  private canClick = true;

  constructor(cb: Function, card: PIXI.Sprite) {
    super(0);
    this.X = 100;
    this.Y = 100;
    this.waste = createCardContainer("StockCardContainer", 0);
    this.waste.X = 200;
    this.waste.Y = 100;
    this.cb = cb;
    this.stockCard = card;
    this.stockCard.interactive = true;
    this.stockCard.on("pointertap", () => this.createStockContainer());
  }

  createStockContainer() {
    if (this.canClick) {
      const move = {
        action: "flip",
        source: "stock",
        index: 23,
        target: null,
      };
      this.cb(move);
    }
  }

  returnCardsToStock() {
    this.staticContainer.removeChildren();
    this.cards = [];
    this.waste.cards.forEach((card, index) => {
      const tl = gsap.timeline();
      tl.fromTo(
        card,
        {
          pixi: { x: 100 },
        },
        { pixi: { x: -100 }, duration: 2, onStart: () => card.showBack() }
      );
    });
    this.waste.cards = [];
  }

  public moveCardsToWaste() {
    let index = 0;
    this.canClick = false;
    while (index < this.staticContainer.children.length) {
      const card = this.staticContainer.children[index] as Card;
      const duration = 0.5;

      const tl = gsap.timeline();
      tl.to(card, {
        pixi: { x: "+=100" },
        duration,
        onStart: () => card.showFace(0.5),
        onComplete: this.onComplete.bind(this),
      });
      index++;
    }
  }

  onComplete() {
    this.canClick = true;
    const next = this.staticContainer.children[0] as Card;
    if (
      this.waste.cards.length &&
      this.waste.cards[this.waste.cards.length - 1].zIndex >= next.zIndex
    ) {
      next.zIndex = this.waste.cards[this.waste.cards.length - 1].zIndex + 1;
    } else {
      next.zIndex = this.waste.cards.length + 1;
    }
    if (!this.waste.cards.includes(next)) {
      this.waste.addCards([next as Card]);
      next.zIndex = this.waste.cards.length + 1;
      this.waste.flip();
    }
    this.waste.staticContainer.sortChildren();
  }

  public shuffle() {
    const dividing = randomIntFromInterval(1, this.cards.length);
    const right = this.cards.filter((c, i) => i >= dividing);
    const tl = gsap.timeline();
    for (let i = 0; i < right.length; i++) {
      const r = right[right.length - 1 - i];
      tl.to(r, {
        pixi: { x: "+=100" },
        duration: 0.1,
      });

      tl.to(r, { pixi: { skewY: "-=180", x: "-=100" }, duration: 0.1 });
    }
  }
}
