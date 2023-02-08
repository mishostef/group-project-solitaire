import * as PIXI from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import {
  cardsConstants,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
} from "./constants";
import { gsap } from "gsap";

export class StockZone {
  stock: Card[] = [];
  repeatCard: PIXI.Sprite;
  reverse = true;
  waste: Card[] = [];

  constructor(cards: Card[]) {
    this.stock = cards;
    this.loadRepeatCard();
    this.createStockContainer(this.stock);
  }

  createStockContainer(stock) {
    this.waste = [];
    console.log("WWW", this.waste)
    let index = 1;
    let isStockEmpty;

    // console.log("WWWWW", this.waste)
    // console.log(this.stock ==stock)

    //let stockLength = stock.length;

    this.repeatCard.interactive = true;
    this.repeatCard.on("pointertap", () => {
      if (isStockEmpty.length > 0) {
        this.repeatStock();
      }
    });

    for (let i =0; i <= stock.length - 1; i++) {
      
      if (stock[i].x === 100 || stock[i].x === 0) {
        stock[i].movedFromStock = false;
      } else {
        stock[i].movedFromStock = true;
      }

      isStockEmpty = stock.filter((card) => card.movedFromStock === false);

      if (stock[i].movedFromStock === false) {
        stock[i].interactive = true;
        stock[i].placeCardReverse(100, 100);

        stock[i].on("pointertap", (e) => {
          stock[i].zIndex = index;
          index++;

          console.log("zIndex", stock[i].zIndex);
          console.log("face", stock[i].face);

          stock[i].movedFromStock = true;
          this.moveToWaste(stock[i], index);

          //this.waste.push(stock[i]);
        });
      }
    }

  }

  moveToWaste(card: Card, index) {

    this.waste.push(card);

    card.zIndex = index;

    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, {
      pixi: { x: 200, y: 100 },
      duration,
      onStart: () => card.showFace(),
    });

  }

  repeatStock() {
    // this.stock = [];

    let index = 1;

    this.waste.forEach((card) => {
      const tl = gsap.timeline();
      tl.to(card, {
        pixi: { x: 100, y: 100 },
        duration: 2,
        onStart: () => card.showBack(),
      });

      card.zIndex = index;
      index++;

      card.movedFromStock = false;
      this.stock.push(card);
      //this.waste.pop();

    });

    this.waste = [];
    this.createStockContainer(this.stock);
  }

  loadRepeatCard() {
    const repeatTexture = PIXI.Texture.from("assets/repeat.png");
    this.repeatCard = new PIXI.Sprite(repeatTexture);
    this.repeatCard.scale.set(CARD_SCALE);
    this.repeatCard.position.set(100, 100);
    this.repeatCard.anchor.set(0.5);
    this.repeatCard.zIndex = -1;
    app.stage.addChild(this.repeatCard);
  }
}

// export class StockZone2  {
//   stock: Card[];
//   repeatCard: PIXI.Sprite;
//   reverse = true;
//   waste = []

//   constructor(cards: Card[]) {

//     this.stock = cards;
//     this.loadRepeatCard();
//     this.createStockContainer();

//   }

//   createStockContainer() {

//       let index = 1;
//       let isStockEmpty;

//       this.repeatCard.interactive = true;
//       this.repeatCard.on('pointertap', () => {

//         if (isStockEmpty.length > 0 ) {

//           this.repeatStock();
//         }
//     })

//     for (let i = this.stock.length - 1 ; i >= 0; i--) {

//       if ( this.stock[i].x === 100 || this.stock[i].x === 200 || this.stock[i].x === 0) {
//         this.stock[i].movedFromStock = false;
//       } else {
//         this.stock[i].movedFromStock = true;
//       }
//       isStockEmpty = this.stock.filter( card => card.movedFromStock === false )

//           if( this.stock[i].movedFromStock === false) {

//             this.stock[i].placeCardReverse(100,100);
//             this.stock[i].interactive = true;

//             this.stock[i].on("pointertap", (e) => {

//                 this.stock[i].zIndex = index;
//                 index++;

//                 this.moveToWaste(this.stock[i], i);

//             })

//           }
//         }

//   }

//   moveToWaste(card: Card, i: number) {
//     const duration = 0.5;
//     const tl = gsap.timeline();
//     tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});

//     card.on('pointertap', (e) => {
//       tl.to(card, { pixi: {x: 400, y: 100}, duration})
//       card.movedFromStock = true;
//     })

//   }

//   repeatStock() {

//     let index = 1;

//     this.stock.forEach( card => {
//       if (card.movedFromStock === false ) {

//         const tl = gsap.timeline();
//         tl.to(card, { pixi: { x: 100, y: 100 }, duration: 3, onStart:(() => card.showBack())});

//         card.zIndex = index;
//         index++;
//       }

//     })

//     this.createStockContainer();
//   }

//   loadRepeatCard() {
//     const repeatTexture = PIXI.Texture.from("assets/repeat.png");
//     this.repeatCard = new PIXI.Sprite(repeatTexture);
//     this.repeatCard.scale.set(CARD_SCALE);
//     this.repeatCard.position.set(100, 100)
//     this.repeatCard.anchor.set(0.5);
//     this.repeatCard.zIndex = -1;
//     app.stage.addChild(this.repeatCard);

//   }

// }
