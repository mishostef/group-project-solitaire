
import * as PIXI from "pixi.js";
import { CARD_SCALE } from "./constants";
import { app } from "./app";


export function loadFoundations() {
    
    const heartTexture = PIXI.Texture.from("assets/heart.png");
    const heart = new PIXI.Sprite(heartTexture);
    heart.scale.set(CARD_SCALE - 0.01);
    heart.position.set(400, 100)
    heart.anchor.set(0.5);
    app.stage.addChild(heart);
    
    const spadeTexture = PIXI.Texture.from("assets/spade.png");
    const spade= new PIXI.Sprite(spadeTexture);
    spade.scale.set(CARD_SCALE - 0.01);
    spade.position.set(500, 100)
    spade.anchor.set(0.5);
    app.stage.addChild(spade);

    const diamondTexture = PIXI.Texture.from("assets/diamond.png");
    const diamond = new PIXI.Sprite(diamondTexture);
    diamond.scale.set(CARD_SCALE - 0.01);
    diamond.position.set(600, 100)
    diamond.anchor.set(0.5);
    app.stage.addChild(diamond);
    
    const clubTexture = PIXI.Texture.from("assets/club.png");
    const club = new PIXI.Sprite(clubTexture);
    club.scale.set(CARD_SCALE - 0.01);
    club.position.set(700, 100)
    club.anchor.set(0.5);
    app.stage.addChild(club);
    
}
