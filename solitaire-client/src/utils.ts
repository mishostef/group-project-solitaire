import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { app } from "./app";
import { Card } from "./Card";
import { CANVAS_HEIGHT, CANVAS_WIDTH, cards, Suits } from "./constants";
import { sliceDeck } from "./cardsTexture";
import { CardContainer } from "./CardContainer";
import { DraggableObject } from "./DraggableObject";
import { Container } from "pixi.js";
import { Foundations } from "./FoundationsZone";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

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
  const card = new Card("K", Suits.clubs);
  console.log(card);
  //clearScreen(app);
  card.placeCardReverse(20, 300);

  
  const card2 = new Card("K", Suits.hearts);
  card2.placeCard(350, 300);
  
  const card3 = new Card("K", Suits.spades);
  card3.placeCard(600, 300);



  const card4 = new Card("A", Suits.diamonds);
  card4.placeCard(120, 300);
  //app.stage.removeChild(card4);
  
  const card5 = new Card("A", Suits.clubs);
  card5.placeCard(220, 300);
  
  const card6 = new Card("A", Suits.hearts);
  card6.placeCard(320, 300);
  //app.stage.removeChild(card4);
  
  const card7 = new Card("A", Suits.spades);
  card7.placeCard(420, 300);

  console.log(card4.suit);
  console.log(card5.suit);
  console.log(card6.suit);
  console.log(card7.suit);
  //app.stage.removeChild(card5);

  //app.stage.addChild(card5, card4)




  const spadesFoundation = new Foundations(Suits.spades);
  spadesFoundation.addCard(card4);
  spadesFoundation.addCard(card5);
  spadesFoundation.addCard(card6);
  spadesFoundation.addCard(card7);



  const container = new CardContainer(2, [card, card2, card3]);
  app.stage.addChild(container.draggableContainer);


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
      map[`${cards[i]}${suit}`] = asset;
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
  const container = new CardContainer(2, [card, card2, card3]);
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