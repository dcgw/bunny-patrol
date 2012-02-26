package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Engine;
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.utils.Input;

    public class Main extends Engine {
        
        [Embed(source = 'assets/BensonOrchestraOfChicago-BackInHackensackNewJersey1924.mp3')]
        private static const HAPPY_MUSIC:Class;
        [Embed(source = 'assets/BachToccataFugue-compressed.mp3')]
        private static const SAD_MUSIC:Class;

        [Embed(source = 'assets/knewave.ttf', embedAsCFF="false", fontFamily = 'knewave')]
        private static const KNEWAVE_FONT:Class;
        
        public static const rabbits:Supplier = Supplier.newSupplier(96, function():Entity { return new NormalRabbit() });
        public static const mutantRabbits:Supplier = Supplier.newSupplier(16, function():Entity { return new MutantRabbit() });

        private var _happyMusic:Sfx;
        private var _sadMusic:Sfx;
        private var _titleWorld:TitleWorld;
        private var _gameWorld:GameWorld;

        public function Main() {
            super(320, 240, 60, false);
            FP.screen.scale = 2;
            FP.screen.color = 0x838B8B;
            //FP.console.enable();
            
            Text.font = "knewave";
            
            Supplier.initAll();
            
            _happyMusic = new Sfx(HAPPY_MUSIC);
            _sadMusic = new Sfx(SAD_MUSIC);

            _titleWorld = new TitleWorld();
            _gameWorld = new GameWorld();
            
            showTitle();
        }
        
        public function changeMusic(happy:Boolean = true):void {
            if(happy) {
                if(_sadMusic.playing) {
                    _sadMusic.stop();
                }
                if(!_happyMusic.playing) {
                    _happyMusic.loop();
                }
            } else {
                if(_happyMusic.playing) {
                    _happyMusic.stop();
                }
                if(!_sadMusic.playing) {
                    _sadMusic.loop();
                }
            }
        }
        
        public function showTitle():void {
            changeMusic();
            FP.world = _titleWorld;
        }
        
        public function playGame():void {
            _gameWorld.changeState(GameWorld.STATE_INTRO);
            FP.world = _gameWorld;
        }
        
    }
}