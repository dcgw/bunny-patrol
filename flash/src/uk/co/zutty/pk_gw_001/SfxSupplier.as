package uk.co.zutty.pk_gw_001
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Sfx;
    
    public class SfxSupplier {
        
        private var _poolSize:int;
        private var _sounds:Array;
        private var _pool:Vector.<Sfx>;
        private var _idx:int;
        
        public function SfxSupplier(poolSize:int, sounds:Array) {
            _poolSize = poolSize;
            _sounds = sounds;
            _pool = new Vector.<Sfx>(poolSize);
        }
        
        public function init():void {
            for(var i:int = 0; i < _poolSize; i++) {
                _pool[i] = new Sfx(FP.choose(_sounds));
            }
            _idx = -1;
        }
        
        public function next():Sfx {
            _idx = (_idx + 1) % _poolSize;
            return _pool[_idx];
        }

        public function playNext():void {
            next().play();
        }
    }
}