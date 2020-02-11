import {Actor, Color, Engine, GameEvent, Scene, Util, Vector} from "excalibur";
import {PointerEvent} from "excalibur/dist/Input/Pointer";
import glowLabel from "../glow-label";
import {labelDefaults} from "../index";
import playMusic from "../music/music";
import resources from "../resources";
import Background from "./background";
import Crops from "./crops";
import GeigerCounter from "./geiger-counter";
import Nuke from "./nuke";
import NukeFlash from "./nuke-flash";
import Rabbit from "./rabbit";
import Reticle from "./reticle";
import Vignette from "./vignette";

enum State {
    intro,
    play,
    end
}

const START_MESSAGE = "These darn rabbits are eating all of Farmer Bill's crops! He needs you to help deal with them.";
const CROPS_MESSAGE = "The rabbits ate all the crops.";
const CROPS_NUKED_MESSAGE = "There is nothing left for the survivors to eat.";
const DOOMED_MESSAGE = "Oh the humanity! You've doomed mankind.";

const NUKE_COOLDOWN_MILLIS = 1000;

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
    private readonly vignette = new Vignette();
    private readonly geigerCounter = new GeigerCounter({
        pos: new Vector(60, 50),
        visible: false
    });

    private state: State = State.intro;
    private spawnRate: number = 0.02;
    private nuked: boolean = false;
    private nukeCooldown: number = 0;
    private readonly nuke = new Nuke();
    private readonly nukeFlash = new NukeFlash();
    private readonly nuclearWind = resources.nuclearWind;

    constructor(private readonly engine: Engine) {
        super(engine);
    }

    public onInitialize(engine: Engine): void {
        this.add(this.background);
        this.addUIActor(this.vignette);
        this.addUIActor(this.crops);
        this.addUIActor(this.geigerCounter);
        this.addUIActor(this.messageLabel);
        this.addUIActor(this.continueLabel);
        this.addUIActor(this.gameOverLabel);
        this.addUIActor(this.reticle);

        this.add(this.nuke);
        this.add(this.nukeFlash);

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
        this.background.state = "pre";
        this.spawnRate = 0.02;
        this.nuked = false;
        this.geigerCounter.visible = false;
        this.geigerCounter.rads = 0;
        this.vignette.visible = false;

        this.engine.input.pointers.primary.once("down", () => this.statePlay());
    }

    public onDeactivate(): void {
        this.gameOverLabel.visible = false;
        this.gameOverLabel.kill();
        this.rabbits.forEach(rabbit => rabbit.kill());
        this.nuclearWind.instances.forEach(snd => snd.stop());
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.nukeCooldown > 0) {
            this.nukeCooldown -= delta;
        }

        if (this.state === State.play) {
            if (Math.random() < this.spawnRate) {
                this.spawnRabbit();
            }

            // Increase spawn rate over time, capped at 0.3
            this.spawnRate = Math.min(this.spawnRate + (delta * 0.000003), 0.3);

            // Test lose conditions
            if (this.crops.value <= 0 || this.geigerCounter.rads >= 0.95) {
                this.messageLabel.text = this.crops.value <= 0
                    ? this.nuked ? CROPS_NUKED_MESSAGE : CROPS_MESSAGE
                    : DOOMED_MESSAGE;
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

        this.engine.input.pointers.primary.on("down", this.nukeRabbits);
    }

    private stateEnd(): void {
        this.state = State.end;

        this.messageLabel.visible = true;
        this.continueLabel.visible = true;
        this.gameOverLabel.visible = true;

        this.reticle.visible = false;
        this.engine.canvas.style.cursor = "default";

        this.engine.input.pointers.primary.off("down", this.nukeRabbits);
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

    private readonly nukeRabbits = (evt: GameEvent<any>) => {
        if (this.nukeCooldown > 0) {
            return;
        }

        if (!this.nuked) {
            this.nuked = true;
            this.vignette.visible = true;
            this.background.state = "post";
            this.geigerCounter.visible = true;

            this.nuclearWind.loop = true;
            this.nuclearWind.play(0.6)
                .then(() => void 0, (err) => console.log("", err));

            playMusic("sad");
        }

        this.nukeCooldown = NUKE_COOLDOWN_MILLIS;
        this.geigerCounter.rads += 0.35;
        this.nuke.detonate((evt as PointerEvent).worldPos);
        this.nukeFlash.flash();
        this.rabbits.forEach(rabbit => rabbit.die());
    }
}