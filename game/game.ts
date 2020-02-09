import {BaseAlign, Color, Engine, FontUnit, Scene, TextAlign, Util, Vector} from "excalibur";
import glowLabel from "../glow-label";
import Background from "./background";
import Crops from "./crops";
import Rabbit from "./rabbit";
import Reticle from "./reticle";

enum State {
    intro,
    play,
    end
}

export default class Game extends Scene {

    private readonly startMessage = glowLabel({
        text: "These darn rabbits are eating all of Farmer Bill's crops! He needs you to help deal with them.",
        pos: new Vector(160, 50),
        fontFamily: "Knewave",
        fontSize: 18,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.White,
        glowColor: Color.Black,
        glowWidth: 2.5,
        wrapWidth: 260,
        lineHeight: 25
    });

    private readonly continueLabel = glowLabel({
        text: "Click to Continue",
        pos: new Vector(160, 200),
        fontFamily: "Knewave",
        fontSize: 18,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("993333"),
        glowColor: Color.Black,
        glowWidth: 2.5
    });

    private readonly background = new Background({
        anchor: Vector.Zero
    });
    private readonly crops = new Crops({
        pos: new Vector(280, 30)
    });
    private readonly reticle = new Reticle();

    private state: State = State.intro;

    private readonly engine: Engine;

    constructor(engine: Engine) {
        super(engine);

        this.engine = engine;
    }

    public onInitialize(engine: Engine): void {
        this.add(this.background);
        this.addUIActor(this.crops);
        this.addUIActor(this.startMessage);
        this.addUIActor(this.continueLabel);

        this.add(new Rabbit({
            pos: new Vector(50, 170)
        }));
    }

    public onActivate(): void {
        this.state = State.intro;
        this.startMessage.visible = true;
        this.continueLabel.visible = true;

        this.engine.input.pointers.primary.on("down", this.onClick);
        this.on("eatcrops", () => this.crops.value--);
    }

    public onDeactivate(): void {
        this.engine.input.pointers.primary.off("down", this.onClick);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (Math.random() < 0.009) {
            this.spawnRabbit();
        }
    }

    private advance(): void {
        switch (this.state) {
            case State.intro:
                this.state = State.play;

                this.startMessage.visible = false;
                this.continueLabel.visible = false;

                this.addUIActor(this.reticle);
                break;
            case State.play:
                this.state = State.end;
                this.reticle.kill();
                break;
            case State.end:
                this.state = State.intro;
                break;
        }
    }

    private spawnRabbit(): void {
        this.add(new Rabbit({
            pos: new Vector(-16, Util.randomIntInRange(170, 220)),
            isOffScreen: true
        }));
    }

    private readonly onClick = () => {
        if (this.state === State.intro) {
            this.advance();
        }
    }
}