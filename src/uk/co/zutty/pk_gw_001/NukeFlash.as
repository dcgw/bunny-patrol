package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Image;
    
    public class NukeFlash extends Entity {
        
        private const MAX_ALPHA:Number = 0.6;
        
        private var img:Image;
        
        public function NukeFlash() {
            super();
            x = 0;
            y = 0;
            img = Image.createRect(FP.width, FP.height, 0xFFFFFF);
            graphic = img;
            img.alpha = 1;
            img.scrollX = 0;
            img.scrollY = 0;
            active = false;
            visible = false;
        }
        
        public function flash():void {
            img.alpha = 1;
            active = true;
            visible = true;
        }

        override public function update():void {
            super.update();
            if(img.alpha > 0) {
                img.alpha -= 0.05;
            } else {
                active = false;
                visible = false;
            }
        }
    }
}