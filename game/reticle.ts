import {Actor, Engine, SpriteSheet} from "excalibur";
import resources from "../resources";

const spriteSheet = new SpriteSheet({
    image: resources.reticle,
    spWidth: 32,
    spHeight: 32,
    rows: 1,
    columns: 2
});

export default class Reticle extends Actor {
    public onInitialize(engine: Engine): void {
        this.addDrawing("blink", spriteSheet.getAnimationByIndices(engine, [0, 1], 500));
        this.setDrawing("blink");
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.pos = engine.input.pointers.primary.lastWorldPos;
    }
}
