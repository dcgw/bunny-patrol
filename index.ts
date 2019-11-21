import domready from "domready";
import {DisplayMode, Engine, Loader} from "excalibur";
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

    engine.start(loader)
        .then(() => {
            engine.addScene("title", new Title(engine));
            engine.goToScene("title");
        }, (err) => console.log("", err));
});