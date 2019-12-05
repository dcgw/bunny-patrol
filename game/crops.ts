import {Actor, BaseAlign, Color, Engine, FontUnit, Label, Vector} from "excalibur";
import resources from "../resources";

export default class Crops extends Actor {

    private cropsValue: number = 10;

    private readonly label = new Label({
        text: `${this.cropsValue}`,
        pos: new Vector(2, -3),
        fontFamily: "Knewave",
        fontSize: 24,
        fontUnit: FontUnit.Px,
        baseAlign: BaseAlign.Top,
        color: Color.fromHex("FFFFFF")
    });

    public onInitialize(engine: Engine): void {
        this.addDrawing(resources.carrot);
        this.add(this.label);
    }

    get value(): number {
        return this.cropsValue;
    }

    set value(value: number) {
        if (value >= 0 && value < this.value) {
            resources.crunch.play()
                .then(() => void 0, (err) => console.log("", err));
        }
        this.cropsValue = Math.max(0, value);
        this.label.text = `${this.cropsValue}`;
    }
}