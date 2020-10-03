import domready = require("domready");
import {BaseAlign, Color, DisplayMode, Engine, FontUnit, Loader, TextAlign} from "excalibur";
import Game from "./game/game";
import {GlowLabelArgs} from "./glow-label";
import {version} from "./package.json";
import resources from "./resources";
import Title from "./title/title";

export const labelDefaults: GlowLabelArgs = {
    fontFamily: "Knewave",
    fontSize: 18,
    fontUnit: FontUnit.Px,
    textAlign: TextAlign.Center,
    baseAlign: BaseAlign.Top,
    color: Color.White,
    glowColor: Color.Black,
    glowWidth: 2.5
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
        suppressPlayButton: true,
        suppressHiDPIScaling: true
    });

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
