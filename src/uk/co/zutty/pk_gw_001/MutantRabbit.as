package uk.co.zutty.pk_gw_001
{
    public class MutantRabbit extends Rabbit {
        
        [Embed(source = 'assets/mutant_rabbit.png')]
        private static const MUTANT_RABBIT_IMAGE:Class;
        
        public function MutantRabbit() {
            super(MUTANT_RABBIT_IMAGE, 32, 1.5);
        }
    }
}