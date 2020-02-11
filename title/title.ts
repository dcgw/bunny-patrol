import {Actor, Color, Engine, Scene, Vector} from "excalibur";
import glowLabel from "../glow-label";
import {labelDefaults} from "../index";
import playMusic from "../music/music";
import resources from "../resources";

export default class Title extends Scene {

    private readonly titleLabel = glowLabel({
        ...labelDefaults,
        text: "Bunny Patrol",
        pos: new Vector(160, 45),
        fontSize: 40,
        color: Color.fromHex("999933")
    });

    private readonly startLabel = glowLabel({
        ...labelDefaults,
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

        this.addUIActor(this.titleLabel);
        this.addUIActor(this.startLabel);

        this.on("activate", () => {
            playMusic("happy");
            engine.input.pointers.primary.once("down", () => engine.goToScene("game"));
        });
    }
}