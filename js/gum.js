function getUserMedia(){
    var source;
    if("webkitGetUserMedia" in navigator)
        navigator.webkitGetUserMedia(
	    {audio : true},
	    gotStreamCallback,
	    gotStreamFailed);
    else
        gotStreamFailed("This site rquires WebRTC. Please get Chrome or Opera or Firefox nightly build and set MediaStream available.");
}
