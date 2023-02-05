import { Container, Point } from "pixi.js";
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
let ex = -100;
let ey = -100;

export class CardContainer {
  cards: Card[];
  draggableContainer: Container;
  staticContainer: Container;
  dragging = false;
  dragWidth = CARD_WIDTH;
  dragHeight = CARD_HEIGHT;
  private containersInitialX: number;
  private containersInitialY: number;

  constructor(public rowNumber: number, cards) {
    this.cards = cards;
    this.draggableContainer = new Container();
    this.staticContainer = new Container();

    app.stage.addChild(this.staticContainer);
    app.stage.addChild(this.draggableContainer);
    this.containersInitialX = (CANVAS_WIDTH * rowNumber) / 7;
    this.containersInitialY = CANVAS_HEIGHT * 0.5;
    for (let i = 0; i < cards.length; i++) {
      const card2 = this.cards[i];
      card2.pivot.set(
        this.staticContainer.x - card2.width / 2,
        (this.staticContainer.y - card2.height / 2)
      );
      card2.position.set(
        this.staticContainer.x,
        this.staticContainer.y + i * CARD_OFFSET
      );
      this.staticContainer.addChild(card2);
    }

    this.staticContainer.position.set(900, 900);
    this.staticContainer.pivot.set(
      this.staticContainer.width / 2,
      this.staticContainer.height / 2
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
    this.draggableContainer.on("mousemove", this.handleMouseMove.bind(this));
  }
  private handleMouseDown(e) {
    const { x: CANVAS_X, y: CANVAS_Y } = app.view.getBoundingClientRect();
    const { x: container_X, y: CONTAINER_Y } = this.staticContainer.getBounds();
    console.log(e.globalY, e.globalY);
    console.log(this.staticContainer.x, this.staticContainer.y);
    var containerTopY = CONTAINER_Y;
    const deltaY = e.globalY - containerTopY;
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
    alert(`index=${index}`);
    ex = e.globalX;
    ey = e.globalY;
  }

  private handleMouseMove(e) {
    const { x: container_X, y: CONTAINER_Y } = this.staticContainer.getBounds();

    let [x, y] = [e.globalX, e.globalY];
    const { width, height } = this.draggableContainer.getBounds();
    console.log("x=", x, "y=", y);
    console.log(container_X, CONTAINER_Y);
    console.log(e.position);
    console.log("width=", width, "height=", height);
    //108.5);
    console.log("pivot is", this.draggableContainer.pivot);
    console.log("position is", this.draggableContainer.position);
    if (this.dragging) {
      this.draggableContainer.x += e.globalX - ex;
      this.draggableContainer.y += e.globalY - ey;
      ex = e.globalX;
      ey = e.globalY;
    }
    console.log(
      "cdscsdc",
      this.draggableContainer.width,
      this.draggableContainer.height
    );
  }

  public async addCards(newCards: Card[]) {
    for (let i = 0; i < 1; i++) {
      const newCard = newCards[i];
      this.cards.push(newCard);
      this.staticContainer.addChild(newCard);
      newCard.pivot.set(CARD_WIDTH / 2, CARD_HEIGHT / 2);
      newCard.position.set(
        0,
        CARD_OFFSET * (this.staticContainer.children.length - 1 + i)
      );
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
