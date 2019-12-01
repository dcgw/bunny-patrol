import {Actor, Engine, Scene, SpriteSheet} from "excalibur";
import resources from "../resources";

const spriteSheet = new SpriteSheet({
    image: resources.reticle,
    spWidth: 32,
    spHeight: 32,
    rows: 1,
    columns: 2
});

export default class Reticle extends Actor {

    private engine?: Engine;

    public onInitialize(engine: Engine): void {
        this.addDrawing("blink", spriteSheet.getAnimationByIndices(engine, [0, 1], 500));
        this.setDrawing("blink");

        this.engine = engine;
        this.showCursor(false);
    }

    public unkill(): void {
        super.unkill();
        this.showCursor(false);
    }

    public onPostKill(scene: Scene): void {
        this.showCursor(true);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        this.pos = engine.input.pointers.primary.lastWorldPos;
    }

    private showCursor(show: boolean): void {
        if (!this.engine) {
            return;
        }
        this.engine.canvas.style.cursor = show ? "default" : "none";
    }
}