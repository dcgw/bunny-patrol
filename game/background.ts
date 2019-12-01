import {Actor, Engine, SpriteSheet} from "excalibur";
import resources from "../resources";

const spriteSheet = new SpriteSheet({
    image: resources.background,
    spWidth: 320,
    spHeight: 240,
    rows: 1,
    columns: 2
});

export default class Background extends Actor {

    public onInitialize(engine: Engine): void {
        this.addDrawing(spriteSheet.getSprite(0));
    }
}