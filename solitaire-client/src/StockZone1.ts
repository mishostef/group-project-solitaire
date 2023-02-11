import { app } from "./app";
import { BaseCardContainer } from "./BaseCardContainer";
import { Card } from "./Card";
import { CardContainer } from "./CardContainer";
import { gsap } from "gsap";

export class StockZone1 extends BaseCardContainer {
  countCreateStockContainer = 1;
  public waste: CardContainer;

  constructor(cards: Card[]) {
    super(77);
    this.X = 100;
    this.Y = 100;
    this.addCards(cards);
    this.waste = new CardContainer(77);
    this.waste.X = 200;
    this.waste.Y = 0;
  }

  addEvents() {
    this.staticContainer.interactive = true;
    this.staticContainer.on("pointertap", () => this.createStockContainer());
  }
  createStockContainer() {
    this.moveCardsToWaste();
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
    const index = 1;
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
        // if (this.staticContainer.children.length <= 0) {
        //   this.returnCardsToStock();
        // }
      },
    });
  }
}
