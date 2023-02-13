import { GameController } from './GameController';
import { Connection } from "./Connection";
import { Game } from "./Game";

const actionSection = document.getElementById("action");
const boardSection = document.getElementById("board");

export function engine(connection: Connection) {
  const state = {};
  const gameController = new GameController(connection);
  
 // const game = new Game();
 // game.connectionMessages(connection)
  

  actionSection.innerHTML = "";
  boardSection.innerHTML = "";

  connection.on("state", onState);
  connection.on("moves", onMoves);
  connection.on("moveResult", onResult);
  connection.on("victory", onVictory);
  const game = new Game(cb);

  function onClick() {

  }

  function onState(state) {
    console.log("received state", state);
    game.processState(state);
    gameController.setState(state);

    
  }

  function onMoves(receivedMoves) {
    console.log("received moves", receivedMoves);
    game.processMoves(receivedMoves);
    gameController.setReceivedMoves(receivedMoves)

  }

  function onResult(data) {
    console.log("on result moves:", data);
    gameController.flipResponse(data);
    game.data = data;
  }
  function onVictory() {
    alert("Victory!");
    connection.send("newGame");
  }
  function cb(move) {
    connection.send("move", move);
  }
}
