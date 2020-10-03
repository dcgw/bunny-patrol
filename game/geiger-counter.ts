import {Actor, Engine, Util, Vector} from "excalibur";
import glowLabel from "../glow-label";
import {labelDefaults} from "../index";
import resources from "../resources";

export default class GeigerCounter extends Actor {

    public rads = 0;

    private readonly label = glowLabel({
        ...labelDefaults,
        text: "Atomic Fallout",
        pos: new Vector(0, 22),
        fontSize: 14
    });

    public onInitialize(engine: Engine): void {
        this.addDrawing(resources.dial);
        this.add(this.label);
    }

    public onPostDraw(ctx: CanvasRenderingContext2D, delta: number): void {
        ctx.save();

        ctx.strokeStyle = "#393124";
        ctx.lineWidth = 1;

        const needleRads: number = this.rads + (Math.random() * 0.02) - 0.01;
        const theta: number = (needleRads * Math.PI * 0.5) - Math.PI * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.lineTo(Math.cos(theta) * 30, 12 + Math.sin(theta) * 30);
        ctx.stroke();

        ctx.restore();
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        // Slowly decrease
        if (this.rads > 0) {
            this.rads -= (0.001 * this.rads);
        }

        // Play geiger counter clicks
        if (this.rads > 0.1 && Math.random() < (0.5 * this.rads)) {
            [resources.click1, resources.click2, resources.click3][Util.randomIntInRange(0, 2)]
                .play().then(() => void 0, (err) => console.log("", err));
        }
    }
}