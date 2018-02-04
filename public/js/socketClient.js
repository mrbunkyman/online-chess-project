$(function(){
    var socket = io.connect('http://localhost:3000');
    var isCompetingCpu = true; // true by default;
    var headline = $('#headline');
    var messages = $('#messages');
    var chatBox = $("#chatBox");
    var chat = $('#chat');

    var roomIdForm = $('#roomIdForm');
    var roomIdInput = $('#roomIdInput');

    var showRoomId = $('#showRoomId');

    var room; // testing

    if(isCompetingCpu){
        headline.text("Competing Computer");
    } else {
        headline.text("Competing SomeGuy");
    }

    //Enter room with Id
    roomIdForm.submit(function(){
        //send this to the server
        room = roomIdInput.val();
        socket.emit('joinRoom',room);
        showRoomId.text("Room ID : " + room);
        roomIdInput.val('');
        return false;
    })

    //Send message to server
    chatBox.submit(function(){
        //send this to the server
        socket.emit("sendMessage",room,chat.val());
        chat.val('');
        return false;
    })
    socket.on('roomId',function(roomId){
        room = roomId;
        showRoomId.text('Room ID : ' + room);
    })
    socket.on('greetings',function(msg){
        console.log(msg);
    });
    //recieve message from other player
    socket.on('sendMessage',function(message){
        var li = $('<li/>').append($('<p/>',{
            text:message,
            class:"sender"
        }))
        messages.append(li);
    })


    


})