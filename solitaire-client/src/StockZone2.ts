
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
        console.log('repeat card clicked');
        
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

  }

  repeatStock(stock: Card[]) {
    
    let index = 1;


    stock.forEach( card => {
      console.log(card.face)
      //card.placeCardReverse(0, 0);
      //card.showBack();

      const tl = gsap.timeline();
     tl.to(card, { pixi: { x: 100, y: 100 }, duration: 5, onStart:(() => card.showBack())});


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

