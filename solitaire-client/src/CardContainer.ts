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
  private containersInitialX: number;
  private containersInitialY: number;
  constructor(public rowNumber: number, cards) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = cards;
    this.draggableContainer = new Container();
    this.staticContainer = new Container();
    app.stage.addChild(this.staticContainer); ///
    app.stage.addChild(this.draggableContainer);
    this.draggableContainer.pivot.set(
      this.draggableContainer.width / 2,
      this.draggableContainer.height / 2
    );
    this.containersInitialX = (CANVAS_WIDTH * rowNumber) / 7;
    this.containersInitialY = CANVAS_HEIGHT * 0.5;
    this.draggableContainer.position.set(
      this.containersInitialX,
      this.containersInitialY
    );
    this.staticContainer.position.set(
      this.containersInitialX,
      this.containersInitialY
    );
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      this.staticContainer.addChild(card);
      card.position.set(0, CARD_OFFSET * i);
    }
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.showFace();
    this.addEvents();
  }

  private addEvents() {
    this.draggableContainer.interactive = true;
    this.staticContainer.interactive = true;
    this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
    this.draggableContainer.on("mouseup", () => {
      this.dragging = false;
    });
    this.draggableContainer.on("mousedown", () => {
      this.dragging = true;
    });
    this.draggableContainer.on(
      "globalmousemove",
      this.handleMouseMove.bind(this)
    );
  }
  private handleMouseDown(e) {
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
  }

  private handleMouseMove(e) {
    let [x, y] = [e.globalX, e.globalY];

    if (this.dragging) {
      this.draggableContainer.position.set(
        x + CARD_WIDTH / 2,
        y +
          CARD_HEIGHT / 2 -
          (CARD_SCALE * CARD_HEIGHT) / 2 - //
          (this.draggableContainer.children.length * CARD_OFFSET) / 2
      );
    }
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
      newCard.showFace();
    });
  }

  public returnDraggableContainer() {
    this.draggableContainer.position.set(
      this.containersInitialX,
      this.containersInitialY
    );
  }
}
