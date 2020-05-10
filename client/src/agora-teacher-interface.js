import AgoraRTC from 'agora-rtc-sdk';

// rtc object
var rtc = {
    joined: false,
    published: false,
    remoteStreams: [],
    params: []
};

// Options for joining a channel
var option = {
    appID: "d91551fc6fad4f959d18306aa85bb569",
    channel: "",
    uid: "",
    token: ""
};

var broadcasting = {
    joinChannel: false,
    stream: 1,
    publish: false
};

function initBroadcast(channelName) {

    option.channel = channelName;

    rtc.videoClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8"
    });

    rtc.screenClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8"
    });

    rtc.videoClient.init(option.appID, function () {
        console.log("init video client success");

        rtc.videoClient.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
            console.log("join channel: " + option.channel + " success, uid: " + uid);

            rtc.params.push(uid);
            broadcasting.joinChannel = true;

        }, function (err) {
            console.log("video client join failed", err);
        });

        rtc.videoClient.on("stream-published", function () {
            console.log("local video stream published");
        });

    }, (err) => {
        console.log("video client init failed", err);
    });

    rtc.videoClient.setClientRole("host");

    rtc.screenClient.init(option.appID, function () {
        console.log("init screen client success");

        rtc.screenClient.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
            console.log("join channel: " + option.channel + " success, uid: " + uid);

            rtc.params.push(uid);
            broadcasting.joinChannel = true;

        }, function (err) {
            console.log("screen client join failed", err);
        });

        rtc.screenClient.on("stream-published", function () {
            console.log("local screen stream published");
        });

    }, (err) => {
        console.log("screen client init failed", err);
    });

    rtc.screenClient.setClientRole("host");

};

function playStream() {
    if (!broadcasting.joinChannel) {
        return;
    } else {

        if (broadcasting.stream === 1) {
            rtc.localStream1 = AgoraRTC.createStream({
                streamID: rtc.params[0],
                audio: true,
                video: true,
                screen: false
            });

            rtc.localStream1.init(function () {
                console.log("init local stream 1 success");
                if (broadcasting.publish) {
                    rtc.screenClient.unpublish(rtc.localStream2, function (err) {
                        console.log("Unpublish failed", err);
                    });
                    rtc.localStream2.close();
                    rtc.localStream2.stop();
                }
                rtc.videoClient.publish(rtc.localStream1, function (err) {
                    console.log("Publishing failed ", err);
                });
                rtc.localStream1.play("play-area");
                broadcasting.publish = true;
            }, function (err) {
                console.log("init local stream 1 failed ", err);
            });

            broadcasting.stream = 2;
        } else {
            rtc.localStream2 = AgoraRTC.createStream({
                streamID: rtc.params[1],
                audio: true,
                video: false,
                screen: true
            });

            rtc.localStream2.init(function () {
                console.log("init local stream 2 success");
                if (broadcasting.publish) {
                    rtc.videoClient.unpublish(rtc.localStream1, function (err) {
                        console.log("Unpublish failed", err);
                    });
                    rtc.localStream1.close();
                    rtc.localStream1.stop();
                }
                rtc.screenClient.publish(rtc.localStream2, function (err) {
                    console.log("Publishing failed", err);
                });
                rtc.localStream2.play("play-area");
                broadcasting.publish = true;
            }, function (err) {
                console.log("init local stream 2 failed", err);
            });

            broadcasting.stream = 1;
        }
    }
}

export { initBroadcast, playStream };