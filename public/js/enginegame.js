

function engineGame(options){
    var board;
    var stockFish = new Worker('./lib/stockfish/stockfish.js');
    var chess = Chess();
    var engine = stockFish;
     // show the engine status to the front end
    var isEngineReady = false; // default
   //var engineFeedback = null; // the format could be Depth: <something> Nps: <something> 

    var time = { depth:5 };
    var playerColor = "white"; //default


    //interface to send commands to the UCI
    function uciCmd(cmd){
        console.log("[INPUT] UCI: " + cmd);
        engine.postMessage(cmd);
    }

    // tell the engine to use UCI
    uciCmd('uci');

    function reportEngineStatus(){
        var status = 'Engine ';
        if(!isEngineReady){
            status+='Loading ...';
        } else {
            status+='Ready';
        }
        $(".engineStatus").html(status);
        
    }
    //get all the moves were made 
    function getMoves(){
        var moves = "";
        var history = chess.history({verbose:true});
        for(var i =0;i<history.length;i++){
            var move = history[i];
            moves+= " " + move.from + move.to + (move.promotion?move.promotion:"");
        }
        console.log("MOVES : " + moves);
        return moves;
    }
    //prepare the move, this function asks the engine to start
    //look for best move, the engine will invoke onmessage when
    //it has completed search within specific depth

    function prepareMove(){
        $('.logger').text(chess.pgn()+'\n');
       
        console.log("CPU is thinking ... ");
        //update the latest board positions before search for moves
        board.position(chess.fen());
        var turn = chess.turn()=='w'?'white':'black';

        if(!chess.game_over() && turn!=playerColor){
            //tell the engines all the moves that were made
            uciCmd('position startpos moves ' + getMoves());
            //start searching, if depth exists, use depth paramter, else let the engine use default
            uciCmd('go '+(time.depth?'depth ' +time.depth:''));
        }
    }

    engine.onmessage = function(event){
        var line = event.data?event.data:event;
        console.log("[OUTPUT] UCI :" + line);
        if(line == 'readyok'){
            isEngineReady=true;
            reportEngineStatus();
        } else {
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            console.log("match " + match);
            if(match){
                chess.move({from:match[1],to:match[2],promotion:match[3]});
                //window.setTimeOut(updateStatus,200);
                prepareMove();
            }
        }
    }

    //set up the board
    var onDragStart = function(source, piece, position, orientation) {
        if (chess.game_over() === true ||
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
                
                return false;
        } 
      };

      var onDrop = function(source, target) {
        // see if the move is legal
        var move = chess.move({
            from: source,
            to: target,
            //promotion: document.getElementById("promote").value
        });

        // illegal move
        if (move === null) return 'snapback';
        updateStatus();
        //player just end turn, CPU starts searching after a second
        window.setTimeout(prepareMove,500);
        
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

    board = new ChessBoard('board', cfg);
    
    return {
        reset:function(){
            // reset the board position
            chess.reset();
        },
        setPlayerColor:function(color){ // set the player color, black or white
            playerColor = color;
            board.orientation(playerColor);
        },
        setDepth:function(depth){
            time = {depth:depth}
        },
        start:function(){
            uciCmd('ucinewgame');
            uciCmd('isready');
            reportEngineStatus();
            board.start;
            prepareMove();
        }


    }


}
