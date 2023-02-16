import { CardContainer } from "./CardContainer";
import { Foundations } from "./FoundationsZone";
import { IState, IStock, IMoves } from "./interfaces";

import { StockZone } from "./StockZone";
import { app } from "./app";
import { Card } from "./Card";
import {
  CANVAS_WIDTH,
  cardMap,
  CARD_SCALE,
  CARD_WIDTH,
  Suits,
} from "./constants";
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
  starting: CardContainer = null;
  target: CardContainer = null;

  constructor(cb: Function) {
    this.sendInfoToServer = cb;
    const card = new Card(null, null);
    this.stockZone = new StockZone1(this.sendInfoToServer);
    this.stockZone.waste.cb = this.handleDragging.bind(this);
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
      container.cb = this.handleDragging.bind(this); ////
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
    this.placeDraggabeOnTop();
  }

  private placeDraggabeOnTop() {
    const allContainers = [...this.piles, this.stockZone.waste];
    const starting = allContainers.find((container) => container.dragging);
    if (starting) {
      const others = this.piles.filter((c) => c != starting);
      for (let i = 0; i < others.length; i++) {
        const target = others[i];
        if (target && starting.isOverlapping(target)) {
          app.stage.removeChild(starting.draggableContainer);
          app.stage.addChild(starting.draggableContainer);
          break;
        }
      }
    }
  }

  private handleDragging(starting) {
    //called in CardContainer mouseup
    if (starting) {
      const others = this.piles.filter((c) => c != starting);
      for (let i = 0; i < others.length; i++) {
        const target = others[i];
        if (starting.isOverlapping(target)) {
          this.sendMergeRequest(starting, target);
          this.starting = starting;
          this.target = target;
          break;
        } else {
          this.target = null;
        }
      }
      if (this.target === null) {
        starting.returnDraggableContainer();
      }
    }
  }

  private handleFlip() {
    const card = this.createCard(this.data);
    if (this.isInSockZone()) {
      if (this.data.faceUp) {
        card.showFace(0);
      }
      this.stockZone.addCards([card]);
      this.stockZone.moveCardsToWaste();
    } else {
      if (this.starting.rowNumber !== 0) {
        this.starting = null;
      }
    }
  }

  private isInSockZone() {
    return (
      this.starting == null || (this.starting && this.starting.rowNumber == 0)
    );
  }

  private sendMergeRequest(starting: CardContainer, target: CardContainer) {
    let pileIndex = this.getSource(starting);
    const move = {
      action: "place",
      target: `pile${target.rowNumber - 1}`,
      source: `${pileIndex}`,
      index: starting.cards.length - starting.draggableLength,
    };
    if (move.source == "stock") {
      move.index = starting.cards.length - 1; /////
      move.action = "place";
    }
    this.sendInfoToServer(move);
  }

  private getSource(starting: CardContainer) {
    let pileIndex = `pile${starting.rowNumber - 1}`;
    if (starting.rowNumber - 1 < 0) {
      pileIndex = "stock";
    }
    return pileIndex;
  }

  public mergePiles(starting: CardContainer, target: CardContainer) {
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
    this.starting = starting;
  }

  createCard(cardInfo: any) {
    const s =
      typeof cardInfo.suit == "string" ? Suits[cardInfo.suit] : cardInfo.suit;
    const card = new Card(cardMap[cardInfo.face], s);
    return card;
  }

  public setResult(data) {
    this.data = data;
    if (data === true) {
      this.mergePiles(this.starting, this.target);
    } else if (data === false) {
      this.starting.returnDraggableContainer();
    } else if (this.data && this.data.face) {
      this.handleFlip();
    }
  }
}
