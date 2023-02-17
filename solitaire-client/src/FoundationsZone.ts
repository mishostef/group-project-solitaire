
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { cardsConstants, CARD_SCALE, Suits } from "./constants";
import { app } from "./app";
import { Card } from "./Card";
import { CardContainer } from "./CardContainer";


export class Foundations {
    cards: Card[] = [];
    suit: Suits;
    x = 0;
    y = 100;
    z: number;

    constructor(suit: Suits) {
        this.suit = suit;
        
    }

    addCard(card: Card) {
         
        card.interactive = true;
        const startCardX = card.x;
        const startCardY = card.y;

        card.on('pointertap', () => {

            if (this.getIndex(card) === this.cards.length) {
                if (card.suit === 0) {
                    this.x = 670;
                } else if (card.suit === 1) {
                    this.x = 785;
                } else if (card.suit === 2) {
                    this.x = 450;
                } else if (card.suit == 3) {
                    this.x = 560;
                } 
               
                if (this.suit === card.suit) {
                    this.cards.push(card);   
                }

                gsap.to(card, { pixi:{x: this.x, y: this.y}, duration: 0.8 });
                card.interactive = false;
            } else {
                gsap.to(card, { pixi:{x: startCardX, y: startCardY}, duration: 0.3 });
            }

        });

        this.setZIndex(card)
    }

    setZIndex(card: Card) {
                card.zIndex = this.getIndex(card) + 1;
    }

    getIndex(card: Card) {
        let index: number;
        cardsConstants.filter( (value, arrIndex) => {
            if (value === card.face) {  
                index = arrIndex;
            } 
        }); 
        console.log(index)
        return index;
    }   
}
