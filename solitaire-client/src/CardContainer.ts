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
  constructor(public rowNumber: number) {
    if (rowNumber < 1) {
      throw new RangeError("Row must be positive and lower than 8");
    }
    this.cards = [];
    this.draggableContainer = new Container();
    this.staticContainer = new Container();
    app.stage.addChild(this.staticContainer); ///
    app.stage.addChild(this.draggableContainer);
    this.containersInitialX = (CANVAS_WIDTH * rowNumber) / 8;
    this.containersInitialY = CANVAS_HEIGHT * 0.5;
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
    if (!this.draggableContainer) {
      this.draggableContainer = new Container();
    }
    console.log(e.globalX, e.globalY);
    console.log(this.staticContainer.x, this.staticContainer.y);
    console.log(this.staticContainer.children[0]);
    const deltaY = e.globalY - this.staticContainer.y;
    let index = Math.floor(deltaY / CARD_OFFSET);
    if (index > this.cards.length - 1) {
      index = this.cards.length - 1;
    }
    this.dragging = true;
    this.cards.forEach((card, i) => {
      if (i >= index) {
        this.draggableContainer.addChild(card);
      }
    });
    this.draggableContainer.children.forEach((card: Card, i) => {});
  }

  private handleMouseMove(e) {
    let [x, y] = [e.globalX, e.globalY];

    if (this.dragging) {
      const itemsToRemove = this.draggableContainer.children.length;
      this.cards.splice(this.cards.length - itemsToRemove, itemsToRemove);
      this.draggableContainer.pivot.set(
        this.draggableContainer.width / 2,
        this.draggableContainer.height / 2
      );
      this.draggableContainer.position.set(x, y);
    }
  }
  public addCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      this.cards.push(card);
      this.staticContainer.addChild(card);
      card.position.set(0, this.cards.length * CARD_OFFSET);
    }
  }

  public returnDraggableContainer() {
    if (!this.dragging)
      this.draggableContainer.position.set(
        this.containersInitialX,
        this.containersInitialY
      );
  }
}
