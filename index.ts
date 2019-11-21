import domready from "domready";
import {DisplayMode, Engine, Loader} from "excalibur";
import Title from "./title/title";
import resources from "./resources";

domready(() => {
    const engine = new Engine({
        width: 320,
        height: 240,
        displayMode: DisplayMode.Fixed
    });

    const loader = new Loader();
    loader.addResource(resources.titlescreen);

    engine.start(loader)
        .then(() => {
            engine.addScene("title", new Title(engine));
            engine.goToScene("title");
        });
});