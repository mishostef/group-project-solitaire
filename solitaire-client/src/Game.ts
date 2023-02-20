import { CardContainer } from "./cardContainers/CardContainer";
import { IState, IStock, IMoves, IFoundations } from "./interfaces";
import * as PIXI from "pixi.js";
import { Card } from "./Card";
import { cardMap, foundationsMap, Suits } from "./constants";
import { StockZone1 } from "./StockZone1";
import { checkLoseCondition, getSource, getTarget } from "./utils";
import {
  createContainer,
  createStock,
  loadFoundationsEmptyCards as loadEmptyCards,
} from "./Factories";

export const app = new PIXI.Application({
  width: 1800,
  height: 1800,
  background: 0x999999,
});

document.body.appendChild(app.view as HTMLCanvasElement);
app.stage.sortableChildren = true;

export const createCardContainer = createContainer.bind(null, app);
export const createStockZone = createStock.bind(null, app);
export const loadFoundationsEmptyCards = loadEmptyCards.bind(null, app);

export class Game {
  stockZone: StockZone1;
  waste: CardContainer;
  piles: CardContainer[] = [];
  state: IStock;
  stock;
  logicState;
  sendInfoToServer: Function;
  move: any;
  data: any = null;
  starting: CardContainer = null;
  target: CardContainer = null;
  foundations: CardContainer[] = [];
  lastMove: any = null;

  constructor(cb: Function) {
    loadFoundationsEmptyCards();
    this.sendInfoToServer = cb;
    this.stockZone = createStockZone(this.sendInfoToServer);
    this.stockZone.waste.cb = this.handleDragging.bind(this);
    Object.keys(foundationsMap).forEach((key, i) => {
      this.foundations[i] = createCardContainer(
        "StockCardContainer",
        Number(key)
      );
      this.foundations[i].X = -1 * Number(key);
      this.foundations[i].Y = 100;
    });

    app.ticker.add(this.update.bind(this));
  }

  public processState(state: IState) {
    this.processPiles(state);
    state.waste.cards.length && this.processWaste(state);
    this.processFoundations(state.foundations);
  }

  private processFoundations(foundations: IFoundations) {
    console.log("ffounnd:", foundations);
    const keys = Object.values(foundationsMap);
    Object.keys(foundations).forEach((key) => {
      const index = keys.indexOf(key);
      const cardInfo = foundations[key].cards;
      if (cardInfo.length > 0) {
        const cards = cardInfo.map(this.createCard);
        cards.forEach((x) => x.showFace());
        this.foundations[index].addCards(cards);
      }
    });
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
      const container = createCardContainer("CardContainer", i + 1);
      container.cb = this.handleDragging.bind(this);
      container.addCards(columnCards);
      this.piles.push(container);
    }
  }

  public processMoves(moves: IMoves) {
    const pileMoves = moves.piles;
    console.log("pileMoves: ", pileMoves);
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
    if (starting) {
      const others = [...this.piles, ...this.foundations].filter(
        (c) => c != starting
      );
      for (let i = 0; i < others.length; i++) {
        const target = others[i];
        const isCurrentOverlappingTarget = starting.isOverlapping(target);
        if (isCurrentOverlappingTarget) {
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
      this.stockZone.addCards([card]);
      this.stockZone.moveCardsToWaste();
    } else if (
      this.starting.rowNumber !== 0 &&
      this.starting.staticContainer.children.length > 0
    ) {
      this.starting.removeLastCardFromContainer();
      this.starting.addCards([card]);
      this.starting.flip();
      this.starting = null;
    } else {
      this.stockZone.addCards([card]);
      this.stockZone.moveCardsToWaste();
    }
    this.stockZone.waste.staticContainer.sortChildren();
  }

  private isInSockZone() {
    return (
      this.starting == null || (this.starting && this.starting.rowNumber == 0)
    );
  }

  private sendMergeRequest(starting: CardContainer, target: CardContainer) {
    let pileIndex = getSource(starting);
    const move = {
      action: "place",
      target: getTarget(target),
      source: `${pileIndex}`,
      index: starting.cards.length - starting.draggableLength,
    };
    if (move.source == "stock") {
      move.index = starting.cards.length - 1;
      move.action = "place";
    }
    this.sendInfoToServer(move);
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
      source: getSource(starting),
      index: starting.cards.length - starting.draggableLength,
    };
    this.sendInfoToServer(move);
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
    } else if (data === null) {
      if (
        this.stockZone.waste.cards.length &&
        checkLoseCondition(
          this.stockZone.waste.cards,
          this.piles,
          this.foundations
        )
      ) {
        alert("Alas, you lost");
      }
      this.stockZone.returnCardsToStock();
    }
  }
}
