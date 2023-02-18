import { GameController } from './GameController';

import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { cardsConstants, CARD_SCALE, Suits } from "./constants";
import { app } from "./app";
import { Card } from "./Card";
import { CardContainer } from "./CardContainer";
import { loadClubEmptyCards, loadDiamondEmptyCards, loadHeartEmptyCards, loadSpadeEmptyCards } from './cardsTexture';
import { createCard } from './utils';


export class Foundations {

    diamondsContainer: PIXI.Container;
    clubsContainer: PIXI.Container;
    heartsContainer: PIXI.Container;
    spadesContainer: PIXI.Container;

    diamondEmptyCard: PIXI.Sprite;
    clubEmptyCard: PIXI.Sprite;
    heartEmptyCard: PIXI.Sprite;
    spadeEmptyCard: PIXI.Sprite;

    gameController;
    stockZone;
    piles;


    constructor(gameController, stockZone, piles) {

        this.gameController = gameController;
        this.stockZone = stockZone;
        this.piles = piles;

        this.createContainers();
        
    }

    createContainers() {

        this.diamondsContainer = new PIXI.Container();
        this.clubsContainer = new PIXI.Container();
        this.heartsContainer = new PIXI.Container();
        this.spadesContainer = new PIXI.Container();

        this.diamondsContainer.position.set(670, 100);
        this.clubsContainer.position.set(785, 100);
        this.heartsContainer.position.set(450, 100);
        this.spadesContainer.position.set(560, 100);
      
        this.diamondEmptyCard = loadDiamondEmptyCards();
        this.clubEmptyCard = loadClubEmptyCards();
        this.heartEmptyCard = loadHeartEmptyCards();
        this.spadeEmptyCard = loadSpadeEmptyCards();
        
        this.diamondsContainer.addChild(this.diamondEmptyCard);
        this.clubsContainer.addChild(this.clubEmptyCard);
        this.heartsContainer.addChild(this.heartEmptyCard);
        this.spadesContainer.addChild(this.spadeEmptyCard);
        
        app.stage.addChild(this.diamondsContainer, this.clubsContainer, this.heartsContainer, this.spadesContainer);

        this.addToFoundationsZone(this.diamondsContainer, "diamonds");
        this.addToFoundationsZone(this.clubsContainer, "clubs");
        this.addToFoundationsZone(this.heartsContainer, "hearts");
        this.addToFoundationsZone(this.spadesContainer, "spades");

        let foundationState = this.gameController.state.foundations;
        

       this.createSuitArray(foundationState.diamonds.cards, "diamonds", this.diamondsContainer);
       this.createSuitArray(foundationState.clubs.cards, "clubs", this.clubsContainer);
       this.createSuitArray(foundationState.hearts.cards, "hearts", this.heartsContainer);
       this.createSuitArray(foundationState.spade.cards, "spades", this.spadesContainer);
    }

    addToFoundationsZone(container: PIXI.Container, suit: string) {
       container.interactive = true;

        container.on('pointertap', async () => {

          let placeResponse = await this.gameController.placeCard("stock", `${suit}`, this.stockZone.waste.length);

          if (placeResponse === true) {
            this.stockZone.draggableContainer.removeChild(this.stockZone.currentCard);
            container.addChild(this.stockZone.currentCard)
          }

          if (placeResponse === false) {
              this.stockZone.waste.push(this.stockZone.currentCard)
              this.stockZone.wasteContainer.addChild(this.stockZone.currentCard);
              this.stockZone.currentCard.position.set(210, 100);
              this.stockZone.waste.push(this.stockZone.currentCard)

          }

            
        })

    }

    createSuitArray(stateArray: Card[], suit: string, container: PIXI.Container) {

        for (let i = 0; i < stateArray.length; i++) {
            const cardInfo = stateArray[i];
            const card = createCard(cardInfo, 0, 0);
            card.showFace(0);
            container.addChild(card);
        }

    }

}

