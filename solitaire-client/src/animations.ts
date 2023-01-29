import { DisplayObject } from "pixi.js";
import { gsap } from "gsap";

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
