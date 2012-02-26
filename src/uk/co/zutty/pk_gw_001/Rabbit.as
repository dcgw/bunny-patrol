package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Spritemap;
    
    public class Rabbit extends Suppliable {
        
        private const HOP_FRAMERATE:Number = 12;

        [Embed(source = 'assets/hop.mp3')]
        private static const HOP1_SOUND:Class;
        [Embed(source = 'assets/hop2.mp3')]
        private static const HOP2_SOUND:Class;
        [Embed(source = 'assets/hop3.mp3')]
        private static const HOP3_SOUND:Class;

        private var _gfx:Spritemap;
        private var _sfx:Sfx;
        private var _hopTimer:int = 0;
        private var _speed:Number = 0;
        private var _baseSpeed:Number;

        public function Rabbit(img:Class, frameSize:uint, baseSpeed:Number) {
            super();
            _baseSpeed = baseSpeed;
            _gfx = new Spritemap(img, frameSize, frameSize);
            _gfx.add("sit", [0, 1], 6, true);
            _gfx.add("hop", [2, 3, 4, 5, 6], HOP_FRAMERATE, false);
            _gfx.play("sit");
            _gfx.centerOrigin();
            graphic = _gfx;
            setHitbox(12, 12, 24, 24);
            _sfx = new Sfx(FP.choose([HOP1_SOUND, HOP2_SOUND, HOP3_SOUND]));
        }
        
        private function hop():void {
            _gfx.play("hop", true);
            _hopTimer = (FP.frameRate / HOP_FRAMERATE) * 5;
            _speed = (Math.random() * _baseSpeed * 1.3) + _baseSpeed;
            _sfx.play();
        }
        
        private function sit():void {
            _gfx.play("sit");
            _speed = 0;
            _hopTimer = -1;
        }
        
        override public function spawn(x:Number, y:Number):void {
            super.spawn(x, y);
            layer = 240-y;
        }
        
        public function get move():Boolean {
            if(!FP.world is GameWorld) {
                return false;
            }
            var s:int = GameWorld(FP.world).state;
            return s == GameWorld.STATE_PLAY || s == GameWorld.STATE_END;
        }
        
        override public function update():void {
            super.update();
            
            if(move) {
                x += _speed;
            }
            
            if(x > FP.width + 16) {
                despawn();
                if(FP.world is GameWorld) {
                    GameWorld(FP.world).rabbitEatCrops();
                }
            }

            if(_hopTimer == 0) {
                sit();
            } else {
                --_hopTimer;
            }
            
            if(move && _hopTimer < 0 && Math.random() <= 0.02) {
                hop();
            }
        }
    }
}