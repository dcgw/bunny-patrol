import {Sound, Texture} from "excalibur";
import background from "./game/background.png";
import hopMp3 from "./game/hop.mp3";
import hopOgg from "./game/hop.ogg";
import hop2Mp3 from "./game/hop2.mp3";
import hop2Ogg from "./game/hop2.ogg";
import hop3Mp3 from "./game/hop3.mp3";
import hop3Ogg from "./game/hop3.ogg";
import rabbit from "./game/rabbit2.png";
import reticle from "./game/reticle.png";
import titlescreen from "./title/titlescreen.png";

export default {
    titlescreen: new Texture(titlescreen),
    background: new Texture(background),
    rabbit: new Texture(rabbit),
    hop1: new Sound(hopOgg, hopMp3),
    hop2: new Sound(hop2Ogg, hop2Mp3),
    hop3: new Sound(hop3Ogg, hop3Mp3),
    reticle: new Texture(reticle)
};