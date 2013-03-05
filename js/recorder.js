(function(window){

    var Recorder = function(source, cfg){
        this.recording = false;
        this.config = cfg || {};

        var WORKER_PATH = 'js/recorderWorker.js';
        var worker = this.worker = new Worker(this.config.workerPath || WORKER_PATH);
        var context = source.context;
        
        var bufferLen = this.config.bufferLen || 4096;
        var node = context.createJavaScriptNode(bufferLen, 2, 2);

        node.onaudioprocess = (function(event){
            if (!this.recording) return;
            var buffer = [event.inputBuffer.getChannelData(0),
                          event.inputBuffer.getChannelData(1)
                         ]; 
            worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        }).bind(this);
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: context.sampleRate
            }
        });
        worker.onmessage = (function(event){
            var blob = event.data;
            this.currCallback(blob);
        }).bind(this);;
        source.connect(node);
        node.connect(context.destination);    //this should not be necessary
    }

    Recorder.prototype.record = function(){
        this.recording = true;
    };

    Recorder.prototype.stop = function(){
        this.recording = false;
    };

    Recorder.prototype.isRecording = function(){
        return this.recording;
    };
    
    Recorder.prototype.clear = function(){
       this.worker.postMessage({command: 'clear'});
    };

    Recorder.prototype.exportWAV = function(cb, type){
        this.currCallback = cb || this.config.callback;
        type = type || this.config.type || 'audio/wav';
        if (!this.currCallback) throw new Error('Callback not set');
        this.worker.postMessage({
            command: 'exportWAV',
            type: type
        });
    };

    window.Recorder = Recorder;

})(window);
