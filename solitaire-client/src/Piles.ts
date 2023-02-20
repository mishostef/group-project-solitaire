
import { app } from './app';
import * as PIXI from "pixi.js";
import { createCard } from './utils';
import { CardContainer } from './CardContainer';
import { Card } from './Card';
import { gsap} from "gsap";
import { loadStockEmptyCard } from './cardsTexture';
import { PixiPlugin } from "gsap/PixiPlugin.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Piles {
    gameController;
    state;
    pilesData;
    containers = [];
    stockZone;
    source;
    index;
    isClicked = false;
    card;
    columnNumber;
    allCardsArray = [];

   constructor(gameController, stockZone) {
    this.gameController = gameController;
    this.state = this.gameController.getState();
    this.pilesData = this.state.piles;
    this.stockZone = stockZone;
    this.createPiles();

   } 


private createPiles() {
    for (let i = 0; i <= 6; i++) {
      const emptyCard = loadStockEmptyCard();
      const pileCards = this.state.piles[i];
      const cards = pileCards.cards;
      this.containers[i] = new CardContainer(i);

      emptyCard.position.set(0, 0);
      emptyCard.interactive = true;
      this.containers[i].staticContainer.addChild(emptyCard);
      
      const columnCards = [];
      for (let j = 0; j < cards.length; j++) {
        const cardInfo = cards[j];
        cards[j] = createCard(cardInfo, 0, 0);

        if (cardInfo.faceUp == true) {
          cards[j].showFace(0);
        }
        columnCards.push(cards[j]);
        
        if (j == cards.length - 1) {
          this.addEventListenerOnCard(cards[j], i, j)
        }
        
      }
    this.allCardsArray.push(columnCards)
    this.containers[i].addCards(columnCards);
    }
  }

private addEventListenerOnCard(card: Card, columnNumber: number, index: number) {
        this.isClicked = true;
        card.interactive = true;
        card.on('pointertap', async() => {
          
          console.log("waste isClicked", this.stockZone.isClicked);
          
          if (this.stockZone.isClicked === true) {
            
            let placeResponse = await this.gameController.placeCard("stock", `pile${columnNumber}`, this.stockZone.waste.length - 1 )
            
            if (placeResponse ==  true) {
              this.stockZone.isClicked = false;
              console.log("waste isClicked", this.stockZone.isClicked);
              
              this.stockZone.wasteContainer.removeChild(this.stockZone.selectedCard);
              this.containers[columnNumber].addCards([this.stockZone.selectedCard]);
              this.stockZone.waste.pop();
            }

            if (placeResponse == false) {
              this.stockZone.isClicked = false;
              console.log("waste isClicked", this.stockZone.isClicked);
              
            }
            
          } else {

            card.front.tint = 0x00FFFF;
            gsap.to(card.front, {  tint: 0xFFFFFF, duration: 0.05 })
           //gsap.to(card.front, {  colorProps: { tint: 0xFFFFFF}, duration: 1 })
            
              // card from piles is selected
              this.isClicked = true;
              this.source = `pile${columnNumber}`;
              this.columnNumber = columnNumber;
              this.index = index;

          }
        })    
  }

  async flipCard(columnNumber: number, index: number) {
    let flipResponse = await this.gameController.flip(`pile${columnNumber}`, index - 1);

    let card = createCard(flipResponse.card, 0, 0);
    card.showFace();

    this.containers[columnNumber].addCards([card]);
    this.allCardsArray[columnNumber].push(card);

    
   // app.stage.addChild(card)
  

  }

}