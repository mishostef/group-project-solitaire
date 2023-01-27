import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { createBox, turnCard } from "./utils";

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
}

function showInit() {
  initSection.style.display = "block";
  gameSection.style.display = "none";
}
