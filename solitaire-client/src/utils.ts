import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { DisplayObject } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { Suits } from "./constans";

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
  clearScreen(app);
  const front = createBox(300, 300, 0xa777aa, 50, 100);
  const back = createBox(300, 300, 0xe777e, 50, 100);
  // const masked = createBox(300, 500, 0xaa55555, 100, 100);

  // const mask = getMask(300, 500, 5);
  // app.stage.addChild(mask);

  // masked.mask = mask;
  // app.stage.addChild(masked);
  const card = new Card(400, 400, "A", Suits.hearts);
  app.stage.addChild(front);
  app.stage.addChild(back);
  turnCard(back, front);
}
