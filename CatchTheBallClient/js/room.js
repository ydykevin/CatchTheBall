$(document).ready(function () {

    if(!window.localStorage.getItem("username")){
        window.location.href="../index.html";
    }

    var socket = io.connect(server);

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    var roomID = getUrlVars()["roomID"];

    if(roomID){
        alert("join room"+roomID);
        socket.emit('join_room',JSON.stringify({"username": window.localStorage.getItem("username"), "roomID":Number(roomID)}));
    } else {
        alert("create");
        socket.emit('create_room', JSON.stringify({"username": window.localStorage.getItem("username")}));
    }

    socket.on('disconnect',function(message){
        window.location.href="lobby.html";
    });

    socket.on('roomInfo',function(message){
        console.log(JSON.parse(message));
    });

});