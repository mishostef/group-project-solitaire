import * as PIXI from "pixi.js";
import { CARD_SCALE } from "./constants";

export function loadRepeatCard(app) {
  const repeatTexture = PIXI.Texture.from("assets/repeat.png");
  const stockCard = new PIXI.Sprite(repeatTexture);
  stockCard.scale.set(CARD_SCALE);
  stockCard.position.set(0, 100);
  stockCard.anchor.set(0.5);
  stockCard.zIndex = -1;
  app.stage.addChild(stockCard);
  return stockCard;
}

export function createContainer(app) {}
