
import { GameController } from './GameController';
import * as PIXI from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import {
  cardMap,
  cardsConstants,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
  Suits,
} from "./constants";
import { gsap } from "gsap";
import { createCard } from './utils';


export class StockZone {
  gameController: GameController;
  state;
  stock = [];
  waste = [];
  stockContainer = new PIXI.Container();
  wasteContainer = new PIXI.Container();
  draggableContainer = new PIXI.Container();
  move = {};
  repeatCard: PIXI.Sprite;
  reverse = true;
  countCreateStockContainer = 0;
  flipCard;
  dragging;
  draggableLength;
  currentCard;
  index;

  constructor(gameController) {
    this.gameController = gameController;

    this.state = this.gameController.getState();
    this.wasteContainer.zIndex = 60;

    this.stock = this.state.stock.cards;
    this.waste = this.state.waste.cards;
    //this.stock = this.stock.concat(this.waste)
    this.loadRepeatCard();
    this.createStockContainer(this.stock);
    
  }

  createStockContainer(stock) {

    app.stage.addChild(this.stockContainer);
    this.stockContainer.position.set(100, 100);
    app.stage.addChild(this.wasteContainer);
    this.wasteContainer.position.set(0, 0);
    app.stage.addChild(this.draggableContainer);
    this.draggableContainer.position.set(210, 100);

    this.stock.map((c) => {
      let card = createCard(c, 0, 0);
      this.stockContainer.addChild(card);
    });

    console.log("stockFromServer", this.stock)
    console.log("wasteFromServer", this.waste)
    this.getCardFromStock()

    
  }

  getCardFromStock() {
    this.stockContainer.interactive = true;
    this.stockContainer.on('pointertap', async () => {


      let flipResponse = await this.gameController.flip("stock", 0);
      
      console.log("stockZone flipped card WATCH:", flipResponse);
      
      if (flipResponse == null) {
        this.stock = [];
       
      }
      
      this.stock.pop();
      this.currentCard = createCard(flipResponse.card, 100, 100);
      this.stock.push(this.currentCard );
      this.stockContainer.addChild(this.currentCard );
      
      this.moveToWaste();
  

    })

  }

  async moveToWaste() {

    console.log("waste array", this.waste)
    
    const duration = 0.5;
  
    const tl = gsap.timeline();
    tl.to(this.currentCard, {
      pixi: { x: 210, y: 100 },
      duration,
      onStart: () => this.currentCard.showFace(0.5),
    });

    this.waste.push(this.currentCard); 
    this.wasteContainer.addChild(this.currentCard);

    this.currentCard.interactive = true;
    this.handleClickEvent();
   


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
//}




// -----------------Dragging -------------------------------------




private handleClickEvent() {
      this.currentCard.on('pointertap', async () => {
      this.wasteContainer.removeChild(this.currentCard);
      this.currentCard.position.set(0, 0);
      this.draggableContainer.zIndex = 61;
      this.draggableContainer.addChild(this.currentCard);

      

      for ( let i = 0; i < this.waste.length; i++) {

        let takeResponse = await this.gameController.takeCard( "stock", null, i);
        console.log("take result + index", takeResponse, i)
        if (takeResponse === true) {
          this.index = i;

        }
      }

      
    })
}



}

