import {Actor, BaseAlign, Color, Engine, FontUnit, Scene, TextAlign, Vector} from "excalibur";
import glowLabel from "../glow-label";
import resources from "../resources";

export default class Title extends Scene {

    private readonly titleLabel = glowLabel({
        text: "Bunny Patrol",
        pos: new Vector(160, 45),
        fontFamily: "Knewave",
        fontSize: 40,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("999933"),
        glowColor: Color.Black,
        glowWidth: 2.5
    });

    private readonly startLabel = glowLabel({
        text: "Click to Play",
        pos: new Vector(160, 195),
        fontFamily: "Knewave",
        fontSize: 18,
        fontUnit: FontUnit.Px,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("993333"),
        glowColor: Color.Black,
        glowWidth: 2.5
    });

    public onInitialize(engine: Engine): void {
        const background = new Actor({
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titlescreen);
        this.add(background);

        this.addUIActor(this.titleLabel);
        this.addUIActor(this.startLabel);

        resources.happyMusic.loop = true;
        resources.happyMusic.play().then(() => void 0, (err) => console.log("", err));

        this.on("activate", () => {
            engine.input.pointers.primary.once("down", () => engine.goToScene("game"));
        });
    }
}