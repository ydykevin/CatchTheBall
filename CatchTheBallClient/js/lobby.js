$(document).ready(function () {

    var server = "http://192.168.1.8:5000/";

    document.addEventListener('init', function (event) {
        var page = event.target;

        if (page.id === 'lobbyPage') {

            if (!window.localStorage.getItem("username")) {
                window.location.href = "../index.html";
            }

            var socket = io.connect(server);

            $("#signOutBtn").click(function () {
                window.localStorage.clear();
                socket.emit('doDisconnect');
                window.location.href = "../index.html";
            });

            $("#createRoomBtn").click(function () {
                socket.emit('doDisconnect');
                window.location.href = "room.html";
            });

            socket.emit('roomList', JSON.stringify(false));
            socket.on('roomList', function (message) {
                console.log(message);
                if(message.length==0) {
                    $("#roomList").innerHTML = "No room";
                } else {
                    $("#roomList").empty();
                    for (var i = 0; i < message.length; i++) {
                        var roomID = message[i].roomID;
                        $("#roomList").append('<ons-card id="card'+roomID+'"><div><div style="display: inline">Room ID: '+roomID+'</div><div style="display: inline;float: right">Player: '+message[i].userList.length+'</div></div></ons-card>');
                        $("#card"+roomID).on('click', function(){
                            socket.emit('doDisconnect');
                            window.location.href = "room.html?roomID="+roomID;
                        });
                    }
                }
            });

            window.fn = {};

            window.fn.open = function () {
                var menu = document.getElementById('menu');
                menu.open();
            };

        }
    });


});