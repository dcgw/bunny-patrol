import domready from "domready";
import {DisplayMode, Engine, Loader} from "excalibur";
import Game from "./game/game";
import resources from "./resources";
import Title from "./title/title";

domready(() => {
    const engine = new Engine({
        width: 320,
        height: 240,
        displayMode: DisplayMode.Fixed
    });

    const loader = new Loader();
    loader.addResource(resources.titlescreen);
    loader.addResource(resources.background);

    engine.start(loader)
        .then(() => {
            engine.addScene("title", new Title(engine));
            engine.addScene("game", new Game(engine));
            engine.goToScene("title");
        }, (err) => console.log("", err));
});