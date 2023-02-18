import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";

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

  function showBoard() {
    initSection.style.display = "none";
    gameSection.style.display = "block";
  }

  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
}
