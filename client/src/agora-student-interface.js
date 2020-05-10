import AgoraRTC from 'agora-rtc-sdk';

var rtc = {
    client: null,
    joined: false,
    published: false,
    remoteStreams: [],
};

var option = {
    appID: "d91551fc6fad4f959d18306aa85bb569",
    channel: "",
    uid: null,
    token: ""
};

function initLecture (channelName) {
    
    option.channel = channelName;

    rtc.client = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8"
    });

    rtc.client.init(option.appID, function () {
        console.log("init client success");

        rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {

            console.log("join channel: " + option.channel + " success, uid: " + uid);

            rtc.client.on("stream-added", function (evt) {
                console.log("Stream added", evt.stream.getId());
                let remoteStream = evt.stream;                

                rtc.client.subscribe(remoteStream, function (err) {
                    console.log("Couldn't subscribe ", err);
                });
            });


            rtc.client.on("stream-subscribed", function (evt) {
                let remoteStream = evt.stream;
                remoteStream.play("play-area");
            });

            rtc.client.on("stream-removed", function (evt) {
                console.log("Remote stream removed");
                let remoteStream = evt.stream;
                remoteStream.stop();
            });

        }, function (err) {
            console.log("Client join failed ", err);
        });

    }, function (err) {
        console.log("Client init failed", err);
    });

    rtc.client.setClientRole("audience");

}

export {initLecture};