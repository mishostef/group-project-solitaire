import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./Game";
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

export function loadFoundationsEmptyCards() {
  const foundations = { heart: 600, spade: 700, diamond: 800, club: 900 };
  Object.keys(foundations).forEach((key) => {
    const texture = PIXI.Texture.from(`assets/${key}.png`);
    const symbol = new PIXI.Sprite(texture);
    symbol.scale.set(CARD_SCALE - 0.01);
    symbol.position.set(foundations[key], 100);
    symbol.anchor.set(0.5);
    app.stage.addChild(symbol);
  });
}

export function loadStockEmptyCard() {
  const emptyCardTexture = PIXI.Texture.from("assets/emptyCard.png");
  const emptyCard = new PIXI.Sprite(emptyCardTexture);
  emptyCard.scale.set(CARD_SCALE - 0.01);
  emptyCard.position.set(200, 100);
  emptyCard.anchor.set(0.5);
  emptyCard.zIndex = -1;
  app.stage.addChild(emptyCard);
}
