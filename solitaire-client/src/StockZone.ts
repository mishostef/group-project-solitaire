import { GameController } from "./GameController";
import { ICard, IStock } from "./interfaces";
import * as PIXI from "pixi.js";
import { app } from "./app";
import { Card } from "./Card";
import {
  cardMap,
  cardsConstants,
  CARD_HEIGHT,
  CARD_SCALE,
  CARD_WIDTH,
  Suits,
} from "./constants";
import { gsap } from "gsap";

export class StockZone {
  gameController: GameController;
  state;
  stockFromServer = [];
  newStock = [];
  stockContainer = new PIXI.Container();
  move = {};
  repeatCard: PIXI.Sprite;
  reverse = true;
  waste: Card[] = [];
  countCreateStockContainer = 0;

  constructor(gameController) {
    this.gameController = gameController;

    this.state = this.gameController.getState();
    this.stockFromServer = this.state.stock.cards;

    console.log("Stock Cards", this.stockFromServer);

    this.loadRepeatCard();

    this.createStockContainer(this.stockFromServer);
  }

  createStockContainer(stock) {
    for (let i = 0; i <= stock.length - 1; i++) {
      const card = new Card(
        this.stockFromServer[i].face,
        this.stockFromServer[i].suit
      );
      this.newStock.push(card);
    }

    this.waste = [];

    let index = 1;
    let stockRemaining: Card[];

    this.repeatCard.interactive = true;
    this.repeatCard.on("pointertap", () => {
      if (stockRemaining.length > 0) {
        this.repeatStock();
      }
    });

    for (let i = 0; i <= this.newStock.length - 1; i++) {
      // if (stock[i].x === 100 || stock[i].x === 0) {
      //   stock[i].movedFromStock = false;
      // } else {
      //   stock[i].movedFromStock = true;
      // }

      stockRemaining = stock.filter((card) => card.movedFromStock === false);

      if (this.newStock[i].movedFromStock === false) {
        this.newStock[i].interactive = true;
        this.newStock[i].placeCardReverse(100, 100);

        this.newStock[i].on("pointertap", async (e) => {
          this.newStock[i].zIndex = index;
          index++;

          this.newStock[i].movedFromStock = true;

          // stock[i].face = "A";
          // stock[i].suit = Suits.diamonds;

          this.moveToWaste(this.newStock[i], index);

          console.log("Waste: ", this.waste);
        });
      }
    }

    this.countCreateStockContainer++;
  }

  async moveToWaste(card: Card, index) {
    console.log("pointertap: ", this.gameController);
    let flipResponse = await this.gameController.flip();
    console.log("stockZone flipResponse: ", flipResponse);

    //if (this.countCreateStockContainer == 1) {

    //card.changeFaceAndSuit(flipResponse.card.face, flipResponse.card.suit, 200, 100);

    console.log("WWWWWW", card.suit, card.face);

    // }
    this.waste.push(card);

    card.zIndex = index;

    const duration = 0.5;
    const tl = gsap.timeline();
    tl.to(card, {
      pixi: { x: 200, y: 100 },
      duration,
      onStart: () => card.showFace(0.5),
    });
  }

  repeatStock() {
    let index = 1;
    this.waste.forEach((card) => {
      const tl = gsap.timeline();
      tl.to(card, {
        pixi: { x: 100, y: 100 },
        duration: 2,
        onStart: () => card.showBack(),
      });

      card.zIndex = index;
      index++;

      card.movedFromStock = false;
      this.stockFromServer.push(card);
    });

    this.waste = [];
    this.createStockContainer(this.stockFromServer);
  }

  loadRepeatCard() {
    const repeatTexture = PIXI.Texture.from("assets/repeat.png");
    this.repeatCard = new PIXI.Sprite(repeatTexture);
    this.repeatCard.scale.set(CARD_SCALE);
    this.repeatCard.position.set(100, 100);
    this.repeatCard.anchor.set(0.5);
    this.repeatCard.zIndex = -1;
    app.stage.addChild(this.repeatCard);
  }
}
