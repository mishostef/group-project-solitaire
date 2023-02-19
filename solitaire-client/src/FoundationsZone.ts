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
       this.createSuitArray(foundationState.spades.cards, "spades", this.spadesContainer);
    }

    addToFoundationsZone(container: PIXI.Container, suit: string) {
       container.interactive = true;

        container.on('pointertap', async () => {
        //let placeResponse;

        if (this.stockZone.isClicked === true && this.piles.isClicked === false) {

            const placeResponse = await this.gameController.placeCard("stock", `${suit}`, this.stockZone.waste.length - 1);

            if (placeResponse === true) {
                this.stockZone.selectedCard.position.set(0, 0);

                container.addChild(this.stockZone.selectedCard)

                this.stockZone.isClicked = false;
              console.log("waste isClicked",  this.stockZone.isClicked)

                this.stockZone.wasteContainer.removeChild(this.stockZone.selectedCard);
                this.stockZone.waste.pop();
              }
    
              if (placeResponse === false) {
                  //this.stockZone.waste.push(this.stockZone.currentCard);
                  this.stockZone.isClicked = false;
              console.log("waste isClicked",  this.stockZone.isClicked)

                
                  //this.stockZone.wasteContainer.addChild(this.stockZone.currentCard);
                 // this.stockZone.currentCard.position.set(210, 100);
              }
        
        } else if (this.piles.isClicked = true && this.stockZone.isClicked === false) {

            const placeResponse = await this.gameController.placeCard(this.piles.source, `${suit}`, this.piles.index);

            if (placeResponse === true) {

                this.piles.allCardsArray[this.piles.columnNumber][this.piles.index].position.set(0, 0);
                container.addChild(this.piles.allCardsArray[this.piles.columnNumber][this.piles.index])

                this.piles.isClicked = false;
                console.log("piles isClicked",  this.piles.isClicked)

                this.piles.containers[this.piles.columnNumber].staticContainer.removeChild(this.piles.selectedCard);
                this.piles.allCardsArray[this.piles.columnNumber][this.piles.index].pop();
              }
    
              if (placeResponse === false) {
                  //this.stockZone.waste.push(this.stockZone.currentCard);
                  this.piles.isClicked = false;
                 console.log("piles isClicked",  this.piles.isClicked)

              }
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

