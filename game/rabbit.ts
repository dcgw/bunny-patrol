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

export interface RabbitOptions extends ActorArgs {
    readonly game: Game;
    readonly type?: "normal" | "mutant";
}

export default class Rabbit extends Actor {
    public active = false;

    private readonly game: Game;
    private readonly type: "normal" | "mutant";
    private readonly baseSpeed: number;
    private hopAnim?: Animation;
    private hopSound: Sound = resources.hop1;

    public constructor(options: RabbitOptions) {
        super(options);
        this.game = options.game;
        this.type = options.type ?? "normal";
        this.baseSpeed = this.type === "normal" ? 1 : 1.5;
    }

    public onInitialize(engine: Engine): void {
        const spriteSheet = this.type === "normal" ? rabbitSpriteSheet : mutantSpriteSheet;

        this.addDrawing("sit", spriteSheet.getAnimationByIndices(engine, [0, 1], 166));
        this.setDrawing("sit");

        this.addDrawing("dead", resources.rabbitSplat.asSprite());

        this.hopAnim = spriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6], 83);
        this.hopAnim.loop = false;
        this.addDrawing("hop", this.hopAnim);

        this.hopSound = [resources.hop1, resources.hop2, resources.hop3][
            Util.randomIntInRange(0, 2)
        ];

        this.setZIndex(this.pos.y);

        this.on("exitviewport", evt => {
            this.game.eatCrops();
            evt.target.kill();
        });
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.currentDrawing === this.hopAnim) {
            if (this.hopAnim.isDone()) {
                this.setDrawing("sit");
                this.hopAnim.reset();
                this.vel.setTo(0, 0);
            }
        } else if (this.active && Math.random() <= 1 - Math.pow(0.98, (delta * 60) / 1000)) {
            this.hop();
        }
    }

    public die(): void {
        this.active = false;
        this.vel.setTo(0, 0);
        this.setDrawing("dead");
        this.setZIndex(this.pos.y - 50);
    }

    private hop(): void {
        this.setDrawing("hop");
        this.vel.setTo((Math.random() * this.baseSpeed * 1.3 + this.baseSpeed) * 60, 0);
        void this.hopSound.play(0.25);
    }
}
