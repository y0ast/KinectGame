var animal = 0;

var timestart = 0;
var timeend = 0;

$(function (){
    for(var i = 0; i<gridSizey; i++){
        $("#grid").append('<tr id="' + i + '">');        
        for(var j=0;  j<gridSizex; j++){
           $("#" + i).append('<td id="' + i + '-' + j + '"></td>'); 
        }
        $(".grid").append('</tr>');        
    }

    $("td").css("width",1200/gridSizex);
    $("td").css("height",700/gridSizey);

    var sound = new Audio("PUNCH.wav");
    sound.preload = 'auto';
    sound.load();

    var ce = document.createElement('div');
    ce.id = 'mycursor';
    document.body.appendChild(ce);
});



function createID(x,y){
    id = "#" + x + "-" + y;
    return id;
}

function setAnimal(){
    if(animal == level.length){
        alert("done!");
        return false;
    }
    //append an image to the right place in the grid
    x = level[animal][0];
    y = level[animal][1];
    id = createID(x,y);
    console.log(id);
    $(id).append('<img src="furry' + animal + '.png"></img>');
    $("img").css("margin-left",(700/gridSizey - 50)/2);

    timestart = new Date().getTime() / 1000; 

    $(id).click(function (){
        $(this).off('click');
        $(this).html("");
        timeend = new Date().getTime() / 1000;
        //score();
        animal += 1;
        setAnimal();
    });
}

function fireClick(){
    x = ce.css("left");
    y = ce.css("top");
    console.log([x,y]);
    $(document.elementFromPoint(x, y)).click();  
}




function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

var hand = zig.EngageFirstUserInSession();
 
hand.addEventListener('sessionstart', function(focusPosition) {
    console.log("started");
    addPull();
    addPush();
    ce.style.display = 'block';
});

hand.addEventListener('sessionend', function() {
    console.log("ended");
});

hand.addEventListener('sessionupdate', function(position) {

    var d = $V(position).subtract($V([0,0,0])).elements;

    var val = [clamp((d[0]/300) + 0.5, 0, 1),
               clamp((d[1]/250), 0, 1),
               clamp(d[2]/ + 0.5, 0, 1)];

    ce.style.left = (val[0] * window.innerWidth - (ce.offsetWidth / 2)) + "px";
    ce.style.top = ((1- val[1]) * window.innerHeight - (ce.offsetHeight / 2)) + "px";
});

// PushDetector
var pushDetector = zig.controls.PushDetector();

function addPush(){
    pushDetector.addEventListener('push', function(pd) {

        console.log('PushDetector: Push');
        ce.classList.add('pushed');
        var click=sound.cloneNode();
        click.play();
        fireClick();
    });
    pushDetector.addEventListener('release', function(pd) {
        console.log('PushDetector: Release');
        ce.classList.remove('pushed');
    });
    pushDetector.addEventListener('click', function(pd) {
        console.log('PushDetector: Click');
    });
}

function removePush(){
    console.log("remove push");
    pushDetector.removeEventListener('push');
    pushDetector.removeEventListener('release');
    pushDetector.removeEventListener('click');
}

zig.singleUserSession.addListener(pushDetector);

//PullDetector
var pullDetector = zig.controls.PullDetector();

function addPull(){
    console.log("add pull");
    pullDetector.addEventListener('pull', function(pd) {
        console.log('PullDetector: Pull');
        ce.classList.add('pulled');
        var click=sound.cloneNode();
        click.play();
        fireClick();
    });
    pullDetector.addEventListener('release', function(pd) {
        console.log('PullDetector: Release');
        ce.classList.remove('pulled');
    });
    pullDetector.addEventListener('click', function(pd) {
        console.log('PullDetector: Click');
    });
}

function removePull(){
    console.log("remove pull");
    pullDetector.removeEventListener('pull');
    pullDetector.removeEventListener('release');
    pullDetector.removeEventListener('click');
}


zig.singleUserSession.addListener(pullDetector);

zig.addListener(hand);



