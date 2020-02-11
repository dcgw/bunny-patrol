import {Sound, Texture} from "excalibur";
import background from "./game/background.png";
import blastMp3 from "./game/blast.mp3";
import blastOgg from "./game/blast.ogg";
import carrot from "./game/carrot.png";
import crunchMp3 from "./game/crunch.mp3";
import crunchOgg from "./game/crunch.ogg";
import hopMp3 from "./game/hop.mp3";
import hopOgg from "./game/hop.ogg";
import hop2Mp3 from "./game/hop2.mp3";
import hop2Ogg from "./game/hop2.ogg";
import hop3Mp3 from "./game/hop3.mp3";
import hop3Ogg from "./game/hop3.ogg";
import nuclearWindMp3 from "./game/nuclear-wind.mp3";
import nuclearWindOgg from "./game/nuclear-wind.ogg";
import nuke from "./game/nuke.png";
import rabbitSplat from "./game/rabbit-splat2.png";
import rabbit from "./game/rabbit2.png";
import reticle from "./game/reticle.png";
import happyMusicMp3 from "./music/happy.mp3";
import titlescreen from "./title/titlescreen.png";

export default {
    background: new Texture(background),
    blast: new Sound(blastOgg, blastMp3),
    carrot: new Texture(carrot),
    crunch: new Sound(crunchOgg, crunchMp3),
    hop1: new Sound(hopOgg, hopMp3),
    hop2: new Sound(hop2Ogg, hop2Mp3),
    hop3: new Sound(hop3Ogg, hop3Mp3),
    nuclearWind: new Sound(nuclearWindOgg, nuclearWindMp3),
    nuke: new Texture(nuke),
    rabbit: new Texture(rabbit),
    rabbitSplat: new Texture(rabbitSplat),
    reticle: new Texture(reticle),
    happyMusic: new Sound(happyMusicMp3),
    titlescreen: new Texture(titlescreen),
};