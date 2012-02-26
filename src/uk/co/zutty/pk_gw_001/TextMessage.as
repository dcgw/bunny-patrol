package uk.co.zutty.pk_gw_001
{
    import flash.filters.GlowFilter;
    
    import net.flashpunk.Entity;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Text;
    
    public class TextMessage extends Entity {
        public function TextMessage(x:Number, y:Number, message:String, size:uint = 18, color:uint = 0xffffffff) {
            super(x, y);
            var txt:Text = new Text(message);
            txt.align = "center";
            txt.color = color;
            txt.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            txt.size = size;
            txt.centerOrigin();
            graphic = txt;
        }
    }
}