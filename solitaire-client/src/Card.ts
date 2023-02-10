import * as PIXI from "pixi.js";
import { Container, DisplayObject, Sprite } from "pixi.js";
import {
  CANVAS_WIDTH,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
  Face,
  Suits,
} from "./constants";
import { createDeckAssets, flipCardSound } from "./utils";
import { gsap } from "gsap";
import { app } from "./app";

export class Card extends Container {
  private back: DisplayObject;
  public front: Sprite | null;
  private isPlaced = false;
  private frontMask: any;
  public isBack = true;
  public movedFromStock = false;
  private map = createDeckAssets();
  public isValid = true;

  constructor(public face: Face, public suit: Suits) {
    super();

    console.log(this.map);
    if (face == null || suit == null || suit == Suits.null) {
      this.face = "A"; //"10", Suits.spades
      this.suit = Suits.clubs;
    } else {
      this.face = face;
      this.suit = suit;
    }
    console.log(`${this.face}${Suits[this.suit]}`);
    this.front = this.map[`${this.face}${Suits[this.suit]}`] as PIXI.Sprite;
    this.front.anchor.set(0.5);
    this.frontMask = this.getMask();
    this.addChild(this.frontMask);
    this.front.mask = this.frontMask;
    this.addChild(this.front);
    this.back = this.getCardBack();
    this.addChild(this.back);
  }

  placeCardReverse(x: number, y: number) {
    this.position.set(x, y);
    if (!this.isPlaced) {
      app.stage.addChild(this);
      this.isPlaced = true;
    }
    //flipCardSound.play();
  }

  placeCard(x: number, y: number) {
    this.position.set(x, y);
    this.removeChild(this.back);
    if (!this.isPlaced) {
      app.stage.addChild(this);
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
    //flipCardSound.play();

    const duration = 0.3;
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

  showFace(duration = 0.3, cb?: Function) {
    //flipCardSound.play();
    if (this.isBack) {
      const tl = gsap.timeline();
      this.front.alpha = 0;
      gsap.set(this.front, { pixi: { skewY: 90 } });
      tl.to(this.back, { pixi: { skewY: -90 }, duration });
      tl.to(this.front, {
        pixi: { skewY: 0, alpha: 1 },
        duration,
      }).then(() => {
        if (cb) {
          cb();
        }
      });
      this.isBack = false;
    }
  }

  showBack(duration = 0.3) {
    flipCardSound.play();

    if (!this.isBack) {
      const tl = gsap.timeline();
      this.back.alpha = 0;
      gsap.set(this.back, { pixi: { skewY: 90 } });
      tl.to(this.front, { pixi: { skewY: -90 }, duration }); //
      tl.to(this.back, {
        pixi: { skewY: 0, alpha: 1 },
        duration,
      });
      this.isBack = true;
    }
  }
  getCardBack() {
    const backTexture = PIXI.Texture.from("assets/back.png");
    const back = new PIXI.Sprite(backTexture);
    back.scale.set(CARD_SCALE - 0.01);
    back.position.set(1.2, 0);
    back.anchor.set(0.5);
    return back;
  }

  changeFaceAndSuit(newFace: Face, newSuit: Suits, x, y) {
    this.face = newFace;
    this.suit = newSuit;
    this.front = this.map[`${newFace}${Suits[newSuit]}`];
    this.front.anchor.set(0.5);
    this.front.position.set(x, y);
    this.frontMask = this.getMask();
    this.front.mask = this.frontMask;
    this.addChild(this.frontMask);
    app.stage.addChild(this.front);
  }
}
