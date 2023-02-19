import { app } from "./app";
import { BaseCardContainer } from "./cardContainers/BaseCardContainer";
import { Card } from "./Card";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { CARD_SCALE } from "./constants";
import { StockCardContainer } from "./cardContainers/StockCardContainer";

export class StockZone1 extends BaseCardContainer {
  countCreateStockContainer = 1;
  stockCard: PIXI.Sprite;
  private cb: Function;
  waste: StockCardContainer;
  private canClick = true;

  constructor(cb: Function) {
    super(0);
    this.X = 100;
    this.Y = 100;
    this.waste = new StockCardContainer(0);
    this.waste.X = 200;
    this.waste.Y = 100;
    this.cb = cb;
  }

  addEvents() {
    this.loadRepeatCard();
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
      card.zIndex = index;
    });
    this.waste.cards = [];
  }

  public moveCardsToWaste() {
    let index = 0;
    this.canClick = false;
    while (index < this.staticContainer.children.length) {
      const card = this.staticContainer.children[index] as Card;
      card.zIndex = index + 1; ///
      const duration = 0.5;

      const tl = gsap.timeline();
      tl.to(card, {
        pixi: { x: "+=100" },
        duration,
        onStart: () => card.showFace(0.5),
        onComplete: () => {
          this.canClick = true;
          console.log("this.staticContainer:", this.staticContainer);
          console.log("this.waste", this.waste);
          if (this.staticContainer.children.length > 0) {
            const next = this.staticContainer.children[0] as Card;
            if (!this.waste.cards.includes(next)) {
              this.waste.addCards([next as Card]);
              this.waste.flip();
            }
            this.waste.staticContainer.sortChildren();
          }
        },
      });
      index++;
    }
  }
  loadRepeatCard() {
    const repeatTexture = PIXI.Texture.from("assets/repeat.png");
    this.stockCard = new PIXI.Sprite(repeatTexture);
    this.stockCard.scale.set(CARD_SCALE);
    this.stockCard.position.set(0, 100);
    this.stockCard.anchor.set(0.5);
    this.stockCard.zIndex = -1;
    app.stage.addChild(this.stockCard);
  }
}
