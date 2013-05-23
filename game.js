//Fix message for when level is finished
//Fix animation for new animal, now it's too fast

var animal = 0;

var delay = 500;

console.log("Browser plugin installed: " + zig.pluginInstalled);
console.log("Zig.js version: " + zig.version);
console.log("Sensor connected: " + zig.sensorConnected);

zig.addEventListener('statuschange', function() {
        console.log("Sensor connected: " + zig.sensorConnected);
    });

var ce = document.createElement('div');
ce.id = 'mycursor';

var img = document.createElement('img');
img.id = 'animal';


var succes = new Audio("sound/PUNCH.wav");
succes.preload = 'auto';
succes.load();

var wrong = new Audio("sound/wrong.mp3");
wrong.preload = 'auto';
wrong.load();


$(function (){
    document.body.appendChild(ce);
    document.body.appendChild(img);
    setTimeout(newAnimal(),1000);
    // Code to delete logo from the interface, breaks the game after one minute
    // setTimeout(function(){$("img[alt='Powered by Zigfu']").first().hide()},500);
});



function newAnimal(){
    $("#animal").removeClass();

    img.style.left = level[animal][0]+ "px";
    img.style.top = level[animal][1] + "px";

    img.style.width = imageSizex + "px";
    img.style.height = imageSizey + "px";

    $("#animal").attr("src", "img/furry" + world + "-" + animal + ".png");
    $("#animal").addClass(level[animal][2]);
}

function fireMotion(direction){
    //Get position of the cursor and correct for its size
    cursorleft = parseFloat(ce.style.left) - 25;
    cursortop = parseFloat(ce.style.top) - 25;

    //Get position of the image and correct for its size
    imageleft = parseFloat(img.style.left) - (imageSizex/2); 
    imagetop = parseFloat(img.style.top) - (imageSizey/2);

    distance = Math.sqrt(Math.pow(Math.abs(imageleft-cursorleft),2) + Math.pow(Math.abs(imagetop-cursortop),2));

    console.log("distance: " + distance);

    //Hit
    if(distance < difficulty && $("#animal").hasClass(direction)){
        console.log("succes")
        var click=succes.cloneNode();
        click.play();
        animal += 1;

        if($("#animal").hasClass("push")){
            $("#animal").addClass("fade");
        } else {
            $("#animal").addClass("grow");
        }
        setTimeout(newAnimal(),3000);
    } 
    else {
        var click=wrong.cloneNode();
        click.play();
    }
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

// PushDetector and Pull detector
var pushDetector = zig.controls.PushDetector();

var pullDetector = zig.controls.PullDetector();

function addPush(){
    console.log("add push");
    pushDetector.addEventListener('push',
                                  function(pd) {
                                    setTimeout(addPull, delay);
                                    removePull();
                                    fireMotion("push");
                                    console.log('PushDetector: Push');
                                  });
}

//Remove push eventlisteners
function removePush(){
    console.log("remove push");
    pushDetector.removeEventListener('push');
}

//Add the pull event listeners
function addPull(){
    console.log("add pull");
    pullDetector.addEventListener('pull',
                                  function(pd) {
                                    setTimeout(addPush, delay);;
                                    removePush();
                                    fireMotion("pull");
                                    console.log('PullDetector: Pull');
                                    ce.classList.add('pulled');
                                  });

}

//Remove the pull event listeners
function removePull(){
    console.log("remove pull");
    pullDetector.removeEventListener('pull');
}

//Init push/pull event listeners
zig.singleUserSession.addListener(pushDetector);
zig.singleUserSession.addListener(pullDetector);

//Init the hand
zig.addListener(hand);
