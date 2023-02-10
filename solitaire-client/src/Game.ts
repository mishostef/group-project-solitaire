import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IStock } from "./interfaces";
import { StockZone } from "./StockZone";
import { app } from "./app";
import { Card } from "./Card";
import { Container } from "pixi.js";

export class Game {
  foundations: Foundations[];
  stockZone: StockZone;
  piles: CardContainer[] = [];

  constructor(state: IStock) {
    for (let i = 0; i < 7; i++) {
      const currentPileInfo = state.piles[i];
      // this.piles[i] = new CardContainer(i + 1);
      const cards = currentPileInfo.cards;
      console.log("currentPileInfo.cards", cards);
      const columnCards = [];
      for (let i = 0; i < cards.length; i++) {
        const cardInfo = cards[0];
        //console.log("cardInfo", cardInfo);
        const card = new Card(cardInfo.face, cardInfo.suit);
        if (cardInfo.faceUp) {
          card.showFace(0);
        }
        columnCards.push(card);
      }
      const container = new CardContainer(i + 1);
      container.addCards(columnCards);
      this.piles.push(container);
      //this.piles[i].addCards(currentPileInfo.cards)
    }
    app.ticker.add(this.update.bind(this));
  }

  update() {
    const allContainers = this.piles; //[container, container2];
    //console.log(this.piles);
    const starting = allContainers.find(
      (container) => container.dragging == true
    );
    if (starting) {
      if (starting.dragging) {
        const others = allContainers.filter((c) => c != starting);
        for (let i = 0; i < others.length; i++) {
          const target = others[i];
          if (target && starting.isOverlapping(target)) {
            starting.draggableContainer.position.set(
              target.staticContainer.position.x,
              target.staticContainer.position.y
            );
            starting.merge(target);
            break;
          }
        }
      }
    }
  }
}
