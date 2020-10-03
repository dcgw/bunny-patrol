import {Actor, Animation, Engine, Sound, SpriteSheet, Util} from "excalibur";
import {ActorArgs} from "excalibur/dist/Actor";
import resources from "../resources";
import Game from "./game";

const rabbitSpriteSheet = new SpriteSheet({
    image: resources.rabbit,
    spWidth: 24,
    spHeight: 24,
    rows: 1,
    columns: 7
});

const mutantSpriteSheet = new SpriteSheet({
    image: resources.mutantRabbit,
    spWidth: 32,
    spHeight: 32,
    rows: 1,
    columns: 7
});

export default class Rabbit extends Actor {

    public active = false;

    private readonly baseSpeed: number;
    private hopSpeed = 5;
    private hopAnim?: Animation;
    private hopSound: Sound = resources.hop1;

    public constructor(config: ActorArgs, private readonly type: "normal" | "mutant" = "normal") {
        super(config);
        this.baseSpeed = type === "normal" ? 1 : 1.5;
    }

    public onInitialize(engine: Engine): void {
        const spriteSheet = this.type === "normal" ? rabbitSpriteSheet : mutantSpriteSheet;

        this.addDrawing("sit", spriteSheet.getAnimationByIndices(engine, [0, 1], 166));
        this.setDrawing("sit");

        this.addDrawing("dead", resources.rabbitSplat.asSprite());

        this.hopAnim = spriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6], 83);
        this.hopAnim.loop = false;
        this.addDrawing("hop", this.hopAnim);

        this.hopSound = [resources.hop1, resources.hop2, resources.hop3][Util.randomIntInRange(0, 2)];

        this.setZIndex(this.pos.y);

        this.on("exitviewport", (evt) => {
            (evt.target.scene as Game).eatCrops();
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
        void this.hopSound.play();
    }
}