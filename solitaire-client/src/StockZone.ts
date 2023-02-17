
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

  constructor(gameController) {
    this.gameController = gameController;

    this.state = this.gameController.getState();
    this.wasteContainer.zIndex = 60;

    this.stock = this.state.stock.cards;
    this.waste = this.state.waste.cards;
    this.stock = this.stock.concat(this.waste)
    this.loadRepeatCard();
    this.createStockContainer(this.stock);
    this.addEvents();
    
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
        this.stock = []
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

    this.wasteContainer.interactive = true;
    this.handleMouseDownEvent()

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


protected addEvents() {
  this.draggableContainer.interactive = true;
  this.draggableContainer.on("mouseup", this.handleMouseUpEvent.bind(this));
  this.draggableContainer.on("mousedown", () => {
    this.dragging = true;
    console.log("dragging started");
  });
  this.draggableContainer.on(
    "globalmousemove",
    this.handleMouseMove.bind(this)
  );
}

private handleMouseDownEvent() {
      this.wasteContainer.on('mousedown', () => {
      this.wasteContainer.removeChild(this.currentCard);
      this.currentCard.position.set(0, 0);
      this.draggableContainer.zIndex = 61;
      this.draggableContainer.addChild(this.currentCard);
      this.dragging = true;

      this.handleMouseUpEvent();

      console.log("dragging started");
      console.log("drag children",this.draggableContainer.children)
      console.log("waste children",this.wasteContainer.children)
    })
}



protected handleMouseUpEvent() {

  this.draggableContainer.on('mouseup' , async (e) => {

    let result = await this.gameController.placeCard("stock", "pile1", 0);

    if (result == false) {

      gsap.fromTo(this.currentCard, {x: e.globalX, y: e.globalY}, { x:210, y: 100, duration: 0.5 })
      this.draggableContainer.removeChild(this.currentCard);
 
      this.wasteContainer.addChild(this.currentCard);
 
    }

    if (result = true) {
      //this.draggableContainer.removeChild(this.currentCard);
      // add current card to pile



    }



    console.log("Place card called in StockZone result", result)

    this.dragging = false;
    this.draggableContainer.position.set( e.globalX, e.globalY);
  })

}
private handleMouseMove(e) {
  let [x, y] = [e.globalX, e.globalY];
  if (this.dragging) {
    this.draggableContainer.position.set(x, y);
  }
}

//private handleMouseDown(e: FederatedPointerEvent) {
  // if (this.draggableContainer == null) {
  //   this.draggableContainer = new Container();
  // }
  //let index = this.getIndex(e);
  //this.dragging = true;
  // this.cards.forEach((card, i) => {
  //   if (i >= index) {
  //     this.draggableContainer.addChild(card);
  //     card.position.set(0, (i - index) * CARD_OFFSET);
  //   }
  //   this.draggableLength = this.draggableContainer.children.length;
  // });
//}


}

