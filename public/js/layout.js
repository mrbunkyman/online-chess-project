
var init = function(){
    document.getElementById("login").onclick=function(){
        window.location.href="/login";
    }
    document.getElementById("vscpu").onclick=function(){
        window.location.href="/vscpu";
    }
}

$(document).ready(init);