package uk.co.zutty.pk_gw_001
{
    public class NormalRabbit extends Rabbit {
        
        [Embed(source = '/rabbit2.png')]
        private static const RABBIT_IMAGE:Class;

        public function NormalRabbit() {
            super(RABBIT_IMAGE, 24, 1);
        }
    }
}
