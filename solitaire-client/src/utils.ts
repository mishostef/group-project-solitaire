import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { DisplayObject } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export function transformTo(back: PIXI.Graphics, front: PIXI.Graphics) {
  const tl = gsap.timeline();
  tl.to(back, { pixi: { alpha: 0 }, duration: 3 });
  tl.to(
    front,
    {
      pixi: {
        alpha: 1,
      },
      duration: 5,
    },
    "<"
  );
}

export function turnCard(back: PIXI.Graphics, front: PIXI.Graphics) {
  const tl = gsap.timeline();
  back.alpha = 0;
  gsap.set(back, { pixi: { skewY: 90 } });
  front.interactive = true;
  front.on("pointertap", () => {
    tl.to(front, { pixi: { skewY: -90 }, duration: 0.05 });
    tl.to(back, {
      pixi: { skewY: 0, alpha: 1 },
      duration: 0.05,
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
