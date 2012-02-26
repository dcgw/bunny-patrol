package uk.co.zutty.pk_gw_001
{
    import flash.display.BitmapData;
    import flash.display.Sprite;
    import flash.geom.Point;
    
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.utils.Draw;
    
    public class Corpses extends Graphic {
        
        [Embed(source = 'assets/rabbit_splat2.png')]
        private const RABBIT_SPLAT_IMAGE:Class;
        private const splatBitmap:BitmapData = FP.getBitmap(RABBIT_SPLAT_IMAGE);
        
        private var _buffer:BitmapData;

        public function Corpses() {
            super();
            _buffer = new BitmapData(320, 240);
            clear();
        }
        
        public function clear():void {
            _buffer.fillRect(_buffer.rect, 0x00000000);
        }
        
        public function addSplat(x:Number, y:Number):void {
            _buffer.copyPixels(splatBitmap, splatBitmap.rect, new Point(x - 12, y + 4), null, null, true);
        }
        
        override public function render(target:BitmapData, point:Point, camera:Point):void {
            target.copyPixels(_buffer, _buffer.rect, FP.zero, null, null, true);
        }
    }
}