var board;
var game = new Chess();
var init = function() {
    //config 
    var onChange = function(oldPos, newPos) {
        // console.log("Position changed:");
    };

      var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
        } 
      };

    var onDrop = function(source, target, peice){
        var move = game.move({
            from:source,
            to:target,
            promotion:'q'
        })
        if(move===null) return 'snapback';
        else {
            console.log(peice + " moves from " + source + " to " + target);
        }
        
        updateStatus();
        window.setTimeout(makeRandomMove,500);
        };

    //console log
    var updateStatus= function(){
        var status = "";
        var moveColor = "White";
        if(game.turn()=='b'){   
            moveColor = "Black";
        }
        if(game.in_checkmate()==true){
            status=  "Game Over, " + moveColor + " is in check mate";
        } else if(game.in_draw()){
            status = "Game Over, Drawn";
        } else {
            status  = moveColor + " turn : " ;
            if(game.in_check()){
                status += ' ( IN CHECK ) ';
            }
        }
        console.log(status);
    }

    //for testing 
    var makeRandomMove = function(){
        var possibleMoves = game.moves();
        if (possibleMoves.length === 0) return;
        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);
        board.position(game.fen());
        updateStatus();
      }

    var cfg = {
        position:'start', // default start positions
        showNotation:false, // remove abcdef stuff
        draggable:true, // draggable pieces
        onDragStart:onDragStart, // run on dragStart 
        onChange:onChange,
        onDrop:onDrop,
    }
    //start the board
    board = new ChessBoard('board',cfg);
    }

    $(document).ready(init);

    


 