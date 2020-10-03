import {Actor, Engine, TextAlign, Vector} from "excalibur";
import glowLabel from "../glow-label";
import {labelDefaults} from "../index";
import resources from "../resources";

export default class Crops extends Actor {

    private cropsValue = 10;

    private readonly label = glowLabel({
        ...labelDefaults,
        text: `${this.cropsValue}`,
        pos: new Vector(2, -3),
        fontSize: 24,
        textAlign: TextAlign.Left
    });

    public get value(): number {
        return this.cropsValue;
    }

    public set value(value: number) {
        if (value >= 0 && value < this.value) {
            resources.crunch.play()
                .then(() => void 0, (err) => console.log("", err));
        }
        this.cropsValue = Math.max(0, value);
        this.label.text = `${this.cropsValue}`;
    }

    public onInitialize(engine: Engine): void {
        this.addDrawing(resources.carrot);
        this.add(this.label);
    }
}