import { GameController } from './GameController';
import * as PIXI from "pixi.js";
import { createCard } from './utils';
import { CardContainer } from './CardContainer';
import { Card } from './Card';
import { gsap } from "gsap";

export class Piles {
    gameController;
    state;
    pilesData;
    containers = [];
    stockZone;

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
      const pileCards = this.state.piles[i];
      const cards = pileCards.cards;
      this.containers[i] = new CardContainer(i);
      const columnCards = [];
      for (let j = 0; j < cards.length; j++) {
        const cardInfo = cards[j];
        cards[j] = createCard(cardInfo, 0, 0);

        if (cardInfo.faceUp == true) {
          cards[j].showFace(0);
        }
        columnCards.push(cards[j]);

        if (j == cards.length - 1) {
            this.addEventListenerOnCard(cards, cards[j], i, j)
        }

    }
    this.containers[i].addCards(columnCards);
    }
  }

private addEventListenerOnCard(cards: Card[], card: Card, columnNumber: number, index: number) {

        card.interactive = true;
        card.on('pointertap', async() => {
            let placeResponse = await this.gameController.placeCard("stock", `pile${columnNumber}`, this.stockZone.index )

            console.log("TEST Place + index", placeResponse, index)

            if (placeResponse ==  true) {
              this.stockZone.draggableContainer.removeChild(this.stockZone.currentCard);
              this.containers[columnNumber].addCards([this.stockZone.currentCard]);
            }
        })

    

}




}