import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IState, IStock, IMoves } from "./interfaces";

import { StockZone } from "./StockZone";
import { app } from "./app";
import { Card } from "./Card";
import { cardMap, Suits } from "./constants";
import { StockZone1 } from "./StockZone1";
///here comes app creation etc

function CardFactory(app) {}

export class Game {
  foundations: Foundations[];
  stockZone: any; //StockZone;
  piles: CardContainer[] = [];
  state: IState;
  sendInfoToServer: Function;
  move: any;
  constructor(cb: Function) {
    this.sendInfoToServer = cb;
    const card = new Card("A", Suits.spades);
    card.showFace();
    this.stockZone = new StockZone1([card]);
    app.ticker.add(this.update.bind(this));
    // const move = {////for flipping in stock zone
    //   action: "flip",
    //   index: 23,
    //   source: "stock",
    //   target: null,
    // };

    // this.state = state;
    // this.stock = new StockZone(state.stock.cards);
    //console.log("stock.cards - ", this.stock)
  }

  public processState(state: IState) {
    this.processPiles(state);
  }

  private processPiles(state: IState) {
    for (let i = 0; i < 7; i++) {
      const currentPileInfo = state.piles[i];
      const cards = currentPileInfo.cards;
      //     console.log("currentPileInfo.cards", cards);
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
  }

  public processMoves(moves: IMoves) {
    const pileMoves = moves.piles;
    console.log("pileMoves: ", pileMoves);
  }

  private update() {
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
            const move = {
              action: "take",
              target: null,
              source: `pile${starting.rowNumber}`,
              index: starting.cards.length - starting.draggableLength,
            };
            this.sendInfoToServer(move);
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
