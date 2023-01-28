import * as PIXI from "pixi.js";
import { Container, DisplayObject } from "pixi.js";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH, Face, Suits } from "./constans";
import { createDeckAssets } from "./utils";
import { gsap } from "gsap";

export class Card extends Container {
  public back: DisplayObject;
  public front: DisplayObject;
  private app: PIXI.Application;
  private dragging = false;
  constructor(public face: Face, public suit: Suits, app) {
    super();
    this.face = face;
    this.suit = suit;
    this.app = app;
    this.front = createDeckAssets()[`${face}${Suits[suit]}`];
    this.back = this.getCardBack();
    this.interactive = true;
    this.front.on("mouseup", (e) => {
      console.log("Picked up");
      this.dragging = false;
    });
    this.front.on("mousemove", (e) => {
      console.log("Dragging");
      console.log(this.dragging);
      if (this.dragging) {
        const s = this.placeCard.bind(this);
        s(e.globalX, e.globalY);
      }
    });
    this.front.on("mousedown", (e) => {
      console.log("Picked up");
      this.dragging = true;
    });
  }

  getCardBack() {
    const backTexture = PIXI.Texture.from("assets/back.png");
    const back = new PIXI.Sprite(backTexture);
    back.scale.set(CARD_SCALE);
    back.anchor.set(0.5);
    return back;
  }

  placeCardReverse(x: number, y: number) {
    this.app.stage.addChild(this.front);
    this.app.stage.addChild(this.back);
    this.setCardPosition(x, y);
    this.back.position.set(x, y);
    this.flip();
  }

  placeCard(x: number, y: number) {
    this.app.stage.addChild(this.front);
    this.setCardPosition(x, y);
    this.front.interactive = true;
  }

  private setCardPosition(x: number, y: number) {
    this.front.position.set(x, y);
    ///todo- mask as prop

    // const mask = this.getMask();
    // this.app.stage.addChild(mask);
    // this.front.mask = mask;
    // mask.position.set(x, y);
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
