package uk.co.zutty.pk_gw_001
{
    import flash.filters.GlowFilter;
    import flash.media.Sound;
    import flash.media.SoundChannel;
    import flash.media.SoundTransform;
    
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Sfx;
    import net.flashpunk.World;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.utils.Input;
    
    public class GameWorld extends World {
        
        [Embed(source = 'assets/nuclear_wind.mp3')]
        private static const NUCLEAR_WIND_SOUND:Class;
        
        [Embed(source = 'assets/vignette.png')]
        private static const VIGNETTE_IMAGE:Class;

        private static const NUKE_COOLDOWN_FRAMES:int = 60;
        private static const MSG_START:String = "These darn rabbits are eating all of Farmer Bill's crops! He needs you to help deal with them.";

        private var _bg:Background;
        private var _spawnRate:Number;
        private var _corpses:Corpses;
        private var _nuke:Nuke;
        private var _nukeCooldown:int;
        private var _flash:NukeFlash;
        private var _nuclearWind:Sound;
        private var _nuclearWindChannel:SoundChannel;
        private var _nukeFired:Boolean;
        private var _vignette:Entity;
        private var _geigerCounter:GeigerCounter;
        private var _cropsIndicator:CropsIndicator;
        private var _message:Entity;
        private var _continueButton:Entity;
        private var _gameOverMsg:Entity;
        private var _target:Target;
        
        public static const STATE_INTRO:int = 1;
        public static const STATE_PLAY:int = 2;
        public static const STATE_END:int = 3;
        private var _state:int = STATE_INTRO;

        public function GameWorld() {
            super();

            _bg = new Background();
            add(_bg);
            
            // Add splatty corpses
            _corpses = new Corpses();
            var corpseEntity:Entity = new Entity(0, 0, _corpses);
            corpseEntity.layer = 900; 
            add(corpseEntity);
            
            // Rabbits
            Main.rabbits.addAll(this);
            Main.mutantRabbits.addAll(this);
            
            // Nuke and flash
            _nuke = new Nuke();
            add(_nuke);
            _flash = new NukeFlash();
            add(_flash);
            _nuclearWind = Sound(new NUCLEAR_WIND_SOUND());
            
            // Target reticle
            _target = new Target();
            add(_target);
            
            _vignette = new Entity(0, 0, new Image(VIGNETTE_IMAGE));
            add(_vignette);
            
            _geigerCounter = new GeigerCounter();
            add(_geigerCounter);
            
            _cropsIndicator = new CropsIndicator();
            add(_cropsIndicator);
            
            _message = new Entity(160, 120);
            var txt:Text = new Text(MSG_START);
            txt.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            txt.size = 18;
            txt.wordWrap = true;
            txt.width = 260;
            txt.height = txt.textHeight * 1.5; // HACK LOL
            txt.align = "center";
            txt.color = 0xFFFFFF;
            txt.centerOrigin();
            _message.graphic = txt;
            add(_message);
            
            _continueButton = new TextMessage(160, 200, "Click to Continue", 18, 0x993333);
            add(_continueButton);
            
            _gameOverMsg = new TextMessage(160, 120, "GAME OVER", 28, 0x333399);
            add(_gameOverMsg);
            
            changeState(STATE_INTRO);
        }
        
        public function rabbitEatCrops():void {
            --_cropsIndicator.crops;
        }
        
        public function get state():int {
            return _state;
        }
        
        private function stopWind():void {
            if(_nuclearWindChannel != null) {
                _nuclearWindChannel.stop();
                _nuclearWindChannel = null;
            }
        }
        
        public function reset():void {
            // No more nukes
            _nukeFired = false;
            _geigerCounter.rads = 0;
            _bg.unnuke();
            _nuke.hide();
            _nukeCooldown = 0;
            _vignette.visible = false;
            stopWind();
            
            // Restock crops and show message
            message = MSG_START;
            _cropsIndicator.crops = 10;
            
            // Reset rabbits, if any
            for each(var rabbit:Rabbit in Main.rabbits.entities.concat(Main.mutantRabbits.entities)) {
                if(rabbit.active) {
                    rabbit.despawn();
                }
            }
            _corpses.clear();
            _spawnRate = 0.02;
            
            // Spawn starting rabbits
            for(var i:int = 0; i < 4; i++) {
                Main.rabbits.spawnNext(FP.rand(200) + 50, FP.rand(50) + 170);
            }
            _spawnRate = 0.02;
        }
        
        public function set message(str:String):void {
            Text(_message.graphic).text = str;
        }
        
        public function changeState(newState:int):void {
            if(newState == STATE_INTRO) {
                Input.mouseCursor = "auto";
                _state = newState;
                reset();
                _message.visible = true;
                _geigerCounter.show = false;
                _cropsIndicator.visible = false;
                _continueButton.visible = true;
                _gameOverMsg.visible = false;
                _target.visible = false;
                _target.active = false;
            } else if(newState == STATE_PLAY) {
                Input.mouseCursor = "hide";
                _state = newState;
                _message.visible = false;
                _geigerCounter.show = true;
                _cropsIndicator.visible = true;
                _continueButton.visible = false;
                _target.visible = true;
                _target.active = true;
            } else if(newState == STATE_END) {
                Input.mouseCursor = "auto";
                _state = newState;
                _message.visible = true;
                _cropsIndicator.visible = false;
                _geigerCounter.show = false;
                _continueButton.visible = true;
                _target.visible = false;
                _target.active = false;
                _gameOverMsg.visible = true;
            }
        }
        
        override public function update():void {
            super.update();

            // Sawn new rabbits, and accelrate spwn rate
            if(state == STATE_PLAY) {
                if(Math.random() < _spawnRate) {
                    if(_nukeFired && Math.random() < 0.05) {
                        Main.mutantRabbits.spawnNext(-16, FP.rand(50) + 170);
                    } else {
                        Main.rabbits.spawnNext(-16, FP.rand(50) + 170);
                    }
                }
            
                _spawnRate = Math.min(_spawnRate + 0.00005, 0.3);
            }
            
            if(_nukeCooldown > 0) {
                --_nukeCooldown;
            }
            
            if(state == STATE_INTRO && Input.mousePressed) {
                changeState(STATE_PLAY);
            } else if(state == STATE_PLAY && Input.mousePressed && _nukeCooldown <= 0) {
                // Change music
                Main(FP.engine).changeMusic(false);
                
                // Set off the nuke
                _nukeCooldown = NUKE_COOLDOWN_FRAMES;
                _nukeFired = true;
                _vignette.visible = true;
                if (_nuclearWindChannel == null) {
                    _nuclearWindChannel = _nuclearWind.play(0, int.MAX_VALUE,
                            new SoundTransform(0.6));
                }
                _bg.nuke();
                _nuke.nuke(Input.mouseX, Input.mouseY);
                _flash.flash();
                _geigerCounter.rads += 0.35;
                
                // Kill all rabbits on screen
                for each(var rabbit:Rabbit in Main.rabbits.entities.concat(Main.mutantRabbits.entities)) {
                    if(rabbit.active) {
                        rabbit.despawn();
                        _corpses.addSplat(rabbit.x, rabbit.y);
                    }
                }
            } else if(state == STATE_END && Input.mousePressed) {
                stopWind();
                Main(FP.engine).showTitle();
            }
            
            // Lose condition
            if(_geigerCounter.rads >= 0.95) {
                message = "Oh the humanity! You've doomed mankind."
                changeState(STATE_END);
            } else if(_cropsIndicator.crops == 0) {
                if(_nukeFired) {
                    message = "There is nothing left for the survivors to eat."
                } else {
                    message = "The rabbits ate all the crops."
                }
                changeState(STATE_END);
            }
        }
    }
}