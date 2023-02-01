import { Container } from "pixi.js";
import { Card } from "./Card";
import { gsap } from "gsap";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "./constants";
import { DraggableObject } from "./DraggableObject";
import { app } from "./app";
const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;
export class CardContainer {
  cards: Card[];
  draggableContainer: Container;
  dragging = false;

  constructor(public rowNumber: number, crds) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = crds;
    this.draggableContainer = new Container();
    this.draggableContainer.pivot.set(
      this.draggableContainer.width / 2,
      this.draggableContainer.height / 2
    );
    this.draggableContainer.position.set(
      (CANVAS_WIDTH * rowNumber) / 7,
      CANVAS_HEIGHT * 0.5
    );
    //all but the last one are reversed
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.draggableContainer.addChild(card);
      card.position.set(0, CARD_OFFSET * i);
    }
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.showface();
    this.addEvents(this.cards);
  }

  private addEvents(cards: any) {
    this.draggableContainer.interactive = true;
    let index = -1;
    this.draggableContainer.on("mousedown", (e) => {
      console.log(e.globalY);
      const target = e.target;
      index = this.cards.lastIndexOf(target as Card);
      this.dragging = true;
    });
    this.draggableContainer.on("mouseup", (e) => {
      this.dragging = false;
    });
    this.draggableContainer.on("globalmousemove", (e) => {
      let [x, y] = [e.globalX, e.globalY];
      if (this.dragging) {
        //  this.draggableContainer.position.set(e.globalX, e.globalY);
        // this.draggableContainer.removeChildren();
        this.cards.forEach((card, i) => {
          if (i >= index) {
            this.draggableContainer.addChild(card);
            card.pivot.set(
              this.draggableContainer.x,
              this.draggableContainer.y - i * CARD_OFFSET
            );
            card.position.set(e.globalX, e.globalY);
          }
        });
        console.log(cards);
      }
    });
  }
  public addCards(newCards: Card[]) {
    newCards.forEach((newCard, i) => {
      this.cards.push(newCard);
      this.draggableContainer.addChild(newCard);
      newCard.position.set(
        0,
        CARD_OFFSET * this.draggableContainer.children.length
      );
      newCard.showface();
    });
  }
}
