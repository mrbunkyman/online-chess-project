var newGame;
var socket;
var engine;
var board;
var init = function(){
    engine = EngineGame();
    socket = SocketClient();

    board = Board();
    board.setChessEngine(engine);
    board.setSocket(socket);
    newGame = function(){
        engine.setBoard(board);
        engine.reset();
        engine.setDepth();
        engine.setPlayerColor("white");
        engine.start();
    }
    socket.setBoard(board);
    newGame();
}

$(document).ready(init);

