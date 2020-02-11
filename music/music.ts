import resources from "../resources";

export default function playMusic(key: "happy" | "sad"): void {
    const music = key === "happy" ? resources.happyMusic : resources.sadMusic;
    const oldMusic = key === "happy" ? resources.sadMusic : resources.happyMusic;

    // Stop other music
    if (oldMusic.isPlaying()) {
        oldMusic.instances.forEach(music => music.stop());
    }

    // Start requested music
    if (music.isPlaying()) {
        return;
    }

    music.loop = true;
    music.play().then(() => void 0, (err) => console.log("", err));
}