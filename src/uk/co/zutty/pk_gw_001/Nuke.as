package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Anim;
    import net.flashpunk.graphics.Spritemap;
    
    public class Nuke extends Entity {
        
        [Embed(source = 'assets/nuke.png')]
        private const NUKE_IMAGE:Class;

        [Embed(source = 'assets/nuke2.mp3')]
        private const NUKE_SOUND:Class;
        
        private var _gfx:Spritemap;
        private var _sfx:Sfx;
        
        public function Nuke() {
            super(0, 0);
            _gfx = new Spritemap(NUKE_IMAGE, 320, 240);
            _gfx.add("nuke", [0,1,2,3,4,5,6,7,8,9], 12, false);
            _gfx.centerOrigin();
            graphic = _gfx;
            layer = 0;
            _gfx.callback = hide;
            hide();
            _sfx = new Sfx(NUKE_SOUND);
        }
        
        public function nuke(x:Number, y:Number):void {
            this.x = x;
            this.y = FP.clamp(y, 180, 240) - 80;
            active = true;
            visible = true;
            _gfx.play("nuke", true);
            _sfx.play();
        }
        
        public function hide():void {
            _gfx.frame = 0;
            active = false;
            visible = false;
        }
        
        override public function update():void {
            super.update();
        }
    }
}