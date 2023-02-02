import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import {
  clearScreen,
  createDeckAssets,
  InteractiveBackground,
  test,
} from "./utils";
import { CardContainer } from "./CardContainer";
import { CARD_SCALE } from "./constants";
import { Foundations, loadFoundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";
import { StockZone } from "./StockZone";
import { StockZone2 } from "./StockZone2";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: 1800,
  height: 1800,
  background: 0x999999,
});

document.body.appendChild(app.view as HTMLCanvasElement);
app.stage.sortableChildren = true;

// Create Cards Deck
createDeckAssets();

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

function showBoard() {
  initSection.style.display = "none";
  gameSection.style.display = "block";

   loadFoundations();
   test();

  const card = new Card("K", Suits.hearts);
  //clearScreen(app);
  //loadFoundations();
  //card.placeCardReverse(300, 300);
  const card2 = new Card("Q", Suits.hearts);
  //card2.placeCard(500, 500);
  const card3 = new Card("A", Suits.clubs);
 //const container = new CardContainer(2, [card, card2, card3]);
 // app.stage.addChild(container.draggableContainer);

  // app.stage.addChild(container.draggableContainer);
  const next = new Card("J", Suits.spades);
  //container.addCards([next]);
  const stockZone = new StockZone([card, card2, next]);


  const card4 = new Card("6", Suits.clubs);
  card4.placeCardReverse(0, 0);
  
  const card5 = new Card("7", Suits.hearts);
  card5.placeCardReverse(0, 0);
  
  const card6 = new Card("8", Suits.spades);
  card6.placeCardReverse(0, 0);

  const StockZon = new StockZone2([card4, card5, card6]);




}
function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}
