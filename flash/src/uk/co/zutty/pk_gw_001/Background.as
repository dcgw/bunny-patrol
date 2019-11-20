package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Spritemap;
    
    public class Background extends Entity {

        [Embed(source = '/background.png')]
        private const BACKGROUND_IMAGE:Class;
        
        private var _gfx:Spritemap;

        public function Background() {
            super(0, 0);
            _gfx = new Spritemap(BACKGROUND_IMAGE, 320, 240);
            _gfx.add("pre", [0], 0, true);
            _gfx.add("post", [1], 0, true);
            _gfx.play("pre");
            graphic = _gfx;
            layer = 1000;
        }
        
        public function unnuke():void {
            _gfx.play("pre");
        }

        public function nuke():void {
            _gfx.play("post");
        }
    }
}
