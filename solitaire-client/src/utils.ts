import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { Card } from "./Card";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  cardMap,
  cardsFaces,
  CARD_SCALE,
  foundationsMap,
  Suits,
} from "./constants";
import { sliceDeck } from "./cardsTexture";
import { CardContainer } from "./cardContainers/CardContainer";
import { Container } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const flipCardSound = new Audio("/assets/flipCard.mp3");

export function createDeckAssets() {
  const map = {};
  const x = 47;
  let y = 847;
  let row = 50;
  ["clubs", "hearts", "spades", "diamonds"].forEach((suit) => {
    sliceDeck([], x, y, row).forEach((asset, i) => {
      map[`${cardsFaces[i]}${suit}`] = asset;
    });
    y += 660;
    row += 150;
  });

  return map;
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
  const foundationsLastCards = getFoundationLastCards(foundations);
  const pilesLastCards = getPilesLastCards(piles);
  const isEmptyPileAvailable = piles.some((p) => p.cards.length == 0);

  for (let i = 0; i < potentialCards.length; i++) {
    const foundationsMovePossible = isFoundationsMovePossible(
      foundationsLastCards,
      potentialCards,
      i
    );
    if (isEmptyPileAvailable) {
      const pilesContainK = getPilesContainingK(piles);
      if (potentialCards[i].face === "K" || pilesContainK) return false;
    }
    if (foundationsMovePossible) {
      return false;
    }
    const pileMovePossible = isPileMovePossible(
      pilesLastCards,
      potentialCards,
      i
    );
    if (pileMovePossible) {
      return false;
    }
  }
  return true;
}

function getPilesContainingK(piles: CardContainer[]) {
  return piles.some(
    (pile) =>
      pile.rowNumber > 0 &&
      pile.cards.some((card, i) => card.face && card.face == "K" && i !== 0)
  );
}

function isPileMovePossible(
  pilesLastCards: Card[],
  potentialCards: Card[],
  i: number
) {
  return pilesLastCards.some((plc) => {
    const sequential =
      cardsFaces[plc.face] - cardsFaces[potentialCards[i].face] === 1;
    const differentColor = isDifferentColor(plc, potentialCards[i]);
    return sequential && differentColor;
  });
}

function isFoundationsMovePossible(
  foundationsLastCards: Card[],
  potentialCards: Card[],
  i: number
) {
  return foundationsLastCards.some((flc) => {
    const sameColor = !isDifferentColor(potentialCards[i], flc);
    const sequential =
      cardsFaces[potentialCards[i].face] - cardsFaces[flc.face] === 1;
    return sameColor && sequential;
  });
}

function getPilesLastCards(piles: CardContainer[]) {
  return piles
    .map((p) => p.cards[p.cards.length - 1])
    .filter((x) => x !== undefined);
}

function getFoundationLastCards(foundations: CardContainer[]) {
  return foundations
    .map((f) => f.cards[f.cards.length - 1])
    .filter((x) => x !== undefined);
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

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
