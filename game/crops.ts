import Label from "@dcgw/excalibur-extended-label";
import {Actor, Engine, TextAlign, Vector} from "excalibur";
import {defaultLabelOptions} from "../index";
import resources from "../resources";

export default class Crops extends Actor {
    private cropsValue = 10;

    private readonly label = new Label({
        ...defaultLabelOptions,
        text: `${this.cropsValue}`,
        pos: new Vector(2, -4),
        fontSize: 24,
        textAlign: TextAlign.Left
    });

    public get value(): number {
        return this.cropsValue;
    }

    public set value(value: number) {
        if (value >= 0 && value < this.value) {
            void resources.crunch.play(0.25);
        }
        this.cropsValue = Math.max(0, value);
        this.label.text = `${this.cropsValue}`;
    }

    public onInitialize(engine: Engine): void {
        this.addDrawing(resources.carrot);
        this.add(this.label);
    }
}
