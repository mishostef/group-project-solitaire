import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { DisplayObject } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { cards, Suits } from "./constans";
import { sliceDeck } from "./cardsTexture";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export function turnCard(back: DisplayObject, front: DisplayObject) {
  const duration = 0.5;
  const tl = gsap.timeline();
  back.alpha = 0;
  gsap.set(back, { pixi: { skewY: 90 } });
  front.interactive = true;
  front.on("pointertap", () => {
    tl.to(front, { pixi: { skewY: -90 }, duration });
    tl.to(back, {
      pixi: { skewY: 0, alpha: 1 },
      duration,
    });
  });
}

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
  mask.drawRoundedRect(-width / 2, -height / 2, width, height, radius);
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
  const card = new Card("A", Suits.hearts, app);
  clearScreen(app);
  card.placeCard(300, 300);
}
export function createDeckAssets() {
  const map = {};
  const x = 47;
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
