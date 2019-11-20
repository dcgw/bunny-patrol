package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Spritemap;
    import net.flashpunk.utils.Input;
    
    public class Target extends Entity {
        
        [Embed(source = '/target.png')]
        private const TARGET_IMAGE:Class;

        public function Target() {
            super();
            var gfx:Spritemap = new Spritemap(TARGET_IMAGE, 32, 32);
            gfx.add("flash", [0, 1], 2, true);
            gfx.play("flash");
            gfx.centerOrigin();
            graphic = gfx;
            layer = 0;
        }
        
        override public function update():void {
            x = Input.mouseX;
            y = Input.mouseY;
        }
    }
}
