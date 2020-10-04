import {Actor, Animation, Engine, Sound, SpriteSheet, Util, Vector} from "excalibur";
import resources from "../resources";

const spriteSheet = new SpriteSheet({
    image: resources.nuke,
    spWidth: 320,
    spHeight: 240,
    rows: 2,
    columns: 5
});

export default class Nuke extends Actor {
    private anim?: Animation;
    private sound: Sound = resources.blast;

    public onInitialize(engine: Engine): void {
        this.anim = spriteSheet.getAnimationForAll(engine, 83);
        this.anim.loop = false;
        this.addDrawing("nuke", this.anim);
        this.setDrawing("nuke");
        this.visible = false;

        this.setZIndex(engine.canvasHeight - 1);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.anim?.isDone()) {
            this.visible = false;
        }
    }

    public detonate(pos: Vector): void {
        this.pos = new Vector(pos.x, Util.clamp(pos.y, 180, 240) - 80);
        this.anim?.reset();
        this.visible = true;
        this.sound.instances.forEach(snd => snd.stop());
        void this.sound.play(0.25);
    }
}
