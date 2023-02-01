
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
                    this.x = 800;
                } else if (card.suit === 1) {
                    this.x = 900;
                } else if (card.suit === 2) {
                    this.x = 600;
                } else if (card.suit == 3) {
                    this.x = 700;
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
        let index:number;
        cardsConstants.filter( (value, arrIndex) => {
            if (value === card.face) {  
                index = arrIndex;
            } 
        }); 
        return index;
    }   
}


export function loadFoundations() {
    
    const heartTexture = PIXI.Texture.from("assets/heart.png");
    const heart = new PIXI.Sprite(heartTexture);
    heart.scale.set(CARD_SCALE - 0.01);
    heart.position.set(600, 100)
    heart.anchor.set(0.5);
    app.stage.addChild(heart);
    
    const spadeTexture = PIXI.Texture.from("assets/spade.png");
    const spade= new PIXI.Sprite(spadeTexture);
    spade.scale.set(CARD_SCALE - 0.01);
    spade.position.set(700, 100)
    spade.anchor.set(0.5);
    app.stage.addChild(spade);

    const diamondTexture = PIXI.Texture.from("assets/diamond.png");
    const diamond = new PIXI.Sprite(diamondTexture);
    diamond.scale.set(CARD_SCALE - 0.01);
    diamond.position.set(800, 100)
    diamond.anchor.set(0.5);
    app.stage.addChild(diamond);
    
    const clubTexture = PIXI.Texture.from("assets/club.png");
    const club = new PIXI.Sprite(clubTexture);
    club.scale.set(CARD_SCALE - 0.01);
    club.position.set(900, 100)
    club.anchor.set(0.5);
    app.stage.addChild(club);
    
}
