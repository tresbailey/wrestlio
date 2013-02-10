
/*
http://irae.pro.br/lab/canvas_pie_countdown/
 */
window.onload = function() {
	canvas = document.getElementById('pie-countdown');
	num = document.getElementById('left');
	ctx = canvas.getContext('2d');
	canvas_size = [ canvas.width, canvas.height ];
	radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
	center = [ (canvas_size[0] / 2) - 70, canvas_size[1] / 2 ];
	start = 1; // varia de 1 até 0
	fps = 40;
	seconds = 180;

	var total = fps * seconds;
	for ( var i = total; i >= 0; i--) {
		var delayed = (function() {
			var step = 1 - i / total;
			var left = Math.ceil(i / fps);
			left = Math.floor(left / 60) + ":" + left % 60
			return function() {
				num.innerHTML = left;
				draw_next(step);
			};
		})();
		setTimeout(delayed, -1000 / fps * (i - total));
	}
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

function start_stop_clock(event) {
    alert(event)
}
