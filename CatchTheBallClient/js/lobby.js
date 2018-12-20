$(document).ready(function () {

    var server = "http://192.168.1.8:5000/";

    document.addEventListener('init', function (event) {
        var page = event.target;

        if (page.id === 'lobbyPage') {
            var socket = io.connect(server);

            if (!window.localStorage.getItem("username")) {
                window.location.href = "../index.html";
            }

            $("#signOutBtn").click(function () {
                window.localStorage.clear();
                window.location.href = "../index.html";
            });

            $("#createRoomBtn").click(function () {
                socket.disconnect();
                window.location.href = "game.html";
            });

            //setInterval(function(){
            //socket.emit('event', JSON.stringify({"setSidByUsername": window.localStorage.getItem("username")}));
            //},1000);
            //socket.emit('event',JSON.stringify({"broadcast":"broadcast"}));

            // socket.on('disconnect',function(message){
            //     window.location.href="../index.html";
            // });

            // $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
            //     console.log(JSON.stringify(data, null, 2));
            //     alert(JSON.stringify(data, null, 2));
            // });

            socket.emit('roomList', JSON.stringify(false))
            socket.on('roomList', function (message) {
                console.log(message);
                if(message.length==0) {
                    $("#roomList").innerHTML = "No room";
                } else {
                    $("#roomList").empty();
                    for (var i = 0; i < message.length; i++) {
                        $("#roomList").append('<ons-card><div style="display: inline">Room ID: '+message[i].roomID+'</div><div style="display: inline;float: right">Player: '+message[i].userList.length+'</div></ons-card>');
                    }
                }
                // if(message.other) {
                //     alert("Your account is logged in from other place");
                // }

            });

            window.fn = {};

            window.fn.open = function () {
                var menu = document.getElementById('menu');
                menu.open();
            };

            // setTimeout(function(){
            //     socket.disconnect();
            // },5000);

        }
    });


});