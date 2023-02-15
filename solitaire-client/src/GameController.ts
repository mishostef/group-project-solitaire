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
    takePromiseResolve;
    flipData;

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
            console.log("connection onState", state);
            if (this.statePromiseResolve != null) {
                this.statePromiseResolve(state);
                this.statePromiseResolve = null;
            }
        });
        
        this.connection.on("moveResult", data => {
            console.log("moveResult watch: ", data);
  

            if (data.hasOwnProperty('face')) {
                // flip command detected
                console.log("FLIP");

                if (this.flipPromiseResolve != null) {
                    this.flipPromiseResolve(this.getFlipResponse(data));
                    this.flipPromiseResolve = null;
                }
            }

            if (data == true) {
                console.log("Successful move");

            }

            if (data == false) {
                console.log("Invalid move");

                
            }



        });

    }

    private getFlipResponse(data): FlipResponse {
        // todo: empty and reset stock

        let response: FlipResponse = {
            type: "card",
            card: null
        };

        if (data == null ) {
            response.type = "reset"
        } else {
           response.card = {
            face: data.face,
            suit: data.suit
        }  
        }

        console.log("GET flip Response watch", response)

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
        this.flipData = data
        
    }

    getFlipData() {
        return this.flipData
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


    async takeCard() {
        console.log("Take card called");

        await this.openConnection();

        let takeCardMove = {
            action: "take",
            source: "stock",
            target: null,
            index: 0
        };

        this.connection.send("move", takeCardMove);

        return new Promise(function(resolve) {
            console.log("inside take promise!!!!!");
            this.takePromiseResolve = resolve;
        }.bind(this));
        
    }

}