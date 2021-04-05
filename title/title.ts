import Label from "@dcgw/excalibur-extended-label";
import {Actor, Color, Engine, Scene, Vector} from "excalibur";
import {defaultLabelOptions} from "../index";
import playMusic from "../music/music";
import resources from "../resources";

export default class Title extends Scene {
    private readonly titleLabel = new Label({
        ...defaultLabelOptions,
        text: "Bunny Patrol",
        pos: new Vector(160, 45),
        fontSize: 40,
        color: Color.fromHex("999933")
    })

    private readonly startLabel = new Label({
        ...defaultLabelOptions,
        text: "Click to Play",
        pos: new Vector(160, 195),
        color: Color.fromHex("993333")
    });

    public onInitialize(engine: Engine): void {
        const background = new Actor({
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titlescreen);
        this.add(background);

        this.addScreenElement(this.titleLabel);
        this.addScreenElement(this.startLabel);

        this.on("activate", () => {
            playMusic("happy");
            engine.input.pointers.primary.once("down", () => engine.goToScene("game"));
        });
    }
}
