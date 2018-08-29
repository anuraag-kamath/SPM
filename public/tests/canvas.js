// console.log(document.getElementById('t1').getClientRects());



// console.log(document.getElementById('t2').getClientRects());


// var y1 = document.getElementById('t3').getClientRects()[0].top + document.getElementById('t3').getClientRects()[0].height / 2;
// var y2 = document.getElementById('t2').getClientRects()[0].top + document.getElementById('t2').getClientRects()[0].height / 2;




dragStart = (ev) => {
    ev.dataTransfer.setData('alpha', ev.target.id);
}


dragEnd = (ev) => {
    var source=(ev.target.id);
    var target=(ev.dataTransfer.getData("alpha"));

    console.log(source);
    console.log(target);

    var y1 = document.getElementById(target).getClientRects()[0].top + document.getElementById(target).getClientRects()[0].height / 2;
    var y2 = document.getElementById(source).getClientRects()[0].top + document.getElementById(source).getClientRects()[0].height / 2;
    

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    ctx.moveTo(0, y1);
    ctx.lineTo(c.clientWidth, y2);
    ctx.stroke();

    


}

dragOver = (ev => {
    ev.preventDefault();
})






function handleMouseDown(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // draw our lineRect
    drawLineAsRect(lineRect, "transparent");

    // test if hit in the lineRect
    if (ctx.isPointInPath(mouseX, mouseY)) {
        alert('Yes');
    }
}



document.getElementById("test-load").innerHTML='<object type="text/html" data="/test-load.html" ></object>';
