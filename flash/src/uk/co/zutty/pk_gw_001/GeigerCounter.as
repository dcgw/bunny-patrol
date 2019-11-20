package uk.co.zutty.pk_gw_001
{
    import flash.filters.GlowFilter;
    import flash.media.Sound;
    
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Graphiclist;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    
    public class GeigerCounter extends Entity {
        
        [Embed(source = '/click.mp3')]
        private const CLICK_SOUND:Class;
        [Embed(source = '/click2.mp3')]
        private const CLICK2_SOUND:Class;
        [Embed(source = '/click3.mp3')]
        private const CLICK3_SOUND:Class;
        
        [Embed(source = '/dial.png')]
        private const DIAL_IMAGE:Class;
        [Embed(source = '/needle.png')]
        private const NEEDLE_IMAGE:Class;

        private var _show:Boolean;
        private var _rads:Number;
        private var _clickSupplier:SfxSupplier;
        private var _gfx:Graphiclist;
        private var _needle:net.flashpunk.graphics.Image;
        
        public function GeigerCounter() {
            super();

            _rads = 0;

            _clickSupplier = new SfxSupplier(8, [CLICK_SOUND, CLICK2_SOUND, CLICK3_SOUND]);
            _clickSupplier.init();
            
            _gfx = new Graphiclist();
            graphic = _gfx;
            graphic.scrollX = 0;
            graphic.scrollY = 0;
            
            var dial:Image = new Image(DIAL_IMAGE);
            dial.centerOrigin();
            dial.x = 60;
            dial.y = 50;
            _gfx.add(dial);

            _needle = new Image(NEEDLE_IMAGE);
            _needle.originX = 1;
            _needle.originY = 30;
            _needle.x = 60;
            _needle.y = 62;
            _gfx.add(_needle);
            
            var txt:Text = new Text("Atomic Fallout");
            txt.y = -2;
            txt.color = 0xFFFFFF;
            txt.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            txt.size = 14;
            txt.y = 65;
            txt.x = 10;
            _gfx.add(txt);
        }
        
        public function get show():Boolean {
            return _show;
        }
        
        public function set show(s:Boolean):void {
            if(!s) {
                visible = false;
            }
            _show = s;
        }
        
        public function get rads():Number {
            return _rads;
        }
        
        public function set rads(r:Number):void {
            _rads = FP.clamp(r, 0, 1);
        }
        
        override public function update():void {
            super.update();
            
            // Only show if there is some radiation
            if(_show) {
                visible = _rads > 0.1;
            }

            // Turn the needle
            var needleRads:Number = rads + (Math.random() * 0.02) - 0.01;
            _needle.angle = 45 - (needleRads * 90); 

            // Slowly decrease
            if(_rads > 0) {
                _rads -= (0.001 * rads);
            }
            
            // Play geiger counter clicks
            if(_rads > 0.1 && Math.random() < (0.5 * rads)) {
                _clickSupplier.playNext();
            }
        }
    }
}
