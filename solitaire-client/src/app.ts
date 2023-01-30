import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { clearScreen, createDeckAssets, test } from "./utils";
import { CardContainer } from "./CardContainer";
import { CARD_SCALE } from "./constans";
import { loadFoundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constans";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: 1800,
  height: 1800,
  background: 0x999999,
});

document.body.appendChild(app.view as HTMLCanvasElement);





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
  clearScreen(app);
  //card.placeCardReverse(300, 300);
  const card2 = new Card("Q", Suits.hearts);
  //card2.placeCard(500, 500);
  const card3 = new Card("A", Suits.clubs);
  const container = new CardContainer(2, [card, card2, card3]);
  app.stage.addChild(container.draggableContainer);
  app.ticker.add(function () {
    const activated = container.cards.find((card) => card.dragging);
    if (activated) {
      console.log(activated);
    }
  });
}

function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}
