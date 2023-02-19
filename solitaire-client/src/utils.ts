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
  cardsFaces,
  foundationsMap,
  Suits,
} from "./constants";
import { sliceDeck } from "./cardsTexture";
import { CardContainer } from "./cardContainers/CardContainer";
import { Container } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const flipCardSound = new Audio("/assets/flipCard.mp3");

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
    const card = new Card("K", Suits.hearts);
    const card2 = new Card("Q", Suits.hearts);
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

export function isDifferentColor(currentCard: Card, previousCard: Card) {
  const black = [Suits.clubs, Suits.spades];
  const red = [Suits.hearts, Suits.diamonds];
  const differentColor =
    (black.includes(currentCard.suit) && red.includes(previousCard.suit)) ||
    (red.includes(currentCard.suit) && black.includes(previousCard.suit));
  return differentColor;
}
export function checkLoseCondition(
  potentialCards: Card[],
  piles: CardContainer[],
  foundations: CardContainer[]
) {
  const foundationsLastCards = foundations
    .map((f) => f.cards[f.cards.length - 1])
    .filter((x) => x !== undefined);
  const pilesLastCards = piles
    .map((p) => p.cards[p.cards.length - 1])
    .filter((x) => x !== undefined);
  const isEmptyPileAvailable = piles.some((p) => p.cards.length == 0);

  for (let i = 0; i < potentialCards.length; i++) {
    const foundationsMovePossible = foundationsLastCards.some((flc) => {
      const sameColor = !isDifferentColor(potentialCards[i], flc);
      const sequential =
        cardsFaces[potentialCards[i].face] - cardsFaces[flc.face] === 1;
      return sameColor && sequential;
    });
    if (isEmptyPileAvailable) {
      const pilesContainK = piles.some(
        (pile) =>
          pile.rowNumber > 1 &&
          pile.cards.some((card) => card.face && card.face == "K")
      );
      if (potentialCards[i].face === "K" || pilesContainK) return false;
    }
    if (foundationsMovePossible) {
      return false;
    }
    const pileMovePossible = pilesLastCards.some((plc) => {
      const sequential =
        cardsFaces[plc.face] - cardsFaces[potentialCards[i].face] === 1;
      const differentColor = isDifferentColor(plc, potentialCards[i]);
      return sequential && differentColor;
    });
    if (pileMovePossible) {
      return false;
    }
  }
  return true;
}

export function getTarget(target: CardContainer) {
  return target && target.rowNumber - 1 >= 0
    ? `pile${target.rowNumber - 1}`
    : foundationsMap[(~~target.rowNumber).toString()];
}

export function getSource(starting: CardContainer) {
  let pileIndex = `pile${starting.rowNumber - 1}`;
  if (starting.rowNumber - 1 < 0) {
    pileIndex = "stock";
  }
  return pileIndex;
}