import { GameController } from './GameController';
import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { clearScreen, InteractiveBackground } from "./utils";

import { CANVAS_WIDTH, CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { Foundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";
import { StockZone } from "./StockZone";
import src from "gsap/src";
import { Piles } from './Piles';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: 1200,
  height: 1200,
  background: 0x999999,
});

document.body.appendChild(app.view as HTMLCanvasElement);
app.stage.sortableChildren = true;

init().then(start);

async function init() {
  await PIXI.Assets.load("assets/22331.jpg");
  await PIXI.Assets.load("assets/back.png");
  await PIXI.Assets.load("assets/backAmusnet.png");
  await PIXI.Assets.load("assets/club.png");
  await PIXI.Assets.load("assets/diamond.png");
  await PIXI.Assets.load("assets/heart.png");
  await PIXI.Assets.load("assets/spade.png");
  await PIXI.Assets.load("assets/emptyCard.png");
  await PIXI.Assets.load("assets/repeat.png");
}


function start() {

  const initForm = document.querySelector("form");
  const initSection = document.getElementById("init");
  const gameSection = document.getElementById("game");
  
  
  
  let connection = null;
  let gameController = null;
  
  initForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { nickname } = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
      );
      
      connection = new Connection(nickname as string);
      await connection.open();
      //engine(connection);
      
      gameController = new GameController(connection);
      let state = await gameController.startNewGame();
      gameController.setState(state)
      
      showBoard();
      
    
   // connection.send("startGame");
  });

  document.getElementById("disconnect").addEventListener("click", () => {
    connection?.disconnect();
    showInit();
  });

  // const diamondsFoundation = new Foundations(Suits.diamonds);
  // const clubFoundation = new Foundations(Suits.clubs);
  // const heartsFoundation = new Foundations(Suits.hearts);
  // const spadesFoundation = new Foundations(Suits.spades);

  function showBoard() {
    initSection.style.display = "none";
    gameSection.style.display = "block";

    // loadFoundationsEmptyCards();
    // loadStockEmptyCard();

    const createStockZone = new StockZone(gameController);
    const createPiles = new Piles(gameController, createStockZone);
    const createFoundations = new Foundations(gameController, createStockZone, createPiles);

  }

  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
}
