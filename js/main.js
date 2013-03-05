(function($){

    var rec;
    var blob;

    var forceDownload = function(blob, filename){
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = filename || 'output.wav';
        var click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    }

    var onUserMediaSuccess = function(stream) {
        rec = new Recorder(new webkitAudioContext().createMediaStreamSource(stream));
        $('#rec').attr("disabled", false);
    };

    var onUserMediaError = function(error) {
        alert("Failed to get access to local media. Error code was " + error.code + ".");
    };

    var doGetUserMedia = function() {
        var constraints = {"mandatory": {}, "optional": []}; 
        try {
            navigator.getUserMedia({audio: true}, 
                                   onUserMediaSuccess,
                                   onUserMediaError);
        } catch (e) {
            console.log("getUserMedia failed with exception: " + e.message);
            alert("getUserMedia() failed. Is this a WebRTC capable browser?");
        }
    };
    
    $(document).ready(function(){
        $('#rec').attr("disabled", true);
        $('#download').attr("disabled", true);        

        $('#rec').click(function(){
            if(rec === undefined) return;
            if(!rec.isRecording()){
                $('#rec').text("stop");
                $('#download').attr("disabled", true);
                rec.record();
            } else {
                $('#rec').text("record");
                $('#download').attr("disabled", false);
                rec.stop();
                rec.exportWAV(function(b){
                    $('#player').attr("src", webkitURL.createObjectURL(blob = b));
                });
            }
        });
        $('#download').click(function(){
            if(blob === undefined) return;
            forceDownload(blob);
        });
        doGetUserMedia();
    });
})(jQuery);
