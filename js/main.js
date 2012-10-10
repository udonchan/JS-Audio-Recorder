var rec;

function gotStreamCallback(s){
    rec = new Recorder(new webkitAudioContext().createMediaStreamSource(s));
    $('#rec').prop("disabled", false);
}

function gotStreamFailed(e){
    alert(e);
}

$(document).ready(function(){
    var isRecording = false;
    var blob;
    
    $('#rec').prop("disabled", true);
    $('#download').prop("disabled", true);
    

    getUserMedia();

    $('#rec').click(function(){
	if(!isRecording){
	    console.log('start recording');	    
	    $('#rec').text("stop");
	    $('#download').prop("disabled", true);
	    rec.record();
	} else {
	    console.log('stop recording');
	    $('#rec').text("record");
	    $('#download').prop("disabled", false);
	    rec.stop();
	    rec.exportWAV(function(b){
		$('#player').attr("src", webkitURL.createObjectURL(blob = b));
	    });
	}
	isRecording = !isRecording;
    });

    $('#download').click(function(){
	Recorder.forceDownload(blob);
    });
});

