import { Container } from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { gsap } from "gsap";

export class StockZone2 extends Container {
  stock: Card[];
  waste: Card[] = [];


  constructor(cards: Card[]) {
    super();
    this.stock = cards;
    this.createStockContainer(this.stock)

}
  
  

createStockContainer(initialStock: Card[]) {

  let currentStock = [...initialStock]
  let index = 1;

  for (let i = initialStock.length - 1 ; i >= 0 ; i--) {

    
    initialStock[i].position.set(100, 100);
    initialStock[i].interactive = true;
    
    initialStock[i].on("pointertap", (e) => {
  
      
     initialStock[i].zIndex = index;
      index++;
    
      this.moveToWaste(initialStock[i]);
      currentStock.pop();
      //console.log('AAA', i, initialStock.length ,currentStock.length)
      //console.log('BBB', this.waste)

      if (i === 0) {
        
        this.moveToStock(initialStock);
        

        }
      
  });
}

  initialStock = currentStock;

 //this.stock = [];
}

 


moveToWaste(card: Card) {
    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, { pixi: { x: 200, y: 100 }, duration, onStart:(() => card.showFace())});
    this.waste.push(card);
   console.log('waste in waste', this.waste);

  }

moveToStock(newStock: Card[]) {
  this.waste = [];
  let currentStock = [...newStock]

  for (let i = newStock.length - 1 ; i >= 0 ; i--) {
    
    currentStock[i].position.set(100, 100);
    currentStock[i].showBack();

    
  }

  this.createStockContainer(newStock);
  console.log('waste in stock', this.waste);

}

}


