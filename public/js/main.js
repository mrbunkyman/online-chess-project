var newGame;

var init = function(){
    var engine = engineGame();
    newGame = function(){
        engine.reset();
        engine.setDepth();
        engine.setPlayerColor("white");
        engine.start();
    }

    newGame();
}

$(document).ready(init);

