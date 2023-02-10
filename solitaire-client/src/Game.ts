import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IStock } from "./interfaces";
import { StockZone } from "./StockZone";
import { app } from "./app";
import { Card } from "./Card";
import { Container } from "pixi.js";
import { cardMap, Suits } from "./constants";
///here come app creation etc

function CardFactory(app) {}

export class Game {
  foundations: Foundations[];
  stockZone: StockZone;
  piles: CardContainer[] = [];

  constructor(state: IStock) {
    for (let i = 0; i < 7; i++) {
      const currentPileInfo = state.piles[i];
      const cards = currentPileInfo.cards;
      console.log("currentPileInfo.cards", cards);
      const columnCards = [];
      for (let i = 0; i < cards.length; i++) {
        const cardInfo = cards[i];
        const s =
          typeof cardInfo.suit == "string"
            ? Suits[cardInfo.suit]
            : cardInfo.suit;
        const card = new Card(cardMap[cardInfo.face], s);
        if (cardInfo.faceUp) {
          card.showFace(0);
        }
        columnCards.push(card);
      }
      const container = new CardContainer(i + 1);
      container.addCards(columnCards);
      this.piles.push(container);
    }
    app.ticker.add(this.update.bind(this));
  }

  update() {
    const allContainers = this.piles;
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
