import * as PIXI from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { cardsConstants, CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone  {
  stock: Card[];
  repeatCard: PIXI.Sprite;
  reverse = true;

  constructor(cards: Card[]) {
   
    this.stock = cards;
    this.loadRepeatCard();
    this.loadEmptyCard();
    this.createStockContainer();

  }
  
  
  createStockContainer() {
         
      let index = 1;
      let isStockEmpty;

      this.repeatCard.interactive = true;
      this.repeatCard.on('pointertap', () => {


        if (isStockEmpty.length > 0 ) {
          
          this.repeatStock();
        }
    })
    
    for (let i = this.stock.length - 1 ; i >= 0; i--) {
      
      if ( this.stock[i].x === 100 || this.stock[i].x === 200 || this.stock[i].x === 0) {
        this.stock[i].movedFromStock = false;
      } else {
        this.stock[i].movedFromStock = true;
      }
      isStockEmpty = this.stock.filter( card => card.movedFromStock === false )
        
          if( this.stock[i].movedFromStock === false) {
      
            this.stock[i].placeCardReverse(100,100);
            this.stock[i].interactive = true;
            
            this.stock[i].on("pointertap", (e) => {

                this.stock[i].zIndex = index;
                index++;
                
                this.moveToWaste(this.stock[i], i);

            })

          }
        }
    
  }

  moveToWaste(card: Card, i: number) {
    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});

    card.on('pointertap', (e) => {
      tl.to(card, { pixi: {x: 600, y: 100}, duration})
      card.movedFromStock = true;  
    })

  }

  repeatStock() {
    
    let index = 1;

    this.stock.forEach( card => {
      if (card.movedFromStock === false ) {

        const tl = gsap.timeline();
        tl.to(card, { pixi: { x: 100, y: 100 }, duration: 3, onStart:(() => card.showBack())});
  
        card.zIndex = index;
        index++;
      }
 
    })

    this.createStockContainer();
  }


  loadRepeatCard() {
    const repeatTexture = PIXI.Texture.from("assets/repeat.png");
    this.repeatCard = new PIXI.Sprite(repeatTexture);
    this.repeatCard.scale.set(CARD_SCALE);
    this.repeatCard.position.set(100, 100)
    this.repeatCard.anchor.set(0.5);
    this.repeatCard.zIndex = -1;
    app.stage.addChild(this.repeatCard);

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












