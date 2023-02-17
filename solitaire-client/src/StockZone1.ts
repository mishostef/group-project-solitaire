import { app } from "../src/app";
import { BaseCardContainer } from "./BaseCardContainer";
import { Card } from "../src/Card";
import { CardContainer } from "./CardContainer";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { CARD_SCALE } from "../src/constants";

export class StockZone1 extends BaseCardContainer {
  countCreateStockContainer = 1;
  public waste: CardContainer;
  stockCard: PIXI.Sprite;
  private cb: Function;
  constructor(cards: Card[], waste: CardContainer, cb: Function) {
    super(0);
    this.X = 100;
    this.Y = 100;
    this.addCards(cards);
    this.waste = waste;
    this.cb = cb;
  }

  addEvents() {
    this.staticContainer.interactive = true;
    this.staticContainer.on("pointertap", () => this.createStockContainer());
  }
  createStockContainer() {
    this.moveCardsToWaste();
    const move = {
      ////for flipping in stock zone
      action: "flip",
      source:"stock",
      index: 23,
      target: null,
    };
    this.cb(move);

    console.log(this.cards)
  }

  returnCardsToStock() {
    let index = 1;
    const card = this.waste.cards.shift();
    this.addCards([card]);
    const tl = gsap.timeline();
    tl.fromTo(
      card,
      {
        pixi: { x: 100 },
      },
      { pixi: { x: 0 }, duration: 2, onStart: () => card.showBack() }
    );

    card.zIndex = index;
    index++;
  }

  moveCardsToWaste() {
    let index = 1;
    while (this.cards.length) {
      const card = this.cards.shift();
      card.zIndex = index;
      const duration = 0.5;
      const tl = gsap.timeline();
      tl.to(card, {
        pixi: { x: "+=100" },
        duration,
        onStart: () => card.showFace(0.5),
        onComplete: () => {
          console.log("this.staticContainer:", this.staticContainer);
          console.log("this.waste", this.waste);
          this.waste.addCards([card]);
          if (this.staticContainer.children.length <= 0) {
            this.returnCardsToStock();
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
