import { Container, DisplayObject } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone extends Container {
  cardDeck: Card[];
  dragging: boolean = false;
  current: Card = null;
  movable: Container;
  constructor(cards: Card[]) {
    super();
    this.cardDeck = cards;
    this.interactive = true;
    this.position.set(500, 500);
    this.movable = new Container();
    this.cardDeck.forEach((card, i) => {
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.addChild(card);
      console.log("i=", i);
      card.zIndex = i;
    });
    app.stage.addChild(this);
    this.addClickHandler();
  }

  private addClickHandler() {
    let i = 0;
    let prev: Card = null;
    this.on("pointertap", async (e) => {
      this.dragging = false;
      if (i == this.cardDeck.length) {
        await this.rewind(prev);
        i = 0;
        prev = null;
        return;
      }
      const current = this.cardDeck.shift();
      this.addDragEvents(current);
      if (prev) {
        current.zIndex = prev.zIndex + 1;
      }
      this.move(current);
      i++;
      prev = current;
      this.cardDeck.push(current);
      this.sortChildren();
    });
  }

  addDragEvents(card: Card) {
    card.on("globalmousemove", (e) => {
      if (this.dragging) {
        console.log(card.position);
        console.log(card.getGlobalPosition().x - card.x);
        console.log(card.getGlobalPosition().y - card.y);
        card.position.set(
          e.globalX - 500 + CARD_WIDTH / 2,
          e.globalY - 500 + CARD_HEIGHT / 2
        ); //500,500
      }
    });
    this.on("mouseup", function (e) {
      this.dragging = false;
    });
    this.on("mousedown", (e) => {
      this.dragging = true;
    });
  }
  async move(card: Card) {
    const duration = 0.5;
    const tl = gsap.timeline();
    await tl.to(card, { pixi: { x: "+=100" }, duration });
    card && card.showFace();
  }

  async rewind(card: Card) {
    const others = this.cardDeck.filter((x) => x !== card);
    const duration = 3;
    const tl = gsap.timeline();
    tl.set(others, { pixi: { x: "-=100" } });
    const prev = this.cardDeck[this.cardDeck.indexOf(card) - 1];
    prev && prev.showBack(0);
    await tl.to(card, { pixi: { x: "-=100" }, duration });
    card && card.showBack();
  }
}
