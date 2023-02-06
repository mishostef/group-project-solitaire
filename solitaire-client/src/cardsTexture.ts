import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./app";
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
    
  const heartTexture = PIXI.Texture.from("assets/heart.png");
  const heart = new PIXI.Sprite(heartTexture);
  heart.scale.set(CARD_SCALE - 0.01);
  heart.position.set(600, 100)
  heart.anchor.set(0.5);
  app.stage.addChild(heart);
  
  const spadeTexture = PIXI.Texture.from("assets/spade.png");
  const spade= new PIXI.Sprite(spadeTexture);
  spade.scale.set(CARD_SCALE - 0.01);
  spade.position.set(700, 100)
  spade.anchor.set(0.5);
  app.stage.addChild(spade);

  const diamondTexture = PIXI.Texture.from("assets/diamond.png");
  const diamond = new PIXI.Sprite(diamondTexture);
  diamond.scale.set(CARD_SCALE - 0.01);
  diamond.position.set(800, 100)
  diamond.anchor.set(0.5);
  app.stage.addChild(diamond);
  
  const clubTexture = PIXI.Texture.from("assets/club.png");
  const club = new PIXI.Sprite(clubTexture);
  club.scale.set(CARD_SCALE - 0.01);
  club.position.set(900, 100)
  club.anchor.set(0.5);
  app.stage.addChild(club);
  
}


export function loadStockEmptyCard() {
  const emptyCardTexture = PIXI.Texture.from("assets/emptyCard.png");
  const emptyCard = new PIXI.Sprite(emptyCardTexture);
  emptyCard.scale.set(CARD_SCALE - 0.01);
  emptyCard.position.set(200, 100)
  emptyCard.anchor.set(0.5);
  emptyCard.zIndex = -1;
  app.stage.addChild(emptyCard);

}