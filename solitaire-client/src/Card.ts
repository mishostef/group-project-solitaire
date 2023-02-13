import * as PIXI from "pixi.js";
import { Container, DisplayObject, Sprite } from "pixi.js";
import {
  cardMap,
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
  public faceUp: boolean = false;

  constructor(public face: Face, public suit: Suits) {
    super();

    // if (face !== null && suit !== null && suit !== Suits.null &&  face !== undefined && suit !== undefined) {
    //   this.changeFaceAndSuit(face, suit, 0, 0)
    // } else {
    //   this.back = this.getCardBack();
    //   this.addChild(this.back);
    //   this.showBack();
    //    //this.isValid = false;

    // }


    if (face == null || suit == null || suit == Suits.null) {
      this.face = "A"
      this.suit = Suits.clubs;
      this.isValid = false;
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
  //}
}

  placeCardReverse(x: number, y: number) {
    this.position.set(x, y);
    if (!this.isPlaced) {
      app.stage.addChild(this);
      this.isPlaced = true;
    }
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

  showFace(duration = 0.3, cb?: Function) {
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

  changeFaceAndSuit(newFace, newSuit, x, y) {
    this.face = newFace;
    this.suit = newSuit;

    const s = typeof newSuit == "string" ? Suits[newSuit] : newSuit;

    this.front = this.map[`${cardMap[newFace]}${s}`];
    console.log("TESTTTT", this.map[`${newFace}${s}`])
    //this.front = this.map[`${this.face}${Suits[this.suit]}`];
    //this.front = this.map[`${this.face}${this.suit}`] as PIXI.Sprite;
    console.log("Front", this.front)
    console.log("Face and Suit", `${this.face}${this.suit}`)
    this.front.anchor.set(0.5);
    this.front.position.set(x, y);
    this.frontMask = this.getMask();
    this.front.mask = this.frontMask;
    this.addChild(this.frontMask);
    app.stage.addChild(this.front);
  }
}