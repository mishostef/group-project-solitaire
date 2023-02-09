import { Connection } from "./Connection";
import { Game } from "./Game";

const actionSection = document.getElementById("action");
const boardSection = document.getElementById("board");

export function engine(connection: Connection) {
  const state = {};

  actionSection.innerHTML = "";
  boardSection.innerHTML = "";

  connection.on("state", onState);

  function onState(state) {
    console.log("received state", state);
    const game = new Game(state);
  }
}


