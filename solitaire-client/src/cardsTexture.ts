import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const spritesheet = PIXI.BaseTexture.from("assets/22331.jpg");

function sliceCard(x: number, y: number, w: number, h: number) {
  const cardTexture = new PIXI.Texture(
    spritesheet,
    new PIXI.Rectangle(x, y, w, h)
  );
  const card = new PIXI.Sprite(cardTexture);
  card.anchor.set(0.5);
  card.scale.set(CARD_SCALE);
  return card;
}

export function sliceDeck(arr, x: number, y: number, row) {
  for (let i = 0; i < 13; i++) {
    const card = sliceCard(
      x + i * CARD_WIDTH + i * 48 + i / 2,
      y,
      CARD_WIDTH,
      CARD_HEIGHT
    );

    arr.push(card);
  }

  return arr;
}
