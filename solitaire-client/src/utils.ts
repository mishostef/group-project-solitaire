import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./app";
import { Card } from "./Card";
import { CANVAS_HEIGHT, CANVAS_WIDTH, cardsConstants, Suits } from "./constants";
import { sliceDeck } from "./cardsTexture";
import { CardContainer } from "./CardContainer";
import { DraggableObject } from "./DraggableObject";
import { Container } from "pixi.js";
import { Foundations } from "./FoundationsZone";
import { StockZone } from "./StockZone";




gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const flipCardSound = new Audio('/assets/flipCard.mp3');

export function createBox(
  x: number,
  y: number,
  color = 0xffffff,
  width = 100,
  height = 100
) {
  const box = new PIXI.Graphics();
  box.beginFill(color);
  box.drawRect(0, 0, width, height);
  box.endFill();
  box.position.set(x, y);
  box.pivot.set(width / 2, height / 2);
  return box;
}
export function createCircle(x, y, radius, color) {
  const circle = new PIXI.Graphics();
  circle.beginFill(color);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  circle.position.set(x, y);
  return circle;
}

export function getMask(x, y, radius) {
  const mask = new PIXI.Graphics();
  mask.beginFill(0xffffff);
  const width = 100;
  const height = 100;
  mask.drawRoundedRect(
    2.5 - width / 2,
    2.5 - height / 2,
    width,
    height,
    radius
  );
  mask.endFill();
  mask.pivot.set(0, 0);
  mask.position.set(x, y);
  return mask;
}

export function clearScreen(app) {
  for (var i = app.stage.children.length - 1; i >= 0; i--) {
    app.stage.removeChild(app.stage.children[i]);
  }
}

export function test() {
  
  const card4 = new Card("A", Suits.diamonds);
  card4.placeCard(120, 300);
  
  const card5 = new Card("2", Suits.diamonds);
  card5.placeCard(220, 300);
  
  const card6 = new Card("3", Suits.diamonds);
  card6.placeCard(320, 300);

  const card7 = new Card("4", Suits.diamonds);
  card7.placeCard(420, 300);


  const card8 = new Card("A", Suits.hearts);
  card8.placeCard(620, 300);
  
  const card9 = new Card("2", Suits.hearts);
  card9.placeCard(720, 300);


  const card14 = new Card("5", Suits.diamonds);
  card14.placeCardReverse(0, 0);

  const card15 = new Card("6", Suits.diamonds);
  card15.placeCardReverse(0, 0);

  const card16 = new Card("3", Suits.hearts);
  card16.placeCardReverse(0, 0);

  
  
  
  const diamondsFoundation = new Foundations(Suits.diamonds);
  diamondsFoundation.addCard(card4);
  diamondsFoundation.addCard(card5);
  diamondsFoundation.addCard(card6);
  diamondsFoundation.addCard(card7);
  diamondsFoundation.addCard(card14);
  diamondsFoundation.addCard(card15);
  
  // console.log(diamondsFoundation)
  
  const heartsFoundation = new Foundations(Suits.hearts);
  heartsFoundation.addCard(card8);
  heartsFoundation.addCard(card9);
  heartsFoundation.addCard(card16);
  
  const StockZon = new StockZone([card14, card15, card16]);

  // const container = new CardContainer(2, [card, card2, card3]);
  // app.stage.addChild(container.draggableContainer);

  // gsap.to(card2, { pixi: { skewX: 30, x: "+=50",  }, duration: 2 });
  // gsap.to(card2, { pixi: { skewY: 30, x: "+=50",  }, duration: 2 });
  // card2.pivot.set(-50,100);
  // gsap.to(card2, { pixi: { rotation: 360  }, duration: 2 });
}

export function createDeckAssets() {
  const map = {};
  const x = 47;
  let y = 847;
  let row = 50;
  ["clubs", "hearts", "spades", "diamonds"].forEach((suit) => {
    sliceDeck([], x, y, row).forEach((asset, i) => {
      map[`${cardsConstants[i]}${suit}`] = asset;
    });
    y += 660;
    row += 150;
  });

  return map;
}
export function createInteractiveBg() {
  const bg = new PIXI.Graphics();
  bg.beginFill(0);
  bg.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bg.alpha = 0;
  bg.endFill();
  bg.interactive = true;
  return bg;
}
export class InteractiveBackground extends Container {
  bg: PIXI.Graphics;
  dragging: boolean = false;
  constructor() {
    super();
    const card = new Card("K", Suits.hearts);
  //clearScreen(app);

  const card2 = new Card("Q", Suits.hearts);
  const card3 = new Card("A", Suits.clubs);
  const container = new CardContainer(2);
  
  this.addChild(container.draggableContainer);
  app.stage.addChild(container.draggableContainer);
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0);
    this.bg.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.bg.alpha = 0;
    this.bg.endFill();
    this.bg.interactive = true;
    this.bg.on("mousemove", (e) => {
      if (this.dragging) {
        console.log(`dragging in container`);
      }
    });
    this.bg.on("mouseup", function (e) {
      this.dragging = false;
    });
    this.bg.on("mousedown", (e) => {
      this.dragging = true;
    });
    this.addChild(this.bg);
  }
  addCardContainers(){

  }
}


// isCursorInContainer(x, y) {
//   return (
//     x <= this.draggableContainer.x + CARD_WIDTH / 2 &&
//     x >= this.draggableContainer.x - CARD_WIDTH / 2 &&
//     y <=
//       this.draggableContainer.y +
//         CARD_OFFSET * this.cards.length +
//         CANVAS_HEIGHT / 2 &&
//     y >= this.draggableContainer.y
//   );
// }
//  limitXY(x: number, y: number) {
//   if (x > app.view.width) {
//     x = app.view.width - CARD_WIDTH;
//   }
//   if (x < 0) {
//     x = CARD_WIDTH;
//   }
//   if (y > app.view.height) {
//     y = app.view.height - app.view.width;
//   }
//   if (y < 0) {
//     y = app.view.width;
//   }
//   return { x, y };
// }