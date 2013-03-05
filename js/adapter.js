(function(window){
    if(window.navigator.getUserMedia) return;

    if (window.navigator.mozGetUserMedia) {
        console.log("This appears to be Firefox");

        window.webrtcDetectedBrowser = "firefox";

        // The RTCPeerConnection object.
        if(window.RTCPeerConnection === undefined){
            window.RTCPeerConnection = mozRTCPeerConnection;
        }
        // The RTCSessionDescription object.
        if(window.RTCSessionDescription === undefined){
            window.RTCSessionDescription = mozRTCSessionDescription;
        }

        // The RTCIceCandidate object.
        if(window.RTCIceCandidate === undefined){
            window.RTCIceCandidate = mozRTCIceCandidate;
        }

        // Get UserMedia (only difference is the prefix).
        // Code from Adam Barth.
        if(window.navigator.getUserMedia === undefined){
            window.navigator.getUserMedia = window.navigator.mozGetUserMedia;
        }

        // Attach a media stream to an element.
        window.attachMediaStream = function(element, stream) {
            console.log("Attaching media stream");
            element.mozSrcObject = stream;
            element.play();
        };

        window.reattachMediaStream = function(to, from) {
            console.log("Reattaching media stream");
            to.mozSrcObject = from.mozSrcObject;
            to.play();
        };

        // Fake get{Video,Audio}Tracks
        MediaStream.prototype.getVideoTracks = function() {
            return [];
        };

        MediaStream.prototype.getAudioTracks = function() {
            return [];
        };
    } else if (window.navigator.webkitGetUserMedia) {
        console.log("This appears to be Chrome");

        webrtcDetectedBrowser = "chrome";

        // The RTCPeerConnection object.
        if(window.RTCPeerConnection === undefined){
            window.RTCPeerConnection = webkitRTCPeerConnection;
        }
        
        // Get UserMedia (only difference is the prefix).
        // Code from Adam Barth.
        if(window.navigator.getUserMedia === undefined){
            window.navigator.getUserMedia = window.navigator.webkitGetUserMedia;
        }

        // Attach a media stream to an element.
        window.attachMediaStream = function(element, stream) {
            element.src = webkitURL.createObjectURL(stream);
        };

        window.reattachMediaStream = function(to, from) {
            to.src = from.src;
        };

        // The representation of tracks in a stream is changed in M26.
        // Unify them for earlier Chrome versions in the coexisting period.
        if (!webkitMediaStream.prototype.getVideoTracks) {
            webkitMediaStream.prototype.getVideoTracks = function() {
                return this.videoTracks;
            };
            webkitMediaStream.prototype.getAudioTracks = function() {
                return this.audioTracks;
            };
        }

        // New syntax of getXXXStreams method in M26.
        if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
            webkitRTCPeerConnection.prototype.getLocalStreams = function() {
                return this.localStreams;
            };
            webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
                return this.remoteStreams;
            };
        }
    } else {
        console.log("Browser does not appear to be WebRTC-capable");
    }
})(window);
