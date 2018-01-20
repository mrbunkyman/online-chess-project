var init = function() {
    //config 
    var cfg = {
        position:'start', // default start positions
        showNotation:false, // remove abcdef stuff
        draggable:true // draggable pieces
    }
    //start the board
    var board = new ChessBoard('board',cfg);

    };


    $(document).ready(init);