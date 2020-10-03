import {Actor, Color, Engine} from "excalibur";

export default class NukeFlash extends Actor {

    private alpha = 0;

    public onInitialize(engine: Engine): void {
        this.width = engine.canvasWidth;
        this.height = engine.canvasHeight;
        this.setZIndex(engine.canvasHeight);
    }

    public update(engine: Engine, delta: number): void {
        super.update(engine, delta);

        if (this.alpha > 0) {
            this.alpha -= 0.05;
        } else {
            this.visible = false;
        }
    }

    public flash(): void {
        this.alpha = 1;
        this.visible = true;
    }

    public onPostDraw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Color.fromRGB(255, 255, 255, this.alpha).toString();
        ctx.fillRect(0, 0, this.width, this.height);
    }
}