
/*
http://irae.pro.br/lab/canvas_pie_countdown/
 */

pause_clock = function( clock_model ) {
    clearInterval( clock_model.get('timeout_keeper') );
    $("#pie-countdown").removeClass("runningClock").addClass("stoppedClock");
}

start_clock = function( round, clock_model ) {
	canvas = document.getElementById('pie-countdown');
	num = document.getElementById('secondsleft');
	stnum = document.getElementById('left');
	ctx = canvas.getContext('2d');
	canvas_size = [ canvas.width, canvas.height ];
	radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
	center = [ (canvas_size[0] / 2) - 70, canvas_size[1] / 2 ];
	start = 1; // varia de 1 até 0
	fps = 40;
	seconds = clock_model.get('total');

    fps = 100;
    $("#restartClock").hide();
    $("#pie-countdown").removeClass("stoppedClock").addClass("runningClock");
    
    delayed = function() {
        var left = clock_model.get('left');
        if ( left == 0 ) {
            round.advance_next_round();
            clearInterval( clock_model.get('timeout_keeper') );
        } else {
            var stleft = Math.floor(left/1000 / 60) +":"+ Math.floor((left/1000) % 60);
            stnum.innerHTML = stleft;
            num.innerHTML = left;
            var step = 1 - left/seconds;
            draw_next( step );
        }
        clock_model.set('left', left-fps);
    }

    clock_model.set('timeout_keeper', setInterval( delayed, fps ) );
}

function draw_next(step) { // step between 0 and 1
	ctx.clearRect(0, 0, canvas_size[0], canvas_size[1]);
	if (step < 1) {
		ctx.beginPath();
		ctx.moveTo(center[0], center[1]); // ponto central
		ctx.arc( // draw next arc
		center[0], center[1], radius, Math.PI * (-0.5 + 0), // -0.5 pra começar do topo
		Math.PI * (-0.5 + step * 2), true // anti horário
		);
		ctx.lineTo(center[0], center[1]); // line back to the center
		ctx.closePath();

		//alert(step)
		if (step>.1) {
		  ctx.fillStyle = '#d00a1'; // color
		} else {
		  ctx.fillStyle = 'rgb(40,40,40)'; // color
		}
		ctx.fill();
	}
}

