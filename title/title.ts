import {Actor, BaseAlign, Color, Engine, FontUnit, Label, Scene, TextAlign, Vector} from "excalibur";
import resources from "../resources";

export default class Title extends Scene {

    private readonly titleLabel = new Label({
        text: "Bunny Patrol",
        pos: new Vector(160, 60),
        fontFamily: "Knewave",
        fontSize: 40,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("999933")
    });

    private readonly startLabel = new Label({
        text: "Click to Play",
        pos: new Vector(160, 200),
        fontFamily: "Knewave",
        fontSize: 18,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("993333")
    });

    constructor(engine: Engine) {
        super(engine);

        const background = new Actor({
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titlescreen);
        this.add(background);

        this.add(this.titleLabel);
        this.add(this.startLabel);
    }
}