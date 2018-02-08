
function Board(){
    var socket;
    var chess = Chess();
    var chessEngine;
    var color;

    var isCompetingCpu = false; // true until a player connects;
    var onDragStart = function(source, piece, position, orientation) {
        if (chess.game_over() === true || ( chess.turn()!=color)||
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
        } 
      };

      var onDrop = function(source, target) {
        // see if the move is legal
        var turn = chess.turn();
        var move = chess.move({
            from: source,
            to: target,
            //promotion: document.getElementById("promote").value
        });

        // illegal move
        if (move === null) return 'snapback';
        updateStatus();
        //player just end turn, CPU starts searching after a second
        if(isCompetingCpu)
            window.setTimeout(chessEngine.prepareAiMove(),500);
        else { 
            socket.sendMove(turn, move.from, move.to);
        }
    };

    var updateStatus= function(){
        var status = "";
        var moveColor = "White";
        if(chess.turn()=='b'){   
            moveColor = "Black";
        }
        if(chess.in_checkmate()==true){
            status=  "Game Over, " + moveColor + " is in check mate";
            window.alert(status);
            return; 
        } else if(chess.in_draw()){
            status = "Game Over, Drawn";
            window.alert(status);
            return;
        }

    }
    
    var cfg = {
        showErrors: true,
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
    };

    var board = new ChessBoard('board', cfg);

    return {
        setSocket:function(newSocket){
            socket = newSocket;
        }, setChessEngine:function(engine){
            chessEngine = engine;
        },setOrientation:function(playerColor){
            color = playerColor.charAt(0).toLowerCase();
            if(color=='w' || color=='b')
                board.orientation(playerColor);
        },setFenPosition:function(){
            board.position(chess.fen());
        },getMoveHistory:function(){
            return chess.history({verbose:true});
        }, getPgn:function(){
            return chess.pgn();
        }, getFen:function(){
            return chess.fen();
        }, getTurn:function(){
            return chess.turn();
        }, isGameOver:function(){
            return chess.game_over();
        }, makeMove:function(source, target, promo ){
            chess.move({from:source,to:target,promotion:promo});//chessEngine.prepareAiMove();
        }, reset:function(){
            chess.reset();
            board.start();
        },startBoard:function(){
            board.start();
        }
    }
    
}