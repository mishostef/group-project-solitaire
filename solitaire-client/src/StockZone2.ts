import { Container } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone extends Container {



  constructor(cards: Card[]) {
    super();
    this.createContainer(cards)

}
  

createContainer(cards: Card[]) {
  for (let i = 0 ; i <= cards.length ; i++) {

      
    cards[i].position.set(100, 100);
    cards[i].interactive = true;
    
    cards[i].on("pointertap", (e) => {

      if (i === cards.length ) {
        cards.forEach(card => {
          card.position.set(100, 100)
 
        });
        i = 0;
        //break;
      }
      
      cards[i].zIndex = cards.length - i;
      
      this.move(cards[i]);
      

  });
}
}

 


  move(card: Card) {
    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});
    
    //.then(() => card.flip());
  }

}

