package uk.co.zutty.pk_gw_001
{
    
    import net.flashpunk.FP;
    import net.flashpunk.World;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.utils.Input;
    
    public class TitleWorld extends World {

        [Embed(source = 'assets/titlescreen.png')]
        private const TITLE_IMAGE:Class;

        public function TitleWorld() {
            super();
            
            addGraphic(new Image(TITLE_IMAGE));

            add(new TextMessage(160, 60, "Bunny Patrol", 40, 0x999933));

            add(new TextMessage(160, 200, "Click to Play", 18, 0x993333));
        }
        
        override public function update():void {
            if(Input.mousePressed) {
                Main(FP.engine).playGame();
            }
        }
    }
}