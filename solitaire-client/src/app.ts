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
import { CANVAS_WIDTH, CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { Foundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";
import { StockZone } from "./StockZone";
import { TARGETS } from "pixi.js";
import { loadFoundationsEmptyCards, loadStockEmptyCard } from "./cardsTexture";

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

  loadFoundationsEmptyCards();
  test();

  // const card = new Card("K", Suits.hearts);
  // const card2 = new Card("Q", Suits.hearts);
  // const card3 = new Card("A", Suits.clubs);
  // const container1 = new CardContainer(2);

  // container1.addCards([card, card2, card3]);
}

function start() {
  // let rect = app.view.getBoundingClientRect();
  // console.log("rect", rect.x, rect.y);

  // Create Cards Deck
  createDeckAssets();
  loadFoundationsEmptyCards();
  loadStockEmptyCard();

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

    // test();
    const card2 = new Card("Q", Suits.hearts);

    const card3 = new Card("A", Suits.clubs);

    const card6 = new Card("8", Suits.spades);
    card6.showFace();
    const container = new CardContainer(2);
    const next = new Card("J", Suits.spades);
    container.addCards([card2, card3, next, card6]);

    const card7 = new Card("7", Suits.clubs);
    const card8 = new Card("10", Suits.diamonds);
    const card9 = new Card("K", Suits.spades);
    card9.showFace();
    const container2 = new CardContainer(7);
    console.log(container2.staticContainer);

    container2.addCards([card7, card8, card9]);

    app.ticker.add(update);

    function update() {
      const allContainers = [container, container2];
      const starting = allContainers.find(
        (container) => container.dragging == true
      );
      if (starting) {
        const others = allContainers.filter((c) => c != starting);
        for (let i = 0; i < others.length; i++) {
          const target = others[i];
          if (isOverlapping(starting, target)) {
            // dragging.staticContainer.removeChild(
            //   ...dragging.draggableContainer.children
            // );
            target.addCards(starting.draggableContainer.children as Card[]);
            console.log("in update:");
            console.log("starting:", starting);
            console.log("target: ", target);
            if (isAnimationOver(target)) {
              // starting.staticContainer.removeChild(
              //   ...starting.draggableContainer.children
              // );
              starting.cards = target.cards.filter((c) =>
                starting.draggableContainer.children.includes(c)
              );

              starting.dragging = false;

              //dragging.draggableContainer.removeChildren(); ///
              //dragging.returnDraggableContainer();
              //dragging.draggableContainer.destroy();
            }
            console.log("starting over", starting, "children:", starting.cards);
            console.log("target over", target, "chidren:", target.cards);
            break;
          }
        }
      }
    }
    function isOverlapping(dragging: CardContainer, target: CardContainer) {
      return (
        dragging &&
        target &&
        dragging.draggableContainer.position.x >=
          target.staticContainer.position.x - (CARD_WIDTH * CARD_SCALE) / 2 &&
        dragging.draggableContainer.position.x <=
          target.staticContainer.position.x + (CARD_WIDTH * CARD_SCALE) / 2
      );
    }
  }
  function isAnimationOver(target) {
    const lastchildX =
      target.staticContainer.children[
        target.staticContainer.children.length - 1
      ].x;
    const firstChildX = target.staticContainer.children[0].x;
    return lastchildX == firstChildX;
  }

  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
}

function showInit() {
  throw new Error("Function not implemented.");
}
