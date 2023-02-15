import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IState, IStock, IMoves } from "./interfaces";

import { StockZone } from "./StockZone";
import { app } from "./app";
import { Card } from "./Card";
import { cardMap, Suits } from "./constants";
import { StockZone1 } from "./StockZone1";
import { BaseCardContainer } from "./BaseCardContainer";
///here comes app creation etc

function CardFactory(app) {}

export class Game {
  foundations: Foundations[];
  stockZone: StockZone1; //StockZone;
  waste: CardContainer;
  piles: CardContainer[] = [];
  state: IStock;
  //state: IState;
  stock;
  logicState;
  sendInfoToServer: Function;
  move: any;
  data: any = null;
  source: CardContainer = null;
  target: CardContainer = null;

  constructor(cb: Function) {
    this.sendInfoToServer = cb;
    const card = new Card(null, null);
    this.stockZone = new StockZone1(this.sendInfoToServer);
    app.ticker.add(this.update.bind(this));
  }

  public processState(state: IState) {
    this.processPiles(state);
    state.waste.cards.length && this.processWaste(state);
  }

  private processWaste(state: IState) {
    const wasteCards = state.waste.cards.map((c) => this.createCard(c));
    this.stockZone.addCards(wasteCards);
    console.log("stockZone", this.stockZone);
  }

  private processPiles(state: IState) {
    for (let i = 0; i < 7; i++) {
      const currentPileInfo = state.piles[i];
      const cards = currentPileInfo.cards;
      const columnCards = [];
      for (let i = 0; i < cards.length; i++) {
        const cardInfo = cards[i];
        const card = this.createCard(cardInfo);
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
    if (this.data && this.data.face) {
      this.handleFlip();
    }
    this.handleDragging();
  }

  private handleDragging() {
    const allContainers = [...this.piles, this.stockZone.waste];
    const starting = allContainers.find((container) => container.dragging);
    if (starting) {
      if (starting.dragging) {
        this.data && this.target && this.mergePiles(starting, this.target);
        const others = this.piles.filter((c) => c != starting);
        for (let i = 0; i < others.length; i++) {
          const target = others[i];
          if (target && starting.isOverlapping(target)) {
            this.sendMergeRequest(starting, target);
            this.target = target;
            break;
          }
        }
      }
    }
  }

  private handleFlip() {
    const card = this.createCard(this.data);
    if (this.data.faceUp) {
      card.showFace(0);
    }
    this.stockZone.addCards([card]);
    this.stockZone.moveCardsToWaste();
    this.data = null;
  }

  private sendMergeRequest(starting: CardContainer, target: CardContainer) {
    app.stage.removeChild(starting.draggableContainer);
    app.stage.addChild(starting.draggableContainer);
    let pileIndex = this.getSource(starting);
    const move = {
      action: "place",
      target: `pile${target.rowNumber - 1}`,
      source: `${pileIndex}`,
      index: starting.cards.length - starting.draggableLength,
    };
    if (move.source == "stock") {
      move.index =
        this.stockZone.waste.staticContainer.children.length -
        this.stockZone.decrement;
      move.action = "place";
    }
    this.sendInfoToServer(move);
    this.target = target;
  }

  private getSource(starting: CardContainer) {
    let pileIndex = `pile${starting.rowNumber - 1}`;
    if (starting.rowNumber - 1 < 0) {
      pileIndex = "stock";
    }
    return pileIndex;
  }

  private mergePiles(starting: CardContainer, target: CardContainer) {
    ////last change here///////////////////////////////////
    if (starting == this.stockZone.waste) {
      this.stockZone.decrement++;
    }
    starting.draggableContainer.position.set(
      target.staticContainer.position.x,
      target.staticContainer.position.y
    );
    starting.merge(target);
    const move = {
      action: "flip",
      target: null,
      source: this.getSource(starting),
      index: starting.cards.length - starting.draggableLength,
    };
    this.sendInfoToServer(move);
    starting.cards[starting.cards.length - 1].showFace();
    this.target = null;
  }

  createCard(cardInfo: any) {
    const s =
      typeof cardInfo.suit == "string" ? Suits[cardInfo.suit] : cardInfo.suit;
    const card = new Card(cardMap[cardInfo.face], s);
    return card;
  }
}
