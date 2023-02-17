import { Connection } from './Connection';
type action = "flip" | "take" | "place";
type source = "stock" | "waste" | "foundations" | "pile0" | "pile1" | "pile2" | "pile3" | "pile4" | "pile5" | "pile6" ;
type target =  null | "stock" | "waste" | "foundations" | "pile0" | "pile1" | "pile2" | "pile3" | "pile4" | "pile5" | "pile6";
interface move {
    action: action,
    source: source
    target: target,
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
    placePromiseResolve;
    flipData;
    placeData;

    state = {};

    
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

            if (data !== null && data.hasOwnProperty('face')) {
                // flip command detected
                console.log("FLIP");

                if (this.flipPromiseResolve != null) {
                    this.flipPromiseResolve(this.getFlipResponse(data));
                    this.flipPromiseResolve = null;
                }
            } 

            if (data == true) {
                console.log("Successful move");
                this.resolvePlacePromise(data);
            }

            if (data == false) {
                console.log("Invalid move");
                this.resolvePlacePromise(data);
                
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
    
    
    async flip(source: source, index: number): Promise<FlipResponse> {
        
        console.log("Flip called");
       // await this.openConnection();
        
        let flipMove: move = {
            action: "flip",
            source: source,
            target: null,
            index: 0
        };
        
        this.connection.send("move", flipMove);
        
        return new Promise(function(resolve) {
            console.log("inside flip promise!!!!!");
            this.flipPromiseResolve = resolve;
        }.bind(this));
    }


    async placeCard(source: source, target: target, index: number) {
        console.log("Place card called");
        
       // await this.openConnection();
        
        let placeCardMove: move = {
            action: "place",
            source: source,
            target: target,
            index: index
        };
        
        this.connection.send("move", placeCardMove);
        console.log("Place card called 2", placeCardMove);

        return new Promise(function(resolve) {
            console.log("inside place promise!!!!!");
            this.placePromiseResolve = resolve;
        }.bind(this));
        
    }

    private resolvePlacePromise(result) {
        if (this.placePromiseResolve != null) {
            this.placePromiseResolve(result);
            this.placePromiseResolve = null;
        }
    }

}