import domready = require("domready");
import {LabelOptions} from "@dcgw/excalibur-extended-label";
import {BaseAlign, Color, DisplayMode, Engine, Loader, TextAlign} from "excalibur";
import Game from "./game/game";
import {version} from "./package.json";
import resources from "./resources";
import Title from "./title/title";

export const defaultLabelOptions: LabelOptions = {
    fontFamily: "Knewave",
    fontSize: 18,
    textAlign: TextAlign.Center,
    baseAlign: BaseAlign.Top,
    color: Color.White,
    outlineColor: new Color(0, 0, 0, 0.5),
    outlineWidth: 1,
    shadowColor: Color.Black,
    shadowBlurRadius: 2
};

console.log(`Bunny Patrol v${version}`);

const width = 320;
const height = 240;

domready(() => {
    const engine = new Engine({
        viewport: {width, height},
        resolution: {width, height},
        displayMode: DisplayMode.Fixed,
        antialiasing: false,
        suppressHiDPIScaling: true
    });

    // Work around Firefox not supporting image-rendering: pixelated
    // See https://github.com/excaliburjs/Excalibur/issues/1676
    if (engine.canvas.style.imageRendering === "") {
        engine.canvas.style.imageRendering = "crisp-edges";
    }

    const scale = (): void => {
        const scaleFactor = Math.floor(
            Math.min(window.innerWidth / width, window.innerHeight / height)
        );

        engine.screen.viewport = {width: width * scaleFactor, height: height * scaleFactor};
        engine.screen.applyResolutionAndViewport();
    };

    scale();

    const loader = new Loader(Object.values(resources));

    void engine.start(loader).then(() => {
        engine.addScene("title", new Title(engine));
        engine.addScene("game", new Game(engine));
        engine.goToScene("title");
    });

    window.addEventListener("resize", scale);
});
