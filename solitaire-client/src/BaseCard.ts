import { DraggableObject } from "./DraggableObject";
import * as PIXI from "pixi.js";
import { CARD_SCALE } from "./constans";

export abstract class BaseCard extends DraggableObject {
  constructor() {
    super();
  }

  getCardBack() {
    const backTexture = PIXI.Texture.from("assets/back.png");
    const back = new PIXI.Sprite(backTexture);
    back.scale.set(CARD_SCALE - 0.01);
    back.position.set(1.2, 0)
    back.anchor.set(0.5);
    return back;
  }
}
