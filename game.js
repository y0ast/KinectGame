var animal = 0;

var delay = 500;

var clickedinarea = false;

console.log("Browser plugin installed: " + zig.pluginInstalled);
console.log("Zig.js version: " + zig.version);
console.log("Sensor connected: " + zig.sensorConnected);

var ce = document.createElement('div');
ce.id = 'mycursor';

var succes = new Audio("sound/PUNCH.wav");
succes.preload = 'auto';
succes.load();

var wrong = new Audio("sound/wrong.mp3");
wrong.preload = 'auto';
wrong.load();


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

    document.body.appendChild(ce);

    setTimeout(function(){setAnimal()},3000);

    console.log(window.innerWidth);

    //mean code to get out the nasty logo
    // setTimeout(function(){$("img[alt='Powered by Zigfu']").first().hide()},500);
});

zig.addEventListener('statuschange', function() {
        console.log("Sensor connected: " + zig.sensorConnected);
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
    //put an image in the right place in the grid
    x = level[animal][0];
    y = level[animal][1];
    id = createID(x,y);

    $(id).append('<img class="' + level[animal][2] + '" src="img/furry' + animal + '.png"></img>');
    $("img").css("margin-left",(700/gridSizey - 50)/2);

    $(id).click(function (direction){
        clickedinarea = true;
        console.log("clickinggg");
        console.log(direction);

        if ($(this).children("img").hasClass(direction)) {
            $(this).off('click');

            //Very ugly code
            if($this.children("img").hasClass("push")){
                $this.children("img").addClass("fade");
            } else {
                $this.children("img").addClass("grow");
            }

            var click=succes.cloneNode();
            click.play();

            setTimeout($(this).html(""),850);
            
            animal += 1;
            setAnimal();
        }
        else {
            var click=wrong.cloneNode();
            click.play();
        }
    });
}

function fireClick(direction){
    clickedinarea = false;
    console.log(window.innerWidth);
    x = window.innerWidth - parseFloat($(ce).css("left").slice(0,-2)) + "px" ;
    y = $(ce).css("top");
    console.log([x,y]);
    $(document.elementFromPoint(x, y)).click(direction);
    setTimeout(function(){
        if(clickedinarea == false){
            var click=wrong.cloneNode();
            click.play();
        }
    },500);
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

    // console.log(val);
});

// PushDetector and Pull detector
var pushDetector = zig.controls.PushDetector();

var pullDetector = zig.controls.PullDetector();

function addPush(){
    console.log("add push");
    pushDetector.addEventListener('push',
                                  function(pd) {
                                    setTimeout(addPull, delay);
                                    removePull();
                                    fireClick("push");
                                    console.log('PushDetector: Push');
                                    ce.classList.add('pushed');
                                  });

    pushDetector.addEventListener('release', function(pd) {
        console.log('PushDetector: Release');
        ce.classList.remove('pushed');
    });
    pushDetector.addEventListener('click', function(pd) {
        console.log('PushDetector: Click');
    });
}

//Remove push eventlisteners
function removePush(){
    console.log("remove push");
    pushDetector.removeEventListener('push');
    pushDetector.removeEventListener('release');
    pushDetector.removeEventListener('click');
}

//Add the pull event listeners
function addPull(){
    console.log("add pull");
    pullDetector.addEventListener('pull',
                                  function(pd) {
                                    setTimeout(addPush, delay);;
                                    removePush();
                                    fireClick("pull");
                                    console.log('PullDetector: Pull');
                                    ce.classList.add('pulled');
                                  });
    
    pullDetector.addEventListener('release', function(pd) {
        console.log('PullDetector: Release');
        ce.classList.remove('pulled');
    });
    pullDetector.addEventListener('click', function(pd) {
        console.log('PullDetector: Click');
    });
}

//Remove the pull event listeners
function removePull(){
    console.log("remove pull");
    pullDetector.removeEventListener('pull');
    pullDetector.removeEventListener('release');
    pullDetector.removeEventListener('click');
}

//Init push/pull event listeners
zig.singleUserSession.addListener(pushDetector);
zig.singleUserSession.addListener(pullDetector);

//Init the hand
zig.addListener(hand);