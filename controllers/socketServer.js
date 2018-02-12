var users = []
function generateRoomId() {
  var result = "";
  var length = 16; 
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@";

  for (var i = 0; i < length; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));

  return result;
}

//socket io listen to connection
exports = module.exports = function(io){
    io.on('connection',function(socket){

        io.emit("greetings","welcome to chess online");
        //io.to(socket.id).emit("getName");
        socket.on('sendName',sendName)
      
        socket.on("joinRequestTo",joinRequestTo)
      
        socket.on('joinRequestAnswer',joinRequestAnswer)
      
       socket.on("joinRoom",joinRoom)
      
        socket.on('sendMessage',broadcastMessageToRoom);
      
        socket.on('move', broadcastMove);
      
        socket.on('newGameRequest',newGameRequest);
        socket.on('newGame',newGame);
      
        socket.on('disconnect',disconnect)
      
        function broadcastMessageToRoom(room, message){
          socket.broadcast.to(room).emit("sendMessage",message);
        }
      
        function broadcastMove(room, moveData){
          socket.broadcast.to(room).emit("move",moveData);
        }
        function newGame(room){
          io.to(room).emit("newGame");
        }
      
        function newGameRequest(room){
          if(room)
            socket.broadcast.to(room).emit("newGameRequest");
        }
      
        function joinRequestTo(name){
          console.log('sendRequest to ' + name);
          for(var i=0;i<users.length;i++){
            if(users[i].name===name){
              socket.broadcast.to(users[i].room).emit("joinRequestFrom",socket.id);
              break;
            }
          }
        }
      
        function joinRoom(room){
          console.log("joined room" + room);
          socket.broadcast.to(room).emit("sendMessage","SERVER : a user just joined");
          if(room){
            socket.join(room);
            users.filter(user=>user.id == socket.id)[0].room = room;
          }
        }
        function sendName(name){
          var isNameValid = true;
          for(var i=0;i<users.length;i++){
            if(users[i].name===name){
              isNameValid = false;
              socket.emit('nameError','Name is already existed, Try again');
              return;
            }
          }
          if(isNameValid){
            var room = generateRoomId();
            users.push({id:socket.id, name:name, room:room});
            socket.join(room);
            socket.emit("roomId",room);
          } 
        }
      
        function joinRequestAnswer(answer,socketId){
          var user = users.filter(user=>user.id == socket.id)[0];
      
          if(answer=="yes"){
            socket.to(socketId).emit("joinRoom",user.room, user.name);
          }
        }
        function disconnect(){
          for(var i =0;i<users.length;i++){
            if(users[i].id == socket.id){
              socket.broadcast.to(users[i].room).emit("opponentDisconnect");
              users.splice(i,1);
              break;
            }
          }
      
        }
      
      })
      
}
