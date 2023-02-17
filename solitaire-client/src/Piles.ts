import { GameController } from './GameController';
import * as PIXI from "pixi.js";
import { createCard } from './utils';
import { CardContainer } from './CardContainer';

export class Piles {
    gameController;
    state;
    pilesData;
    containers = [];

   constructor(gameController) {
    this.gameController = gameController;
    this.state = this.gameController.getState();
    this.pilesData = this.state.piles;
    console.log("piles", this.pilesData)
    this.createPiles();

   } 


private createPiles() {
    for (let i = 0; i <= 6; i++) {
      const pileCards = this.state.piles[i];
      const cards = pileCards.cards;
      this.containers[i] = new CardContainer(i+1);
      //const columnCards = [];
      for (let j = 0; j < cards.length; j++) {
        const cardInfo = cards[j];
        cards[j] = createCard(cardInfo, 0, 0);
        if (cardInfo.faceUp == true) {
          cards[j].showFace(0);
        }
    }
    this.containers[i].addCards(cards);
    }
  }




}