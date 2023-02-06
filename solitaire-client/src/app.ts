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
import { CANVAS_WIDTH, CARD_SCALE, CARD_WIDTH } from "./constants";
import { Foundations, loadFoundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";
import { StockZone } from "./StockZone";
import { TARGETS } from "pixi.js";

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
  await PIXI.Assets.load('assets/22331.jpg');
  await PIXI.Assets.load('assets/back.png');
  await PIXI.Assets.load('assets/backAmusnet.png');
  await PIXI.Assets.load('assets/club.png');
  await PIXI.Assets.load('assets/diamond.png');
  await PIXI.Assets.load('assets/heart.png');
  await PIXI.Assets.load('assets/spade.png');
  await PIXI.Assets.load('assets/emptyCard.png');
  await PIXI.Assets.load('assets/repeat.png');

}



function start() {

  let rect = app.view.getBoundingClientRect();
  console.log("rect", rect.x, rect.y);
  
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
    //card3.placeCard(100, 100);
    //   const next = new Card("J", Suits.spades);
    //  const container = new CardContainer(2, [card, card2, card3, next]);
  
    //container.addCards([next]);
    //const stockZone = new StockZone([card, card2, next]);
  
    // const card4 = new Card("6", Suits.clubs);
    // card4.placeCardReverse(0, 0);
  
    // const card5 = new Card("7", Suits.hearts);
    // card5.placeCardReverse(0, 0);
  
    // const card6 = new Card("8", Suits.spades);
    // card6.placeCardReverse(0, 0);
  
    //const StockZon = new StockZone([card4, card5, card6]);
  
    const container = new CardContainer(2, [card, card2, card3]);
    const next = new Card("J", Suits.spades);
    container.addCards([next]);
  
    const card7 = new Card("7", Suits.clubs);
    const card8 = new Card("10", Suits.diamonds);
    const card9 = new Card("K", Suits.spades);
  
    const container2 = new CardContainer(7, [card7, card8]);
    console.log(container2.staticContainer);
    //container2.addCards([card9]);
    // const stockZone = new StockZone([card, card2, next]);
  
    // const card4 = new Card("6", Suits.clubs);
    // card4.placeCardReverse(0, 0);
  
    // const card5 = new Card("7", Suits.hearts);
    // card5.placeCardReverse(0, 0);
  
    // const card6 = new Card("8", Suits.spades);
    // card6.placeCardReverse(0, 0);
  
    // const StockZon = new StockZone2([card4, card5, card6]);
  
    app.ticker.add(update);
    function update() {
      const allContainers = [container, container2];
      const dragging = allContainers.find(
        (container) => container.dragging == true
      );
      if (dragging) {
        const others = allContainers.filter((c) => c != dragging);
        for (let i = 0; i < others.length; i++) {
          if (isOverlapping(dragging, others, i)) {
            dragging.staticContainer.removeChild(
              ...dragging.draggableContainer.children
            );
            others[i].addCards(dragging.draggableContainer.children as Card[]);
            if (isAnimationOver(others, i)) {
              dragging.dragging = false;
              dragging.draggableContainer.removeChildren(); ///
              dragging.returnDraggableContainer();
              console.log("dragging", dragging);
              console.log("target", others[i]);
            }
          }
          break;
        }
      }
    }
  
    function isOverlapping(
      dragging: CardContainer,
      others: CardContainer[],
      i: number
    ) {
      return (
        dragging &&
        others[i] &&
        dragging.draggableContainer.position.x >=
          others[i].staticContainer.position.x - (CARD_WIDTH * CARD_SCALE) / 2 &&
        dragging.draggableContainer.position.x <=
          others[i].staticContainer.position.x + (CARD_WIDTH * CARD_SCALE) / 2
      );
    }
  }
  function isAnimationOver(others: CardContainer[], i: number) {
    if (others[i].staticContainer.children) return true;
    return (
      others[i].staticContainer.children[
        others[i].staticContainer.children.length - 1
      ].x == others[i].staticContainer.children[0].x &&
      others[i].staticContainer.children[
        others[i].staticContainer.children.length - 1
      ].y == others[i].staticContainer.children[0].y
    );
  }
  
  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
  


}


