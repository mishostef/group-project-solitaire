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
  public containersInitialX: number;
  public containersInitialY: number;
  public draggableLength = 0;
  public isReturningCards = true;

  constructor(public rowNumber: number) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = [];
    this.draggableContainer = new Container();
    this.staticContainer = new Container();
    app.stage.addChild(this.staticContainer);
    app.stage.addChild(this.draggableContainer);
    this.containersInitialX = (CANVAS_WIDTH * rowNumber) / 8;
    this.containersInitialY = 400;
    this.draggableContainer.position.set(
      this.containersInitialX,
      this.containersInitialY
    );
    this.staticContainer.position.set(
      this.containersInitialX,
      this.containersInitialY
    );
    this.addEvents();
  }

  private addEvents() {
    this.draggableContainer.interactive = true;
    this.staticContainer.interactive = true;
    this.staticContainer.on("mousedown", this.handleMouseDown.bind(this));
    this.draggableContainer.on("mouseup", () => {
      this.dragging = false;
      if (this.draggableLength != 0) {
        this.draggableContainer.position.set(
          this.staticContainer.x,
          this.staticContainer.y
        );
        const x = this.cards.splice(
          this.cards.length - this.draggableLength,
          this.draggableLength
        );
        this.addCards(x);
      }
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
    if (this.draggableContainer == null) {
      this.draggableContainer = new Container();
    }
    const deltaY =
      e.globalY - (this.staticContainer.y - (CARD_HEIGHT * CARD_SCALE) / 2);
    let index = Math.floor(deltaY / CARD_OFFSET);

    if (index > this.cards.length - 1) {
      index = this.cards.length - 1;
    }
    this.dragging = true;
    this.cards.forEach((card, i) => {
      if (i >= index) {
        this.draggableContainer.addChild(card);
        card.position.set(0, (i - index) * CARD_OFFSET);
      }
      this.draggableLength = this.draggableContainer.children.length;
    });
  }

  private handleMouseMove(e) {
    let [x, y] = [e.globalX, e.globalY];
    if (this.dragging) {
      this.draggableContainer.position.set(x, y);
    }
  }
  public addCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      this.cards.push(card);
      this.staticContainer.addChild(card);
      card.position.set(0, (this.cards.length - 1) * CARD_OFFSET);
    }
  }

  public removeCardFromContainer(card: Card) {
    this.cards.pop();
    this.staticContainer.removeChild(card);
  }

  public merge(target: CardContainer) {
    const cardsToMove = this.draggableContainer.children;

    const draggedCards = this.cards.splice(
      this.cards.length - cardsToMove.length,
      cardsToMove.length
    );
    target.addCards(draggedCards);
    this.dragging = false;
    this.draggableContainer.position.set(
      this.staticContainer.x,
      this.staticContainer.y
    );
    this.draggableLength = 0;
  }

  public isOverlapping(target: CardContainer) {
    return (
      this.draggableContainer.position.x >=
        target.staticContainer.position.x - (CARD_WIDTH * CARD_SCALE) / 2 &&
      this.draggableContainer.position.x <=
        target.staticContainer.position.x + (CARD_WIDTH * CARD_SCALE) / 2
    );
  }
}
