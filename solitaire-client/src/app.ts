import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { createBox, getMask, turnCard } from "./utils";



gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);


const app = new PIXI.Application({
    width: 1800, 
    height: 1800,
    background: 0x999999
});


document.body.appendChild(app.view as HTMLCanvasElement);


const spritesheet = PIXI.BaseTexture.from('assets/22331.jpg');

const width = 410;
const height = 620;
const scale = 0.2;

const clubs = [];
sliceDeck(clubs, 47, 847, 50);

const hearts = [];
sliceDeck(hearts, 47, 1507, 200);

const spades = [];
sliceDeck(spades, 47, 2167, 350);

const diamonds = [];
sliceDeck(diamonds, 47, 2827, 500);


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


function sliceCard(x: number, y: number, w:  number, h: number) {
    
    const cardTexture = new PIXI.Texture(spritesheet, new PIXI.Rectangle(x, y, w, h));
    const card = new PIXI.Sprite(cardTexture);
    card.scale.set(scale);
    
    app.stage.addChild(card);
     
    return card;
}


function sliceDeck(arr, x: number, y: number, row) {
    for ( let i = 0; i < 13; i++) {
        
        const card = sliceCard(x + (i*width) + (i * 48) + i/2, y, width, height);
        
        card.position.set(20 + (i*100), row);
        arr.push(card)

        const mask = new PIXI.Graphics();
        mask.beginFill(0);
        mask. drawRoundedRect(5, 5, width-8, height-5, 45);
        mask.endFill();
        mask.scale.set(scale);
        card.mask = mask;

        app.stage.addChild(mask);
            
        mask.position.set(card.x, card.y);
    
    }

    return arr;

}

//backCard()
function backCard() {

    const cardTexture = new PIXI.Texture(spritesheet);
    const card = new PIXI.Sprite(cardTexture);
    card.scale.set(scale);
    
    app.stage.addChild(card);
     
    return card;

}


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


