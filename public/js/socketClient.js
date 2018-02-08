function SocketClient(){
        var socket = io.connect('http://localhost:3000');    var engineGame;
    var headline = $('#headline');
    var messages = $('#messages');
    var chatBox = $("#chatBox");
    var chat = $('#chat');
//  var isCompetingCpu;
    var roomIdForm = $('#roomIdForm');
    var roomIdInput = $('#roomIdInput');
    var newGameButton = $("#newGameButton");
    var showRoomId = $('#showRoomId');

    var game; // attach the game board and engine

    var room; // testing

    var board; // server sends opponent move to board

    // if(isCompetingCpu){
    //     headline.text("Competing Computer");
    // } else {
    //     headline.text("Competing SomeGuy");
    // }

    newGameButton.click(function(){
        console.log("clicked");
        socket.emit("newGame",room);
        board.reset();
    })
    //Enter room with Id
    roomIdForm.submit(function(){
        //send this to the server
        room = roomIdInput.val();
        socket.emit('joinRoom',room);
        board.setOrientation('black');
        showRoomId.text("Room ID : " + room);
        roomIdInput.val('');
        return false;
    })

    //Send message to server
    chatBox.submit(function(){
        //send this to the server
        //socket.emit("sendMessage",room,chat.val());
        socket.emit("sendMessage",room,chat.val());
        chat.val('');
        return false;
    })

    socket.on("newGame",function(){
        board.reset();
    })
    socket.on('roomId',function(roomId){
        room = roomId;
        showRoomId.text('Room ID : ' + room);
    })
    socket.on('greetings',function(msg){
        console.log(msg);
    });

    socket.on('move',function(moveData){
        console.log(moveData);
        var from,to,promo;
        from = moveData.from;
        to = moveData.to;
        promo = moveData.promo;
        board.makeMove(from, to,promo);
        board.setFenPosition();
    })

    //recieve message from other player
    socket.on('sendMessage',function(message){
        var li = $('<li/>').append($('<p/>',{
            text:message,
            class:"sender"
        }))
        messages.append(li);
    })

    return {
        setBoard:function(newBoard){
            board= newBoard;
        },
        sendMove:function(playerColor,source,target,promo){
            socket.emit("move",room,{color:playerColor, from:source,to:target,promotion:promo||''});
        }
    }
}