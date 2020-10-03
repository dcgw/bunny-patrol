import domready from "domready";
import {BaseAlign, Color, DisplayMode, Engine, FontUnit, Loader, TextAlign} from "excalibur";
import Game from "./game/game";
import {GlowLabelArgs} from "./glow-label";
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

domready(() => {
    const engine = new Engine({
        width: 320,
        height: 240,
        displayMode: DisplayMode.Fixed,
        suppressPlayButton: true,
        suppressHiDPIScaling: true
    });

    engine.canvas.style.width = "640px";
    engine.canvas.style.height = "480px";
    engine.canvas.style.imageRendering = "pixelated";

    const loader = new Loader(Object.values(resources));

    void engine.start(loader).then(() => {
        engine.addScene("title", new Title(engine));
        engine.addScene("game", new Game(engine));
        engine.goToScene("title");
    });
});
