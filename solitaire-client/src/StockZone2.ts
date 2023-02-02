
import * as PIXI from "pixi.js";

import { app } from "./app";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone2  {
  stock: Card[];
  repeat: PIXI.Sprite;
  reverse = true;

  constructor(cards: Card[]) {
   
    this.stock = cards;
    this.loadRepeatCard();
    this.loadEmptyCard();
    this.createStockContainer(this.stock);

  }
  
  
  createStockContainer(stock: Card[]) {

         
      let index = 1;


      this.repeat.interactive = true;
      this.repeat.on('pointertap', () => {
        console.log('empty card clicked');
        
        this.repeatStock(stock);
      })

      for (let i = stock.length - 1 ; i >= -1 ; i--) {

        if (i === -1) {
          console.log('end')
          break;
         // this.moveToStock(initialStock);

          }
        
        //stock[i].position.set(100, 100);
        stock[i].placeCardReverse(100,100);
        stock[i].interactive = true;
        
        
        stock[i].on("pointertap", (e) => {
      
          
        stock[i].zIndex = index;
          index++;
        
          this.moveToWaste(stock[i]);
          //currentStock.pop();

          
      });
    }

  }

  moveToWaste(card: Card) {
    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});

    card.on('pointertap', (e) => {
      //console.log('card in waste clicked')
      tl.to(card, { pixi: {x: 600, y: 100} })
    })

  //  console.log('waste in waste', this.waste);

  }

  repeatStock(stock: Card[]) {
    
    let index = 9;


    stock.forEach( card => {
      console.log(card.face)
      card.placeCardReverse(100, 100);
      card.zIndex = index;
      index++;
    })

    this.createStockContainer(stock);
    console.log('stock in repeatStock',stock.length)
  }



  loadRepeatCard() {
    const repeatTexture = PIXI.Texture.from("assets/repeat.png");
    this.repeat = new PIXI.Sprite(repeatTexture);
    this.repeat.scale.set(CARD_SCALE);
    this.repeat.position.set(100, 100)
    this.repeat.anchor.set(0.5);
    this.repeat.zIndex = -1;
    app.stage.addChild(this.repeat);

  }

  loadEmptyCard() {
    const emptyCardTexture = PIXI.Texture.from("assets/emptyCard.png");
    const emptyCard = new PIXI.Sprite(emptyCardTexture);
    emptyCard.scale.set(CARD_SCALE - 0.01);
    emptyCard.position.set(200, 100)
    emptyCard.anchor.set(0.5);
    emptyCard.zIndex = -1;
    app.stage.addChild(emptyCard);

  }

}




// createStockContainer(initialStock: Card[]) {

//   let currentStock = [...initialStock]
//   let index = 1;

//   for (let i = initialStock.length - 1 ; i >= 0 ; i--) {

    
//     initialStock[i].position.set(100, 100);
//     initialStock[i].interactive = true;
    
//     initialStock[i].on("pointertap", (e) => {
  
      
//      initialStock[i].zIndex = index;
//       index++;
    
//       this.moveToWaste(initialStock[i]);
//       currentStock.pop();

//       if (i === 0) {
        
//         this.moveToStock(initialStock);

//         }
      
//   });
// }

//   initialStock = currentStock;

//  //this.stock = [];
// }


// moveToWaste(card: Card) {
//     const duration = 0.5;
//     const tl = gsap.timeline();
//     tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});
//     this.waste.push(card);
//    console.log('waste in waste', this.waste);

//   }

//   moveToStock(newStock: Card[]) {
//     this.waste = [];
//     let currentStock = [...newStock]

//     for (let i = newStock.length - 1 ; i >= 0 ; i--) {
      
//       currentStock[i].position.set(100, 100);
//       currentStock[i].showBack();

      
//     }

//     this.createStockContainer(newStock);
//     console.log('waste in stock', this.waste);

//   }