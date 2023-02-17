import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./app";
import { Card } from "./Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  cardMap,
  cardsConstants,
  Suits,
} from "./constants";
import { sliceDeck } from "./cardsTexture";
import { Container } from "pixi.js";
import { Foundations } from "./FoundationsZone";
import { StockZone } from "./StockZone";
import { CardContainer } from "./CardContainer";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const flipCardSound = new Audio("/assets/flipCard.mp3");

export function createBox(
  x: number,
  y: number,
  color = 0xffffff,
  width = 100,
  height = 100
) {
  const box = new PIXI.Graphics();
  box.beginFill(color);
  box.drawRect(0, 0, width, height);
  box.endFill();
  box.position.set(x, y);
  box.pivot.set(width / 2, height / 2);
  return box;
}
export function createCircle(x, y, radius, color) {
  const circle = new PIXI.Graphics();
  circle.beginFill(color);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  circle.position.set(x, y);
  return circle;
}

export function getMask(x, y, radius) {
  const mask = new PIXI.Graphics();
  mask.beginFill(0xffffff);
  const width = 100;
  const height = 100;
  mask.drawRoundedRect(
    2.5 - width / 2,
    2.5 - height / 2,
    width,
    height,
    radius
  );
  mask.endFill();
  mask.pivot.set(0, 0);
  mask.position.set(x, y);
  return mask;
}

export function clearScreen(app) {
  for (var i = app.stage.children.length - 1; i >= 0; i--) {
    app.stage.removeChild(app.stage.children[i]);
  }
}



export function createDeckAssets() {
  const map = {};
  const x = 47;
  let y = 847;
  let row = 50;
  ["clubs", "hearts", "spades", "diamonds"].forEach((suit) => {
    sliceDeck([], x, y, row).forEach((asset, i) => {
      map[`${cardsConstants[i]}${suit}`] = asset;
    });
    y += 660;
    row += 150;
  });

  return map;
}
export function createInteractiveBg() {
  const bg = new PIXI.Graphics();
  bg.beginFill(0);
  bg.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bg.alpha = 0;
  bg.endFill();
  bg.interactive = true;
  return bg;
}
export class InteractiveBackground extends Container {
  bg: PIXI.Graphics;
  dragging: boolean = false;
  constructor() {
    super();
    const card = new Card("K", Suits.hearts);    const card2 = new Card("Q", Suits.hearts);
    const card3 = new Card("A", Suits.clubs);
    const container = new CardContainer(2);

    this.addChild(container.draggableContainer);
    app.stage.addChild(container.draggableContainer);
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0);
    this.bg.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.bg.alpha = 0;
    this.bg.endFill();
    this.bg.interactive = true;
    this.bg.on("mousemove", (e) => {
      if (this.dragging) {
        console.log(`dragging in container`);
      }
    });
    this.bg.on("mouseup", function (e) {
      this.dragging = false;
    });
    this.bg.on("mousedown", (e) => {
      this.dragging = true;
    });
    this.addChild(this.bg);
  }
  addCardContainers() {}
}

export function checkValidColumnCardPosition(
  currentCard: Card,
  previousCard: Card
) {
  const black = [Suits.clubs, Suits.spades];
  const red = [Suits.hearts, Suits.diamonds];
  const differentSuit =
    (black.includes(currentCard.suit) && red.includes(previousCard.suit)) ||
    (red.includes(currentCard.suit) && black.includes(previousCard.suit));
  const sequential =
    cardsConstants.indexOf(currentCard.face) >
    cardsConstants.indexOf(previousCard.face);
  return differentSuit && sequential;
}

export function createCard(cardInfo: any, x:number, y: number) {
  const s = typeof cardInfo.suit == "string" ? Suits[cardInfo.suit] : cardInfo.suit;
  const card = new Card(cardMap[cardInfo.face], s);
  card.position.set(x, y)
return card;
}