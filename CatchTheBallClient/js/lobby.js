$(document).ready(function () {

    document.addEventListener('init', function (event) {
        var page = event.target;

        if (page.id === 'lobbyPage') {

            if (!window.localStorage.getItem("username")) {
                window.location.href = "../index.html";
            }

            $("#signOutBtn").click(function () {
                window.localStorage.clear();
                window.location.href = "../index.html";
            });

            $("#createRoomBtn").click(function () {
                window.location.href = "room.html";
            });

            var loading = false;

            function getRoom(){
                $.ajax({
                    url: server + "room",
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: function () {
                        loading = true;
                    },
                    success: function (response) {
                        if (response.data.length === 0) {
                            document.getElementById("roomList").innerHTML = "No room";
                        } else {
                            $("#roomList").empty();
                            for (var i = 0; i < response.data.length; i++) {
                                var room = JSON.parse(response.data[i]);
                                var roomID = room.roomID;
                                $("#roomList").append('<ons-card name="'+roomID+'" class="room"><div><div style="display: inline">Room ID: ' + roomID + '</div><div style="display: inline;float: right">Player: ' + room.userList.length + '</div></div></ons-card>');
                            }
                            $(".room").on('click', function () {
                                window.location.href = "room.html?roomID=" + $(this).attr('name');
                            });
                        }
                        loading = false;
                    },
                    error: function (XML, status, err) {
                        console.log(err);
                        loading = false;
                    }
                });
            }

            getRoom();
            setInterval(function(){
                if(!loading) {
                    getRoom();
                }
            },5000);

            window.fn = {};

            window.fn.open = function () {
                var menu = document.getElementById('menu');
                menu.open();
            };

        }
    });


});