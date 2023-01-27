import * as PIXI from "pixi.js";
import { Container, DisplayObject } from "pixi.js";
import { CARD_HEIGHT, CARD_WIDTH, Face, Suits } from "./constans";
import { createBox, turnCard } from "./utils";
import { app } from "./app";

export class Card extends Container {
  back: DisplayObject;
  front: DisplayObject;
  constructor(x, y, public face: Face, public suit: Suits) {
    super();
    this.face = face;
    this.suit = suit;
    this.front = createBox(x, y, 0x0000ff, CARD_WIDTH / 2, CARD_HEIGHT / 2); ///will be changed
    this.front.scale.set(0.5);
    this.back = createBox(x, y, 0xff0000, CARD_WIDTH / 2, CARD_HEIGHT / 2); ///will be changed
    this.front.scale.set(0.5);
    app.stage.addChild(this.front);
    app.stage.addChild(this.back);
  }
}
