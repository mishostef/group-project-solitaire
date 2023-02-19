import * as PIXI from "pixi.js";
import { BaseCardContainer } from "./cardContainers/BaseCardContainer";
import { CardContainer } from "./cardContainers/CardContainer";
import { StockCardContainer } from "./cardContainers/StockCardContainer";
import { CARD_SCALE } from "./constants";
import { StockZone1 } from "./StockZone1";

export function loadRepeatCard(app) {
  const repeatTexture = PIXI.Texture.from("assets/repeat.png");
  const stockCard = new PIXI.Sprite(repeatTexture);
  stockCard.scale.set(CARD_SCALE);
  stockCard.position.set(0, 100);
  stockCard.anchor.set(0.5);
  stockCard.zIndex = -1;
  app.stage.addChild(stockCard);
  return stockCard;
}

export function createContainer(app, name, rowNumber) {
  let container: any = null;
  if (name === "BaseCardContainer") {
    container = new BaseCardContainer(rowNumber);
  } else if (name === "CardContainer") {
    container = new CardContainer(rowNumber);
  } else if (name === "StockCardContainer") {
    container = new StockCardContainer(rowNumber);
  } else {
    throw new TypeError("Wrong container name");
  }
  app.stage.addChild(container.staticContainer);
  app.stage.addChild(container.draggableContainer);
  return container;
}

export function createStock(app, cb: Function) {
  const stockZone = new StockZone1(cb);
  app.stage.addChild(stockZone.staticContainer);
  app.stage.addChild(stockZone.draggableContainer);
  return stockZone;
}

export function loadFoundationsEmptyCards(app) {
  const foundations = { heart: 600, spade: 700, diamond: 800, club: 900 };
  Object.keys(foundations).forEach((key) => {
    const texture = PIXI.Texture.from(`assets/${key}.png`);
    const symbol = new PIXI.Sprite(texture);
    symbol.scale.set(CARD_SCALE - 0.01);
    symbol.position.set(foundations[key], 100);
    symbol.anchor.set(0.5);
    app.stage.addChild(symbol);
  });
}
