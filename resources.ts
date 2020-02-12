import {Sound, Texture} from "excalibur";
import background from "./game/background.png";
import blastMp3 from "./game/blast.mp3";
import blastOgg from "./game/blast.ogg";
import carrot from "./game/carrot.png";
import click1Mp3 from "./game/click.mp3";
import click1Ogg from "./game/click.ogg";
import click2Mp3 from "./game/click2.mp3";
import click2Ogg from "./game/click2.ogg";
import click3Mp3 from "./game/click3.mp3";
import click3Ogg from "./game/click3.ogg";
import crunchMp3 from "./game/crunch.mp3";
import crunchOgg from "./game/crunch.ogg";
import dial from "./game/dial.png";
import hopMp3 from "./game/hop.mp3";
import hopOgg from "./game/hop.ogg";
import hop2Mp3 from "./game/hop2.mp3";
import hop2Ogg from "./game/hop2.ogg";
import hop3Mp3 from "./game/hop3.mp3";
import hop3Ogg from "./game/hop3.ogg";
import mutantRabbit from "./game/mutant-rabbit.png";
import needle from "./game/needle.png";
import nuclearWindMp3 from "./game/nuclear-wind.mp3";
import nuclearWindOgg from "./game/nuclear-wind.ogg";
import nuke from "./game/nuke.png";
import rabbitSplat from "./game/rabbit-splat2.png";
import rabbit from "./game/rabbit2.png";
import reticle from "./game/reticle.png";
import vignette from "./game/vignette.png";
import happyMusicMp3 from "./music/happy.mp3";
import happyMusicOgg from "./music/happy.ogg";
import sadMusicMp3 from "./music/sad.mp3";
import sadMusicOgg from "./music/sad.ogg";
import titlescreen from "./title/titlescreen.png";

export default {
    background: new Texture(background),
    blast: new Sound(blastOgg, blastMp3),
    carrot: new Texture(carrot),
    click1: new Sound(click1Ogg, click1Mp3),
    click2: new Sound(click2Ogg, click2Mp3),
    click3: new Sound(click3Ogg, click3Mp3),
    crunch: new Sound(crunchOgg, crunchMp3),
    dial: new Texture(dial),
    hop1: new Sound(hopOgg, hopMp3),
    hop2: new Sound(hop2Ogg, hop2Mp3),
    hop3: new Sound(hop3Ogg, hop3Mp3),
    mutantRabbit: new Texture(mutantRabbit),
    needle: new Texture(needle),
    nuclearWind: new Sound(nuclearWindOgg, nuclearWindMp3),
    nuke: new Texture(nuke),
    rabbit: new Texture(rabbit),
    rabbitSplat: new Texture(rabbitSplat),
    reticle: new Texture(reticle),
    vignette: new Texture(vignette),
    happyMusic: new Sound(happyMusicOgg, happyMusicMp3),
    sadMusic: new Sound(sadMusicOgg, sadMusicMp3),
    titlescreen: new Texture(titlescreen)
};