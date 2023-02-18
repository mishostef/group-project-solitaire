
import { GameController } from './GameController';
import * as PIXI from "pixi.js";
import { app } from "./app";
import { gsap } from "gsap";
import { createCard } from './utils';
import { loadRepeatCard, loadStockEmptyCard } from './cardsTexture';


export class StockZone {
  gameController: GameController;
  state;
  stock = [];
  waste = [];
  stockContainer = new PIXI.Container();
  wasteContainer = new PIXI.Container();
  draggableContainer = new PIXI.Container();
  move = {};
  repeatCard = loadRepeatCard()
  emptyCard = loadStockEmptyCard();
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

      if (flipResponse.type === "card") {
        this.stock.pop();
        this.currentCard = createCard(flipResponse.card, 100, 100);
        this.stock.push(this.currentCard );
        this.stockContainer.addChild(this.currentCard );
        
        this.moveToWaste();
      } else if (flipResponse.type === "reset") {

        this.stock = this.state.stock.cards;
        this.waste = [];
    
        this.stockContainer.addChild(this.repeatCard);
        this.repeatCard.position.set(0, 0)
  
      }
      
      this.repeatCard.interactive = true;
      this.repeatCard.on('pointertap', () => {
        //this.repeatCard.zIndex = -1;
        this.stockContainer.removeChild(this.repeatCard);
        this.emptyCard.position.set(210, 100);
        this.wasteContainer.addChild(this.emptyCard);

        console.log("last", this.currentCard);

        let lastCard = this.currentCard;
        app.stage.addChild(lastCard);
        
      gsap.to(lastCard, {pixi: {x: 100, y: 100}, duration: 0.5 ,
          onStart: () => lastCard.showBack(0.5)});

      app.stage.removeChild(lastCard);
      })
  
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

    this.stock.pop();

    this.currentCard.interactive = true;
    console.log("TEST WASTE 2 LENGTH-1 =", this.waste.length - 1)
    this.handleClickEvent();

  }

  private handleClickEvent() {
        this.currentCard.on('pointertap', async () => {
        this.wasteContainer.removeChild(this.currentCard);
        this.waste.pop()
        this.currentCard.position.set(0, 0);
        this.draggableContainer.zIndex = 61;
        this.draggableContainer.addChild(this.currentCard);
        this.draggableContainer.position.set(210, 100)
        
      })
  }


}

