import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { clearScreen, InteractiveBackground } from "./utils";
import { CardContainer } from "./CardContainer";
import { CANVAS_WIDTH, CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { Foundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";

import { loadFoundationsEmptyCards, loadStockEmptyCard } from "./cardsTexture";
import src from "gsap/src";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: 1800,
  height: 1800,
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

  initForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { nickname } = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    );

    connection = new Connection(nickname as string);
    await connection.open();
    engine(connection);

    showBoard();

    connection.send("startGame");
  });

  document.getElementById("disconnect").addEventListener("click", () => {
    connection?.disconnect();
    showInit();
  });

  const diamondsFoundation = new Foundations(Suits.diamonds);
  const clubFoundation = new Foundations(Suits.clubs);
  const heartsFoundation = new Foundations(Suits.hearts);
  const spadesFoundation = new Foundations(Suits.spades);

  function showBoard() {
    initSection.style.display = "none";
    gameSection.style.display = "block";

    loadFoundationsEmptyCards();
    loadStockEmptyCard();
    //test();

    // ~~~~~~~~~~~  create Stock Zone  ~~~~~~~~~~~~~~~~~~~~~~~~
    // const card12 = new Card(null, Suits.null);
    // card12.placeCardReverse(0, 0);

    // const card13 = new Card(null, Suits.null);
    // card13.placeCardReverse(0, 0);

    // const card14 = new Card(null, Suits.null)
    // card14.placeCardReverse(0, 0);

    // const card15 = new Card(null, Suits.null);
    // card15.placeCardReverse(0, 0);

    // const card16 = new Card("3", Suits.hearts);
    // card16.placeCardReverse(0, 0);

    //const createStockZone = new StockZone(gameController);
    //const StockZon = new StockZone([card14, card15, card16]);

    // ~~~~~~~~~~~  move to Foundation Zone  ~~~~~~~~~~~~~~~~~~~~~~~~

    //clubFoundation.addCard(card14)
    //container.removeCardFromContainer(card6)

    //---------------------------------------------------------------
  }

  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
}
