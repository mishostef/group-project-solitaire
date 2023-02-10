import { Connection } from "./Connection";
import { Game } from "./Game";

const actionSection = document.getElementById("action");
const boardSection = document.getElementById("board");

export function engine(connection: Connection) {
  const state = {};

  actionSection.innerHTML = "";
  boardSection.innerHTML = "";

  connection.on("state", onState);
  connection.on("moves", onMoves);
  connection.on("moveResult", onResult);
  connection.on("victory", onVictory);
  
  function onState(state) {
    console.log("received state", state);
    const game = new Game(state);
  }

  function onMoves(receivedMoves) {
    console.log("received moves", receivedMoves);
    // mergeMoves();
  }

  function onResult(data) {
    console.log("on result moves:", data);
  }
  function onVictory() {
    alert("Victory!");
    connection.send("newGame");
  }
}
