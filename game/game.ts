import {Actor, Color, Engine, Input, Scene, Vector} from "excalibur";
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

const rngRange = (min: number, max: number): number => Math.random() * (max - min) + min;

export default class Game extends Scene {
    private readonly messageLabel = glowLabel({
        ...labelDefaults,
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
        pos: new Vector(280, 30),
        visible: false
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
    private spawnRate = 0.02;
    private nuked = false;
    private nukeCooldown = 0;
    private readonly nuke = new Nuke();
    private readonly nukeFlash = new NukeFlash();

    public constructor(private readonly engine: Engine) {
        super(engine);
    }

    public get rabbits(): Rabbit[] {
        return this.actors.filter((actor: Actor): actor is Rabbit => actor instanceof Rabbit);
    }

    public onInitialize(engine: Engine): void {
        this.add(this.background);
        this.addScreenElement(this.vignette);
        this.addScreenElement(this.crops);
        this.addScreenElement(this.geigerCounter);
        this.addScreenElement(this.messageLabel);
        this.addScreenElement(this.continueLabel);
        this.addScreenElement(this.gameOverLabel);
        this.addScreenElement(this.reticle);

        this.add(this.nuke);
        this.add(this.nukeFlash);
    }

    public eatCrops(): void {
        this.crops.value--;
    }

    public onActivate(): void {
        this.state = State.intro;
        this.messageLabel.text =
            "These darn rabbits are eating all of Farmer Bill's crops! He needs you to help deal with them.";

        this.messageLabel.visible = true;
        this.continueLabel.visible = true;
        this.reticle.visible = false;

        // Spawn starting rabbits
        for (let i = 0; i < 4; i++) {
            this.add(
                new Rabbit({
                    game: this,
                    pos: new Vector(rngRange(50, 250), rngRange(170, 220))
                })
            );
        }

        this.crops.value = 10;
        this.background.state = "pre";
        this.spawnRate = 0.02;

        this.nuke.visible = false;
        this.nuked = false;
        this.geigerCounter.rads = 0;
        this.vignette.visible = false;

        this.engine.input.pointers.primary.once("down", () => this.statePlay());
    }

    public onDeactivate(): void {
        this.gameOverLabel.visible = false;
        this.gameOverLabel.kill();
        this.rabbits.forEach(rabbit => rabbit.kill());

        // Cut short any ongoing effects
        resources.blast.instances.forEach(snd => snd.stop());
        resources.nuclearWind.instances.forEach(snd => snd.stop());
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.nukeCooldown > 0) {
            this.nukeCooldown -= delta;
        }

        if (this.state !== State.play) {
            return;
        }

        if (Math.random() < 1 - Math.pow(1 - this.spawnRate, delta * 60 / 1000)) {
            this.spawnRabbit();
        }

        // Increase spawn rate over time, capped at 0.3
        this.spawnRate = Math.min(this.spawnRate + delta * 0.000003, 0.3);

        // Test lose conditions
        if (this.crops.value <= 0 || this.geigerCounter.rads >= 0.95) {
            this.messageLabel.text =
                this.crops.value <= 0
                    ? this.nuked
                        ? "There is nothing left for the survivors to eat."
                        : "The rabbits ate all the crops."
                    : "Oh the humanity! You've doomed mankind.";
            this.stateEnd();
        }
    }

    private statePlay(): void {
        this.state = State.play;
        this.messageLabel.visible = false;
        this.continueLabel.visible = false;

        this.crops.visible = true;
        this.reticle.visible = true;
        this.engine.canvas.style.cursor = "none";

        this.rabbits.forEach(rabbit => (rabbit.active = true));

        this.engine.input.pointers.primary.on("down", this.nukeRabbits);
    }

    private stateEnd(): void {
        this.state = State.end;

        this.messageLabel.visible = true;
        this.continueLabel.visible = true;
        this.gameOverLabel.visible = true;

        this.crops.visible = false;
        this.geigerCounter.visible = false;
        this.reticle.visible = false;
        this.engine.canvas.style.cursor = "default";

        this.engine.input.pointers.primary.off("down", this.nukeRabbits);
        this.engine.input.pointers.primary.once("down", () => this.engine.goToScene("title"));
    }

    private spawnRabbit(): void {
        const rabbit = new Rabbit({
            game: this,
            type: this.nuked && Math.random() < 0.05 ? "mutant" : "normal",
            pos: new Vector(-16, rngRange(170, 220)),
            isOffScreen: true
        });
        rabbit.active = true;
        this.add(rabbit);
    }

    private readonly nukeRabbits = (evt: Input.PointerDownEvent): void => {
        if (this.nukeCooldown > 0) {
            return;
        }

        if (!this.nuked) {
            this.nuked = true;
            this.vignette.visible = true;
            this.background.state = "post";
            this.geigerCounter.visible = true;

            resources.nuclearWind.loop = true;
            void resources.nuclearWind.play(0.25 * 0.6);

            playMusic("sad");
        }

        this.nukeCooldown = 1000;
        this.geigerCounter.rads += 0.35;
        this.nuke.detonate(evt.worldPos);
        this.nukeFlash.flash();
        this.rabbits.forEach(rabbit => rabbit.die());
    };
}
