import { GameController } from './GameController';
import * as PIXI from "pixi.js";
import { createCard } from './utils';
import { CardContainer } from './CardContainer';
import { Card } from './Card';
import { gsap } from "gsap";
import { loadStockEmptyCard } from './cardsTexture';

export class Piles {
    gameController;
    state;
    pilesData;
    containers = [];
    stockZone;
    source;
    index;
    isClicked = false;

   constructor(gameController, stockZone) {
    this.gameController = gameController;
    this.state = this.gameController.getState();
    this.pilesData = this.state.piles;
    this.stockZone = stockZone;
    console.log("piles", this.pilesData)
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
    this.containers[i].addCards(columnCards);
    }
  }

private addEventListenerOnCard(card: Card, columnNumber: number, index: number) {
        this.isClicked = true;
        card.interactive = true;
        card.on('pointertap', async() => {

          if (this.stockZone.isClicked === true) {

          let placeResponse = await this.gameController.placeCard("stock", `pile${columnNumber}`, this.stockZone.waste.length - 1 )
         
            if (placeResponse ==  true) {
              this.stockZone.draggableContainer.removeChild(this.stockZone.currentCard);
              this.containers[columnNumber].addCards([this.stockZone.currentCard]);
              this.stockZone.waste.pop();
            }

            if (placeResponse == false) {
              this.stockZone.draggableContainer.zIndex = this.stockZone.waste.length - 1;
              //this.stockZone.waste.push(this.stockZone.currentCard)
              //this.stockZone.wasteContainer.addChild(this.stockZone.currentCard);
             // this.stockZone.currentCard.position.set(210, 100);
              //this.stockZone.waste.push(this.stockZone.currentCard)
            }
          }


          if ( this.stockZone.draggableContainer.children.length === 0) {
            this.source = `pile${columnNumber}`;
            this.index = index;
          }

        })    

}




}