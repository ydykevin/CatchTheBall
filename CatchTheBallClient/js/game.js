$(document).ready(function () {

    if(!window.localStorage.getItem("username")){
        window.location.href="../index.html";
    }

    var server = "http://192.168.1.8:5000/";

    var socket = io.connect(server);

    socket.emit('create_room', JSON.stringify({"username": window.localStorage.getItem("username")}));

    socket.on('disconnect',function(message){
        window.location.href="lobby.html";
    });

    socket.on('message',function(message){
        console.log(message);
    });

});