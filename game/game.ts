import {Actor, BaseAlign, Color, Engine, FontUnit, Label, Scene, SpriteSheet, TextAlign, Vector} from "excalibur";
import {LabelArgs} from "excalibur/dist/Label";
import resources from "../resources";

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

        const spritesheet = new SpriteSheet({
            image: resources.background,
            spWidth: 320,
            spHeight: 240,
            rows: 1,
            columns: 2
        });

        this.background = new Actor({
            anchor: Vector.Zero
        });
        this.background.addDrawing(spritesheet.getSprite(0));
        this.add(this.background);

        for (const line of this.startLines) {
            this.add(line);
        }
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
        /*
        switch (this.state) {
            case State.play:
                this.state = State.end;
                break;
            case State.end:
                this.state = State.intro;
                break;
        }
         */
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

    private readonly onClick = () => {
        if (this.state === State.intro) {
            this.advance();
        }
    }
}