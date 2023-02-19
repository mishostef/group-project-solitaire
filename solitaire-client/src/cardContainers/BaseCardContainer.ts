import { Container } from "pixi.js";
import { Card } from "../Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "../constants";

const CARD_OFFSET = (CARD_HEIGHT * CARD_SCALE) / 4;
export class BaseCardContainer {
  cards: Card[];
  draggableContainer: Container;
  staticContainer: Container;
  dragging = false;
  private containersInitialX: number;
  private containersInitialY: number;
  public draggableLength = 0;
  public isReturningCards = true;

  constructor(public rowNumber: number) {
    this.cards = [];
    this.draggableContainer = new Container();
    this.staticContainer = new Container();
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

  protected addEvents() {
    this.draggableContainer.interactive = true;
    this.staticContainer.interactive = true;
    this.draggableContainer.on("mouseup", this.handleMouseUp.bind(this));
    this.draggableContainer.on("mousedown", () => {
      this.dragging = true;
    });
    this.draggableContainer.on(
      "globalmousemove",
      this.handleMouseMove.bind(this)
    );
  }

  protected handleMouseUp(e) {
    this.dragging = false;
    if (this.draggableLength != 0) {
      this.returnDraggableContainer();
    }
  }
  public returnDraggableContainer() {
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
      card.position.set(0, 0);
    }
  }
  public removeCardFromContainer(card: Card) {
    this.cards.pop();
    this.staticContainer.removeChild(card);
  }

  public merge(target: BaseCardContainer) {
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

  public isOverlapping(target: BaseCardContainer) {
    return (
      this.draggableContainer.position.x >=
        target.X - (CARD_WIDTH * CARD_SCALE) / 2 &&
      this.draggableContainer.position.x <=
        target.X + (CARD_WIDTH * CARD_SCALE) / 2 &&
      this.draggableContainer.position.y >=
        target.Y - (CANVAS_HEIGHT * CARD_SCALE) / 2
    );
  }
  get X() {
    return this.containersInitialX;
  }
  set X(newX: number) {
    this.containersInitialX = newX;
    this.staticContainer.x = newX;
    this.draggableContainer.x = newX;
  }
  get Y() {
    return this.containersInitialY;
  }
  set Y(newY: number) {
    this.containersInitialY = newY;
    this.staticContainer.y = newY;
    this.draggableContainer.y = newY;
  }

  flip() {
    const lastCard = this.staticContainer.children[
      this.staticContainer.children.length - 1
    ] as Card;
    lastCard.showFace();
  }
}
