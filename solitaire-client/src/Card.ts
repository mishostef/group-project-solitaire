import * as PIXI from "pixi.js";
import { Container, DisplayObject } from "pixi.js";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH, Face, Suits } from "./constans";
import { createBox, turnCard } from "./utils";
import { createDeckAssets } from "./app";

export class Card extends Container {
  public back: DisplayObject;
  public front: DisplayObject;
  private app: PIXI.Application;
  constructor(public face: Face, public suit: Suits, app) {
    super();
    this.face = face;
    this.suit = suit;
    this.app = app;
    this.front = createDeckAssets()[`${face}${Suits[suit]}`];
    this.back = this.getCardBack();
  }

  getCardBack() {
    const backTexture = PIXI.Texture.from("assets/back.png");
    const back = new PIXI.Sprite(backTexture);
    back.scale.set(CARD_SCALE);
    back.anchor.set(0.5);
    return back;
  }

  placeCard(x: number, y: number) {
    this.app.stage.addChild(this.front);
    this.app.stage.addChild(this.back);
    this.front.position.set(x, y);
    this.back.position.set(x, y);
    const mask = this.getMask();
    this.app.stage.addChild(mask);
    this.front.mask = mask;
    mask.position.set(x, y);
    turnCard(this.front, this.back);
  }

  private getMask() {
    const mask = new PIXI.Graphics();
    mask.beginFill(0);
    mask.drawRoundedRect(
      5 - (CARD_WIDTH - 8) / 2,
      5 - (CARD_HEIGHT - 5) / 2,
      CARD_WIDTH - 8,
      CARD_HEIGHT - 5,
      45
    );
    mask.endFill();
    mask.scale.set(CARD_SCALE);
    return mask;
  }
}
