import { Container } from "pixi.js";
import { Card } from "./Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "./constants";
import { app } from "./app";
const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;
export class CardContainer {
  cards: Card[];
  draggableContainer: Container;
  staticContainer: Container;
  dragging = false;

  constructor(public rowNumber: number, cards) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.draggableContainer = new Container();
    this.staticContainer = new Container();
    app.stage.addChild(this.draggableContainer);
    app.stage.addChild(this.staticContainer); ///
    this.draggableContainer.pivot.set(
      this.draggableContainer.width / 2,
      this.draggableContainer.height / 2
    );
    const containersInitialX = (CANVAS_WIDTH * rowNumber) / 7;
    const containersInitialY = CANVAS_HEIGHT * 0.5;
    this.draggableContainer.position.set(
      containersInitialX,
      containersInitialY
    );
    this.staticContainer.position.set(containersInitialX, containersInitialY);
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.staticContainer.addChild(card);
      card.position.set(0, CARD_OFFSET * i);
    }
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.showface();
    this.addEvents(lastCard);
  }

  private addEvents(cards: any) {
    this.draggableContainer.interactive = true;
    this.staticContainer.interactive = true;
    this.staticContainer.on("mousedown", (e) => {
      const containerTopY =
        this.staticContainer.position.y -
        CARD_HEIGHT / 2 -
        (CARD_SCALE * CARD_HEIGHT) / 2;
      const deltaY = e.globalY - containerTopY;
      const index = Math.floor(deltaY / CARD_OFFSET);
      this.dragging = true;
      this.cards.forEach((card, i) => {
        if (i >= index) {
          this.draggableContainer.addChild(card);
        }
      });
    });
    this.draggableContainer.on("mouseup", (e) => {
      this.dragging = false;
    });
    this.draggableContainer.on("mousedown", () => {
      this.dragging = true;
    });
    this.draggableContainer.on("globalmousemove", (e) => {
      let [x, y] = [e.globalX, e.globalY];

      if (this.dragging) {
        this.draggableContainer.position.set(
          x + CARD_WIDTH / 2,
          y +
            CARD_HEIGHT / 2 -
            (CARD_SCALE * CARD_HEIGHT) / 2 - //
            (this.draggableContainer.children.length * CARD_OFFSET) / 2
        );
        this.draggableContainer.children.forEach((card, i) => {
          this.draggableContainer.addChild(card);
        });
      }
    });
  }
  public addCards(newCards: Card[]) {
    newCards.forEach((newCard, i) => {
      this.cards.push(newCard);
      this.staticContainer.addChild(newCard);
      newCard.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      newCard.position.set(
        0,
        CARD_OFFSET * (this.staticContainer.children.length - 1 + i)
      );
      newCard.showface();
    });
  }
}
