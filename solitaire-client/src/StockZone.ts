
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
  //dragging;
  //draggableLength;
  selectedCard;
  index;
  isClicked = false;

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

    this.stock.map((c) => {
      let card = createCard(c, 0, 0);
      this.stockContainer.addChild(card);
    });

    this.getCardFromStock()
    
  }

  getCardFromStock() {
    this.stockContainer.interactive = true;
    this.stockContainer.on('pointertap', async () => {

      let flipResponse = await this.gameController.flip("stock", 0); 

      if (flipResponse.type === "card") {
        this.stock.pop();
        this.selectedCard = createCard(flipResponse.card, 100, 100);
        this.stock.push(this.selectedCard );
        this.stockContainer.addChild(this.selectedCard );
        
        this.moveToWaste();
      } else if (flipResponse.type === "reset") {

        this.stock = this.state.stock.cards;
        this.waste = [];
    
        this.stockContainer.addChild(this.repeatCard);
        this.repeatCard.position.set(0, 0)
  
      }
      
      this.repeatCard.interactive = true;
      this.repeatCard.on('pointertap', () => {

        this.stockContainer.removeChild(this.repeatCard);
        this.emptyCard.position.set(210, 100);
        this.wasteContainer.addChild(this.emptyCard);

        let lastCard = this.selectedCard;
        app.stage.addChild(lastCard);
        
      gsap.to(lastCard, {pixi: {x: 100, y: 100}, duration: 0.5 ,
          onStart: () => lastCard.showBack(0.5)});

      app.stage.removeChild(lastCard);
      })
    })
  }

  async moveToWaste() {
    
    const duration = 0.5;
  
    const tl = gsap.timeline();
    tl.to(this.selectedCard, {
      pixi: { x: 210, y: 100 },
      duration,
      onStart: () => this.selectedCard.showFace(0.5),
    });

    this.waste.push(this.selectedCard); 
    this.wasteContainer.addChild(this.selectedCard);

    this.stock.pop();

    this.selectedCard.interactive = true;
  
    this.handleClickEvent();

  }

  private handleClickEvent() {
        this.selectedCard.on('pointertap', async () => {
     
          this.isClicked = true;

      })
  }


}

