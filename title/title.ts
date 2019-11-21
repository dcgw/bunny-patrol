import {Actor, Engine, Scene, Vector} from "excalibur";
import resources from "../resources";

export default class Title extends Scene {

    constructor(engine: Engine) {
        super(engine);

        const background = new Actor({
            anchor: Vector.Zero
        });
        background.addDrawing(resources.titlescreen);
        this.add(background);
    }
}