import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";

import { app } from "./app";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constans";

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
  // app.stage.addChild(card);
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
    // const back = backCard();
    // card.position.set(20 + i * 100, row);

    // back.position.set(20 + i * 100, row);

    arr.push(card);

    // const mask = new PIXI.Graphics();
    // mask.beginFill(0);
    // // mask.drawRoundedRect(5, 5, CARD_WIDTH - 8, CARD_HEIGHT - 5, 45);
    // mask.drawRoundedRect(
    //   5 - (CARD_WIDTH - 8) / 2,
    //   5 - (CARD_HEIGHT - 5) / 2,
    //   CARD_WIDTH - 8,
    //   CARD_HEIGHT - 5,
    //   45
    // );
    // mask.endFill();
    // mask.scale.set(CARD_SCALE);

    // card.mask = mask;

    // app.stage.addChild(mask);

    // mask.position.set(card.x, card.y);

    // turnCard(card, back);
  }

  return arr;
}

//backCard()
// export function backCard() {
//   const cardTexture = PIXI.Texture.from("assets/back.png");
//   const card = new PIXI.Sprite(cardTexture);
//   card.scale.set(CARD_SCALE);
//   card.anchor.set(0.5); //
//   app.stage.addChild(card);
//   return card;
// }
