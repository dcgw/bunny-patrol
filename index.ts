import domready = require("domready");
import {BaseAlign, Color, DisplayMode, Engine, FontUnit, Loader, TextAlign} from "excalibur";
import Game from "./game/game";
import {GlowLabelArgs} from "./glow-label";
import resources from "./resources";
import Title from "./title/title";
import {version} from "./package.json";

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

domready(() => {
    const engine = new Engine({
        viewport: {
            width: 640,
            height: 480
        },
        resolution: {
            width: 320,
            height: 240
        },
        displayMode: DisplayMode.Fixed,
        antialiasing: false,
        suppressPlayButton: true
    });

    const loader = new Loader(Object.values(resources));

    void engine.start(loader).then(() => {
        engine.addScene("title", new Title(engine));
        engine.addScene("game", new Game(engine));
        engine.goToScene("title");
    });
});
