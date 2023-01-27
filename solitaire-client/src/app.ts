import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { clearScreen, createBox, getMask, turnCard } from "./utils";
import { Card } from "./Card";
import { CARD_HEIGHT, CARD_SCALE, CARD_WIDTH, Suits } from "./constans";
import { backCard, sliceDeck } from "./cardsTexture";
import { test } from "./utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: 1800,
  height: 1800,
  background: 0x999999,
});

document.body.appendChild(app.view as HTMLCanvasElement);

// Create Cards Deck

const clubs = [];
sliceDeck(clubs, 47, 847, 50);

const hearts = [];
sliceDeck(hearts, 47, 1507, 200);

const spades = [];
sliceDeck(spades, 47, 2167, 350);

const diamonds = [];
sliceDeck(diamonds, 47, 2827, 500);



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

  test();
}

function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}
