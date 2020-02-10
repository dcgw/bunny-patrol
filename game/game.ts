import {Actor, Color, Engine, Scene, Util, Vector} from "excalibur";
import glowLabel from "../glow-label";
import {labelDefaults} from "../index";
import Background from "./background";
import Crops from "./crops";
import Rabbit from "./rabbit";
import Reticle from "./reticle";

enum State {
    intro,
    play,
    end
}

const START_MESSAGE = "These darn rabbits are eating all of Farmer Bill's crops! He needs you to help deal with them.";
const CROPS_MESSAGE = "The rabbits ate all the crops.";
// const CROPS_NUKED_MESSAGE = "There is nothing left for the survivors to eat.";
// const DOOMED_MESSAGE = "Oh the humanity! You've doomed mankind.";

export default class Game extends Scene {

    private readonly messageLabel = glowLabel({
        ...labelDefaults,
        text: START_MESSAGE,
        pos: new Vector(160, 50),
        wrapWidth: 260,
        lineHeight: 25
    });

    private readonly continueLabel = glowLabel({
        ...labelDefaults,
        text: "Click to Continue",
        pos: new Vector(160, 200),
        color: Color.fromHex("993333")
    });

    private readonly gameOverLabel = glowLabel({
        ...labelDefaults,
        text: "GAME OVER",
        pos: new Vector(160, 120),
        fontSize: 28,
        color: Color.fromHex("333399"),
        visible: false
    });

    private readonly background = new Background({
        anchor: Vector.Zero
    });
    private readonly crops = new Crops({
        pos: new Vector(280, 30)
    });
    private readonly reticle = new Reticle({
        visible: false
    });

    private state: State = State.intro;

    constructor(private readonly engine: Engine) {
        super(engine);
    }

    public onInitialize(engine: Engine): void {
        this.add(this.background);
        this.addUIActor(this.crops);
        this.addUIActor(this.messageLabel);
        this.addUIActor(this.continueLabel);
        this.addUIActor(this.gameOverLabel);
        this.addUIActor(this.reticle);

        this.on("eatcrops", () => this.crops.value--);
    }

    public onActivate(): void {
        this.state = State.intro;
        this.messageLabel.text = START_MESSAGE;

        this.messageLabel.visible = true;
        this.continueLabel.visible = true;
        this.reticle.visible = false;

        // Spawn starting rabbits
        for (let i = 0; i < 4; i++) {
            this.add(new Rabbit({
                pos: new Vector(Util.randomIntInRange(50, 250), Util.randomIntInRange(170, 220))
            }));
        }

        this.crops.value = 10;

        this.engine.input.pointers.primary.once("down", () => this.statePlay());
    }

    public onDeactivate(): void {
        this.gameOverLabel.visible = false;
        this.gameOverLabel.kill();
        this.rabbits.forEach(rabbit => rabbit.kill());
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.state === State.play) {
            if (Math.random() < 0.009) {
                this.spawnRabbit();
            }

            if (this.crops.value <= 0) {
                this.messageLabel.text = CROPS_MESSAGE;
                this.stateEnd();
            }
        }
    }

    private statePlay(): void {
        this.state = State.play;
        this.messageLabel.visible = false;
        this.continueLabel.visible = false;

        this.reticle.visible = true;
        this.engine.canvas.style.cursor = "none";

        this.rabbits.forEach(rabbit => rabbit.active = true);

        this.engine.input.pointers.primary.on("down", this.onClick);
    }

    private stateEnd(): void {
        this.state = State.end;

        this.messageLabel.visible = true;
        this.continueLabel.visible = true;
        this.gameOverLabel.visible = true;

        this.reticle.visible = false;
        this.engine.canvas.style.cursor = "default";

        this.engine.input.pointers.primary.off("down", this.onClick);
        this.engine.input.pointers.primary.once("down", () => this.engine.goToScene("title"));
    }

    private spawnRabbit(): void {
        const rabbit = new Rabbit({
            pos: new Vector(-16, Util.randomIntInRange(170, 220)),
            isOffScreen: true
        });
        rabbit.active = true;
        this.add(rabbit);
    }

    get rabbits(): Rabbit[] {
        return this.actors.filter((actor: Actor): actor is Rabbit => actor instanceof Rabbit);
    }

    private readonly onClick = () => {
        this.rabbits.forEach(rabbit => rabbit.die());
    }
}