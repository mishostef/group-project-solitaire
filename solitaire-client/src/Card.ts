import * as PIXI from "pixi.js";
import { Container, DisplayObject } from "pixi.js";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH, Face, Suits } from "./constans";
import { createDeckAssets } from "./utils";
import { gsap } from "gsap";
import { DraggableObject } from "./DraggableObject";
import { BaseCard } from "./BaseCard";

export class Card extends BaseCard {
  private back: DisplayObject;
  private front: DisplayObject;
  private app: PIXI.Application;
  private isPlaced = false;
  private frontMask: any;

  constructor(public face: Face, public suit: Suits, app) {
    super();
    this.face = face;
    this.suit = suit;
    this.app = app;
    this.front = createDeckAssets()[`${face}${Suits[suit]}`];

    this.frontMask = this.getMask();
    this.frontMask.position.set(this.x, this.y);
    this.addChild(this.frontMask);
    this.front.mask = this.frontMask;

    this.back = this.getCardBack();
    this.addChild(this.front);
    this.addChild(this.back);
  }

  placeCardReverse(x: number, y: number) {
    this.position.set(x, y);
    if (!this.isPlaced) {
      this.app.stage.addChild(this);
      this.isPlaced = true;
    }
    this.flip();
  }

  placeCard(x: number, y: number) {
    this.position.set(x, y);
    this.removeChild(this.back);
    if (!this.isPlaced) {
      this.app.stage.addChild(this);
      this.isPlaced = true;
    }
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

  flip() {
    const duration = 0.07;
    const tl = gsap.timeline();
    this.front.alpha = 0;
    gsap.set(this.front, { pixi: { skewY: 90 } });
    this.back.interactive = true;
    this.back.on("pointertap", () => {
      tl.to(this.back, { pixi: { skewY: -90 }, duration });
      tl.to(this.front, {
        pixi: { skewY: 0, alpha: 1 },
        duration,
      });
    });
  }
}
