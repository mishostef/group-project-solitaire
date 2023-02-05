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
    this.AddCrds();
    const lastCard = this.cards[this.cards.length - 1];
    if (lastCard.isBack) {
      lastCard.showFace();
    }

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
    this.draggableContainer.pivot.set(
      this.draggableContainer.width / 2,
      this.draggableContainer.height / 2
    );
  }

  private handleMouseMove(e) {
    let [x, y] = [e.globalX, e.globalY];

    if (this.dragging) {
      this.draggableContainer.position.set(x, y);
    }
  }
  private AddCrds() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.pivot.set(
        this.staticContainer.x - card.width / 2,
        this.staticContainer.y - card.height / 2
      );
      card.position.set(
        this.staticContainer.x,
        this.staticContainer.y + i * CARD_OFFSET
      );
      this.staticContainer.addChild(card);
    }
  }
  public async addCards(newCards: Card[]) {
    for (let i = 0; i < newCards.length; i++) {
      const newCard = newCards[i];
      this.cards.push(newCard);

      newCard.pivot.set(
        this.staticContainer.x - newCard.width / 2,
        this.staticContainer.y - newCard.height / 2
      );
      newCard.position.set(
        this.staticContainer.x,
        this.staticContainer.y +
          CARD_OFFSET * (this.staticContainer.children.length + i)
      );
      this.staticContainer.addChild(newCard);
      newCard.showFace(0);
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
