
var init = function(){
    document.getElementById("login").onclick=function(){
        window.location.href="/login";
    }
    document.getElementById("main").onclick=function(){
        window.location.href="/main";
    }
}

$(document).ready(init);