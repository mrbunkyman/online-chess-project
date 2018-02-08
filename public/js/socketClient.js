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
    var nameForm = $('#nameForm');
    var nameInput = $('#nameInput');
    var name =$("#name");
    var joinGame = $('#joinGame');
    var hostName=$('#hostName');

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
    nameForm.submit(function(){
         socket.emit("sendName",nameInput.val());
         name.text(nameInput.val());
         nameInput.val('');
         nameForm.hide();
         return false;
    })
    joinGame.submit(function(){
        socket.emit("joinRequestTo",hostName.val());
        console.log('send join request');
        hostName.val('');
        return false;
    })

    // roomIdForm.submit(function(){
    //     //send this to the server
    //     room = roomIdInput.val();
    //     socket.emit('joinRoom',room);
    //     board.setOrientation('black');
    //     showRoomId.text("Room ID : " + room);
    //     roomIdInput.val('');
    //     return false;
    // })

    //Send message to server
    chatBox.submit(function(){
        //send this to the server
        //socket.emit("sendMessage",room,chat.val());
        socket.emit("sendMessage",room,chat.val());
        chat.val('');
        return false;
    })

    socket.on("joinRequestFrom",function(socketId){
        console.log("join request from " + socketId);
        var confirm = window.confirm("Join Request, Do you accept?");
        if(board.isCompetingCpu() && confirm){
            socket.emit("joinRequestAnswer","yes",socketId);
            board.setOrientation('white');
            board.competingHuman();
        } else {
            socket.emit("joinRequestAnswer","no",socketId);
        }
    })
    socket.on("newGame",function(){
        board.reset();
    })
    socket.on('roomId',function(roomId){
        room = roomId;
        //showRoomId.text('Room ID : ' + room);
    })
    // socket.on("getName",function(){
    //     var name = null;
    //     name =window.prompt("Enter you name : " , "Immortal Joe");
    //     if(name!=null){
    //         socket.emit("sendName",name);
    //     }
    // })
    socket.on("joinRoom",function(newRoom,host){
        window.alert("Joined room " + host);
        room = newRoom;
        console.log(room);
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
            console.log("sent move to " + room);
            socket.emit("move",room,{color:playerColor, from:source,to:target,promotion:promo||''});
        }
    }
}