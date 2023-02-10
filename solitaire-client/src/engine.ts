import { Connection } from "./Connection";
import { Game } from "./Game";

const actionSection = document.getElementById("action");
const boardSection = document.getElementById("board");

export function engine(connection: Connection) {
  const state = {};
  const game = new Game(cb);

  actionSection.innerHTML = "";
  boardSection.innerHTML = "";

  connection.on("state", onState);
  connection.on("moves", onMoves);
  connection.on("moveResult", onResult);
  connection.on("victory", onVictory);

  function onState(state) {
    console.log("received state", state);
    game.processState(state);
  }

  function onMoves(receivedMoves) {
    console.log("received moves", receivedMoves);
    game.processMoves(receivedMoves);
  }

  function onResult(data) {
    console.log("on result moves:", data);
  }
  function onVictory() {
    alert("Victory!");
    connection.send("newGame");
  }
  function cb(move) {
    connection.send("move", move);
  }
}
