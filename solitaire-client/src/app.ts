import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import {
  clearScreen,
  InteractiveBackground,
  test,
} from "./utils";
import { CardContainer } from "./CardContainer";
import { CANVAS_WIDTH, CARD_HEIGHT, CARD_SCALE, CARD_WIDTH } from "./constants";
import { Foundations } from "./FoundationsZone";
import { Card } from "./Card";
import { Suits } from "./constants";
import { StockZone } from "./StockZone";
import { Container, Point, TARGETS } from "pixi.js";
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
    test();

 // ~~~~~~~~~~~  create Stock Zone  ~~~~~~~~~~~~~~~~~~~~~~~~
 const card12 = new Card(null, Suits.null);
 card12.placeCardReverse(0, 0);

  const card13 = new Card(null, Suits.null);
  card13.placeCardReverse(0, 0);

  // const card14 = new Card("A", Suits.diamonds);
  // card14.placeCardReverse(0, 0);

  // const card15 = new Card("2", Suits.diamonds);
  // card15.placeCardReverse(0, 0);

  // const card16 = new Card("3", Suits.hearts);
  // card16.placeCardReverse(0, 0);

  const StockZon = new StockZone([card12, card13]);
  //const StockZon = new StockZone([card14, card15, card16]);
  
  
  // ~~~~~~~~~~~  move to Foundation Zone  ~~~~~~~~~~~~~~~~~~~~~~~~
  
  //clubFoundation.addCard(card14)
  //container.removeCardFromContainer(card6)

  //---------------------------------------------------------------

  
  const card2 = new Card("Q", Suits.hearts);

  const card3 = new Card("A", Suits.clubs);
    
  const card6 = new Card("A", Suits.spades);
    card6.showFace();
    card3.showFace();
    card2.showFace();
    const container = new CardContainer(1);
    const next = new Card("J", Suits.spades);
    next.showFace();
    container.addCards([card2, card3, next, card6]);
    


    


    const card7 = new Card("7", Suits.clubs);
    const card8 = new Card("10", Suits.diamonds);
    const card9 = new Card("K", Suits.spades);
    card9.showFace();
    const container2 = new CardContainer(3);
    console.log(container2.staticContainer);
   

    container2.addCards([card7, card8, card9]);

    app.ticker.add(update);

    function update(time) {
      const allContainers = [container, container2];
      const starting = allContainers.find(
        (container) => container.dragging == true
      );
      if (starting && starting.dragging) {
        const others = allContainers.filter((c) => c != starting);
        for (let i = 0; i < others.length; i++) {
          const target = others[i];
          if (isOverlapping(starting, target)) {
            starting.draggableContainer.position.set(
              target.staticContainer.position.x,
              target.staticContainer.position.y
            );
            merge(starting, target);
            break;
          }
        }
      }
    }

    function merge(starting: CardContainer, target: CardContainer) {
      const cardsToMove = starting.draggableContainer.children;
      const x = starting.cards.splice(
        starting.cards.length - cardsToMove.length,
        cardsToMove.length
      );
      target.addCards(x);
      starting.dragging = false;
      starting.draggableContainer.position.set(
        starting.staticContainer.x,
        starting.staticContainer.y
      );
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

  function showInit() {
    initSection.style.display = "block";
    gameSection.style.display = "none";
  }
}
