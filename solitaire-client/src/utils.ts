import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./app";
import { Card } from "./Card";
import { CANVAS_HEIGHT, CANVAS_WIDTH, cards, Suits } from "./constans";
import { sliceDeck } from "./cardsTexture";
import { CardContainer } from "./CardContainer";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

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
  mask.drawRoundedRect(2.5 - width / 2, 2.5 - height / 2, width, height, radius);
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

export function test() {
  const card = new Card("K", Suits.clubs);
  //clearScreen(app);
  card.placeCardReverse(120, 300);

  const card4 = new Card("K", Suits.clubs);
  card4.placeCardReverse(120, 330);


  const card2 = new Card("K", Suits.hearts);
  card2.placeCard(350, 300);
  const card3 = new Card("K", Suits.spades);
  card3.placeCard(600, 300);

  // gsap.to(card2, { pixi: { skewX: 30, x: "+=50",  }, duration: 2 });
  // gsap.to(card2, { pixi: { skewY: 30, x: "+=50",  }, duration: 2 });
  // card2.pivot.set(-50,100);
  // gsap.to(card2, { pixi: { rotation: 360  }, duration: 2 });
}

export function createDeckAssets() {
  const map = {};
  const x = 45;
  let y = 847;
  let row = 50;
  ["clubs", "hearts", "spades", "diamonds"].forEach((suit) => {
    sliceDeck([], x, y, row).forEach((asset, i) => {
      map[`${cards[i]}${suit}`] = asset;
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
