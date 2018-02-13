
function SocketClient(){
    var socket = io.connect();   
    var engineGame;
    var headline = $('#headline');
    var messages = $('#messages');
    var chatBox = $("#chatBox");
    var chat = $('#chat');
    var roomIdForm = $('#roomIdForm');
    var roomIdInput = $('#roomIdInput');
    var newGameButton = $("#newGameButton");
    var showRoomId = $('#showRoomId');
    var nameForm = $('#nameForm');
    var nameInput = $('#nameInput');
    var name =$("#name");
    var joinGame = $('#joinGame');
    var hostName=$('#hostName');

    var game; // attach the game board and engine

    var room; // testing

    var board; // server sends opponent move to board

    newGameButton.click(function(){
        if(board.isCompetingCpu()){
            board.reset();
        } else {
            socket.emit("newGameRequest",room);
        }

        //board.reset();
    })
    //Enter room with Id
    nameForm.submit(function(){
         socket.emit("sendName",nameInput.val());
         name.text(nameInput.val());
         nameInput.val('');
         nameForm.hide();
         return false;
    })

    joinGame.submit(function(){
        if(room)
            socket.emit("joinRequestTo",hostName.val());
        else{
            alert("You did not have a name");
        }
            //console.log('send join request');
        hostName.val('');
        return false;
    })

    //Send message to server
    chatBox.submit(function(){
        //send this to the server
        //socket.emit("sendMessage",room,chat.val());
        socket.emit("sendMessage",room,chat.val());
        var li = $('<li/>').append($('<p/>',{
            text:chat.val(),
            class:"message recipient-message"
        }))
        messages.append(li);
        chat.val('');
        return false;
    })

    socket.on("joinRequestFrom",function(socketId){
        console.log("join request from " + socketId);
        if(board.isCompetingCpu()){
            var confirm = window.confirm("Join Request, Do you accept?");
            if(confirm){
                socket.emit("joinRequestAnswer","yes",socketId);
                board.setOrientation('white');
                board.competingHuman();
                board.reset();
            }
            
        } else {
            socket.emit("joinRequestAnswer","no",socketId);
        }
    })

    socket.on("newGameRequest",function(){
        var confirm = window.confirm("You won! Opponent want to reset the game");
        if(confirm){
            socket.emit("newGame",room);
        }
    })

    socket.on("newGame",function(){
        board.reset();
    })

    socket.on('roomId',function(roomId){
        room = roomId;
        //showRoomId.text('Room ID : ' + room);
    })


    socket.on("joinRoom",function(newRoom,host){
        window.alert("Joined room " + host);
        room = newRoom;
        socket.emit("joinRoom",room);
        board.setOrientation('black');
        board.competingHuman();
        board.reset();
    });
    socket.on("nameError",function(message){
        window.alert(message);
        name.text("Unknown");
        nameForm.show();
    })

    socket.on('greetings',function(msg){
        console.log(msg);
    });

    socket.on('move',function(moveData){
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
            class:"message sender-message"
        }))
        messages.append(li);
    })

    socket.on('opponentDisconnect',function(){
        alert("Opponent left the room");
        board.setOrientation('white');
        board.competingCpu();
        board.reset();
    })

    return {
        setBoard:function(newBoard){
            board= newBoard;
        },
        sendMove:function(playerColor,source,target,promo){
            socket.emit("move",room,{color:playerColor, from:source,to:target,promotion:promo||''});
        },requestNewGame:function(){

            socket.emit("newGameRequest",room);
        }
    }
}