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

    public set state(state: "pre" | "post") {
        this.setDrawing(state);
    }

    public onInitialize(engine: Engine): void {
        this.addDrawing("pre", spriteSheet.getSprite(0));
        this.addDrawing("post", spriteSheet.getSprite(1));
        this.setDrawing("pre");
    }
}