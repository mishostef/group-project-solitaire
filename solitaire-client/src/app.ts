import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { createBox, getMask, turnCard } from "./utils";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

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

export function test() {
  const board = document.getElementById("board");
  const app = new PIXI.Application({
    width: 800,
    height: 600,
  });
  board.appendChild(app.view as HTMLCanvasElement);
  const front = createBox(300, 300, 0xa777aa, 50, 100);
  const back = createBox(300, 300, 0xe777e, 50, 100);
  const masked = createBox(300, 500, 0xaa55555, 100, 100);
  
  const mask = getMask(300,500, 5);
  app.stage.addChild(mask);

  masked.mask = mask;
  app.stage.addChild(masked);
  
  app.stage.addChild(front);
  app.stage.addChild(back);
  turnCard(back, front);
}

function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}
