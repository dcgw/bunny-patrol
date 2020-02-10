import {Actor, Animation, Engine, GameEvent, Sound, SpriteSheet, Util} from "excalibur";
import resources from "../resources";

const spriteSheet = new SpriteSheet({
    image: resources.rabbit,
    spWidth: 24,
    spHeight: 24,
    rows: 1,
    columns: 7
});

export default class Rabbit extends Actor {

    public active: boolean = false;

    private baseSpeed: number = 1;
    private hopSpeed: number = 5;
    private hopAnim?: Animation;
    private hopSound: Sound = resources.hop1;

    public onInitialize(engine: Engine): void {
        this.addDrawing("sit", spriteSheet.getAnimationByIndices(engine, [0, 1], 166));
        this.setDrawing("sit");

        this.addDrawing("dead", resources.rabbitSplat.asSprite());

        this.hopAnim = spriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6], 83);
        this.hopAnim.loop = false;
        this.addDrawing("hop", this.hopAnim);

        this.hopSound = [resources.hop1, resources.hop2, resources.hop3][Util.randomIntInRange(0, 2)];

        this.setZIndex(this.pos.y);

        this.on("exitviewport", (evt) => {
            evt.target.scene.emit("eatcrops", new GameEvent<any>());
            evt.target.kill();
        });
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.currentDrawing === this.hopAnim) {
            if (this.hopAnim.isDone()) {
                this.setDrawing("sit");
                this.hopAnim.reset();
            } else {
                // Still hopping
                this.pos.x += this.hopSpeed;
            }
        } else if (this.active && Math.random() <= 0.02) {
            this.hop();
        }
    }

    public die(): void {
        this.active = false;
        this.setDrawing("dead");
        this.setZIndex(this.pos.y - 50);
    }

    private hop(): void {
        this.setDrawing("hop");
        this.hopSpeed = (Math.random() * this.baseSpeed * 1.3) + this.baseSpeed;
        this.hopSound.play()
            .then(void 0, err => console.log("", err));
    }
}