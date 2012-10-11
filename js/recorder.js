(function(window){

    var WORKER_PATH = 'js/recorderWorker.js';

    var config;
    var worker;
    var currCallback;
    var recording = false;
    
    var Recorder = function(source, cfg){
	config = cfg || {};
	var bufferLen = config.bufferLen || 4096;
	this.context = source.context;
	this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);

	this.node.onaudioprocess = function(e){
	    if (!recording) return;
	    worker.postMessage({
		command: 'record',
		buffer: [
		    e.inputBuffer.getChannelData(0),
		    e.inputBuffer.getChannelData(1)
		]
	    });
	};

	worker = new Worker(config.workerPath || WORKER_PATH);
	worker.postMessage({
	    command: 'init',
	    config: {
		sampleRate: this.context.sampleRate
	    }
	});

	worker.onmessage = function(e){
	    var blob = e.data;
	    currCallback(blob);
	};
	
	source.connect(this.node);
	this.node.connect(this.context.destination);    //this should not be necessary
    };

    Recorder.prototype.configure = function(cfg){
	for (var prop in cfg){
            if (cfg.hasOwnProperty(prop)){
		config[prop] = cfg[prop];
            }
	}
    };

    Recorder.prototype.record = function(){
    	recording = true;
    };

    Recorder.prototype.stop = function(){
	recording = false;
    };

    Recorder.prototype.clear = function(){
	worker.postMessage({ command: 'clear' });
    };

    Recorder.prototype.exportWAV = function(cb, type){
	currCallback = cb || config.callback;
	type = type || config.type || 'audio/wav';
	if (!currCallback) throw new Error('Callback not set');
	worker.postMessage({
            command: 'exportWAV',
            type: type
	});
    };

    Recorder.forceDownload = function(blob, filename){
	var url = (window.URL || window.webkitURL).createObjectURL(blob);
	var link = window.document.createElement('a');
	link.href = url;
	link.download = filename || 'output.wav';
	var click = document.createEvent("Event");
	click.initEvent("click", true, true);
	link.dispatchEvent(click);
    }

    window.Recorder = Recorder;

})(window);
