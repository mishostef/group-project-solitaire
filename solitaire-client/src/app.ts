import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);


const app = new PIXI.Application({
    width: 1800, 
    height: 1800,
    background: 0x999999
});


document.body.appendChild(app.view as HTMLCanvasElement);


const spritesheet = PIXI.BaseTexture.from('assets/22331.jpg');


const clubs = [];
sliceDeck(clubs, 47, 847, 50);
console.log(clubs);

const hearts = [];
sliceDeck(hearts, 47, 1507, 200);
console.log(hearts);

const spades = [];
sliceDeck(spades, 47, 2167, 350);
console.log(spades);

const diamonds = [];
sliceDeck(diamonds, 47, 2827, 500);
console.log(diamonds);

function sliceCard(x: number, y: number, w:  number, h: number) {
    
    const cardTexture = new PIXI.Texture(spritesheet, new PIXI.Rectangle(x, y, w, h));
    const card = new PIXI.Sprite(cardTexture);

    gsap.set(card, {pixi: {scale: 0.2}})
    
    app.stage.addChild(card);

  
    return card;
}


function sliceDeck(arr, x: number, y: number, row) {
    const width = 410;
    const height = 623;
    for ( let i = 0; i < 13; i++) {
        
        const startX = x;
        const startY = y;
    
        const card = sliceCard(startX + (i*width) + (i * 48) + i/2, startY, width, height);
        card.position.set(20 + (i*100), row);
        arr.push(card)
    
    }

    return arr;

}