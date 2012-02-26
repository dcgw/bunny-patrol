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
    
    public class CropsIndicator extends Entity {
        
        [Embed(source = 'assets/carrotnom.mp3')]
        private const CRUNCH_SOUND:Class;
        
        [Embed(source = 'assets/carrot.png')]
        private const CARROT_IMAGE:Class;

        private var _crops:Number;
        private var _gfx:Graphiclist;
        private var _txt:Text;
        private var _nomSupplier:SfxSupplier;
        
        public function CropsIndicator() {
            super();

            _crops = 10;

            _gfx = new Graphiclist();
            graphic = _gfx;
            graphic.scrollX = 0;
            graphic.scrollY = 0;
            
            var carrot:Image = new Image(CARROT_IMAGE);
            carrot.centerOrigin();
            carrot.x = 280;
            carrot.y = 30;
            _gfx.add(carrot);

            _txt = new Text(String(_crops));
            _txt.color = 0xFFFFFF;
            _txt.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            _txt.size = 24;
            _txt.x = 280;
            _txt.y = 15;
            _gfx.add(_txt);
            
            _nomSupplier = new SfxSupplier(4, [CRUNCH_SOUND]);
            _nomSupplier.init();
        }
        
        public function get crops():Number {
            return _crops;
        }
        
        public function set crops(c:Number):void {
            if(c < _crops && c >= 0) {
                _nomSupplier.playNext();
            }
            _crops = Math.max(0, c);
            _txt.text = String(_crops);
        }
    }
}