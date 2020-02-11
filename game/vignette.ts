import {Actor, Engine, Vector} from "excalibur";
import resources from "../resources";

export default class Vignette extends Actor {

    constructor() {
        super({
            anchor: Vector.Zero,
            visible: false
        });
    }

    public onInitialize(engine: Engine): void {
        this.addDrawing(resources.vignette);
    }
}