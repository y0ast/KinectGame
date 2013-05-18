var gridSizex = 15;
var gridSizey = 9;

var animal = 0;

var timestart = 0;
var timeend = 0;

var level = [[6,10],[15,15],[20,20]];

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



