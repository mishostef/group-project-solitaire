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
  waste: CardContainer;
  piles: CardContainer[] = [];
  state: IState;
  sendInfoToServer: Function;
  move: any;
  isMovePossible: boolean | null = null;
  source: CardContainer = null;
  target: CardContainer = null;

  constructor(cb: Function) {
    this.sendInfoToServer = cb;
    const card = new Card("A", Suits.spades);
    const card2 = new Card("J", Suits.hearts);
    card.showFace();

    this.waste = new CardContainer(0);
    this.waste.X = 200;
    this.waste.Y = 100;
    this.stockZone = new StockZone1([card, card2], this.waste,this.sendInfoToServer);
    app.ticker.add(this.update.bind(this));
 
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
    pileMoves.forEach((mv, index) => {
      const currentPile = this.piles[index];
      if (mv.flip) {
        currentPile.flip();
      }
    });
  }

  private update() {
    const allContainers = [...this.piles, this.waste];
    const starting = allContainers.find(
      (container) => container.dragging == true
    );
    if (starting) {
      if (starting.dragging) {
        this.isMovePossible &&
          this.target &&
          this.mergePiles(starting, this.target);
        const others = this.piles.filter((c) => c != starting);
        for (let i = 0; i < others.length; i++) {
          const target = others[i];
          if (target && starting.isOverlapping(target)) {
            app.stage.removeChild(starting.draggableContainer);
            app.stage.addChild(starting.draggableContainer);
            let pileIndex = `pile${starting.rowNumber - 1}`;
            if (starting.rowNumber - 1 < 0) {
              pileIndex = "stock";
            }
            const move = {
              action: "place",
              target: `pile${target.rowNumber - 1}`,
              source: `${pileIndex}`,
              index: starting.cards.length - starting.draggableLength,
            };
            this.sendInfoToServer(move);
            this.target = target;
            break;
          }
        }
      }
    }
  }

  private mergePiles(starting: CardContainer, target: CardContainer) {
    starting.draggableContainer.position.set(
      target.staticContainer.position.x,
      target.staticContainer.position.y
    );
    starting.merge(target);
    const move = {
      action: "flip",
      target: null,
      source: `pile${starting.rowNumber - 1}`,
      index: starting.cards.length - starting.draggableLength,
    };
    this.sendInfoToServer(move);
    starting.cards[starting.cards.length - 1].showFace();
    this.target = null;
  }
}
