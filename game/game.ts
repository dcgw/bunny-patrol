import {Actor, BaseAlign, Color, Engine, FontUnit, Label, Scene, SpriteSheet, TextAlign, Util, Vector} from "excalibur";
import {LabelArgs} from "excalibur/dist/Label";
import resources from "../resources";
import Rabbit from "./rabbit";

enum State {
    intro,
    play,
    end
}

const labelProto: LabelArgs = {
    fontFamily: "Knewave",
    fontSize: 18,
    fontUnit: FontUnit.Px,
    textAlign: TextAlign.Center,
    baseAlign: BaseAlign.Top,
    color: Color.White
};

const spritesheet = new SpriteSheet({
    image: resources.background,
    spWidth: 320,
    spHeight: 240,
    rows: 1,
    columns: 2
});

export default class Game extends Scene {

    private readonly startLines = [
        new Label({
            ...labelProto,
            pos: new Vector(160, 70),
            text: "These darn rabbits are eating",
        }),
        new Label({
            ...labelProto,
            pos: new Vector(160, 100),
            text: "all of Farmer Bill's crops! He",
        }),
        new Label({
            ...labelProto,
            pos: new Vector(160, 130),
            text: "needs you to help deal with",
        }),
        new Label({
            ...labelProto,
            pos: new Vector(160, 160),
            text: "them.",
        }),
        new Label({
            text: "Click to Continue",
            pos: new Vector(160, 200),
            fontFamily: "Knewave",
            fontSize: 18,
            fontUnit: FontUnit.Px,
            textAlign: TextAlign.Center,
            baseAlign: BaseAlign.Top,
            color: Color.fromHex("993333")
        })
    ];

    private readonly background: Actor;

    private state: State = State.intro;

    private readonly engine: Engine;

    constructor(engine: Engine) {
        super(engine);

        this.engine = engine;

        this.background = new Actor({
            anchor: Vector.Zero
        });
    }

    public onInitialize(engine: Engine): void {
        this.background.addDrawing(spritesheet.getSprite(0));
        this.add(this.background);

        for (const line of this.startLines) {
            this.add(line);
        }
        this.add(new Rabbit({
            pos: new Vector(50, 170)
        }));
    }

    public onActivate(): void {
        this.state = State.intro;
        for (const line of this.startLines) {
            line.visible = true;
        }
        this.engine.input.pointers.primary.on("down", this.onClick);

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

                for (const line of this.startLines) {
                    line.visible = false;
                }
                break;
            case State.play:
                this.state = State.end;
                break;
            case State.end:
                this.state = State.intro;
                break;
        }
    }

    private spawnRabbit(): void {
        this.add(new Rabbit({
            pos: new Vector(-16, Util.randomIntInRange(170, 220))
        }));
    }

    private readonly onClick = () => {
        if (this.state === State.intro) {
            this.advance();
        }
    }
}