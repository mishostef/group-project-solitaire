import { Connection } from './Connection';
interface move {
    action: "flip" | "take" | "place",
    source: "stock" | "waste" | "piles" | "foundations"
    target: null,
    index: number
}

interface Card {
    face: string,
    suit: string
}

interface FlipResponse {
    type: "card" | "empty" | "reset",
    card: Card
}

export class GameController {
    connection: Connection;
    connectionOpen: boolean
    statePromiseResolve;
    flipPromiseResolve;

    state = {};
    move:move = {
        action: "flip",
        source: "stock",
        target: null,
        index: 0
    };


    constructor(connection: Connection) {
        this.connection = connection;
    }

    async openConnection() {
        if (this.connectionOpen) {
            return true;
        }

        await this.connection.open();
        this.connectionOpen = true;

        console.log("connection open");

        this.connection.on("state", state => {
            if (this.statePromiseResolve != null) {
                this.statePromiseResolve(state);
                this.statePromiseResolve = null;
            }
        });

        this.connection.on("moveResult", data => {
            console.log("moveResult: ", data);
            if (data.hasOwnProperty('face')) {
                // flip command detected
                console.log("FLIP");

                if (this.flipPromiseResolve != null) {
                    this.flipPromiseResolve(this.getFlipResponse(data));
                    this.flipPromiseResolve = null;
                }
            }
        });
    }

    private getFlipResponse(data): FlipResponse {
        // todo: empty and reset stock
        
        let response: FlipResponse = {
            type: "card",
            card: {
                face: data.face,
                suit: data.suit
            }
        };

        console.log("GET flip Response", response)

        return response;
    }

    setState(state) {
        console.log("state in gameController:", state)
        this.state = state;
    }

     getState() {

        console.log("getSTATE", this.state)
        return this.state;
        
    }

    setReceivedMoves(moves) {
        // console.log("Received moves in gameController", moves)
        // console.log("Stock in gameController", moves.stock.flip)

    }

    flipResponse(data) {

        console.log("DATA", data)
        
    }

    moveResponse() {

    }

    ///////////////////////////////////

    async startNewGame() {
        console.log("START NEW GAME!!!!!");
        await this.openConnection();
        console.log("Connection open!!!!!");
        this.connection.send("startGame");
        console.log("newGame sent to server!!!!!");
        
        return new Promise(function(resolve) {
            console.log("inside promise!!!!!");
            this.statePromiseResolve = resolve;

        }.bind(this));
    }

    async flip(): Promise<FlipResponse> {
        console.log("Flip called");
        await this.openConnection();

        let flipMove = {
            action: "flip",
            source: "stock",
            target: null,
            index: 0
        };

        this.connection.send("move", flipMove);

        return new Promise(function(resolve) {
            console.log("inside flip promise!!!!!");
            this.flipPromiseResolve = resolve;
        }.bind(this));
    }

}