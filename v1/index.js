$(document).ready(function(){

	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	}

	var s = Snap("#svg");

	var watch = {
		canvas: s,
		x: $(window).width() / 2,
		y: $(window).height() / 2,
		width: 200,
		bezel: 20
	};

	watch.strap = newStrap(watch, 150, 600).attr({
		fill: "#fff",
		stroke: "l(.5, 0, .5, 1)#fff:5-#bfbfbf:40-#bfbfbf:60-#fff:95",
		strokeWidth: 2
	});

	var defaultButton = {
		defaultFill: "#efefef",
		defaultStroke: "#bfbfbf",
		downFill: "#9f9f9f",
		downStroke: "#7f7f7f",
		strokeWidth: 2,
		cursor: "pointer"
	}
	watch.tbutton = newButton(watch, defaultButton, -32, 7, 40, 3);
	watch.mbutton = newButton(watch, defaultButton, 0, 10, 45, 3);
	watch.bbutton = newButton(watch, defaultButton, 32, 7, 40, 3);

	watch.dial = newDial(watch, 20).attr({
	    fill: "#fff",
	    stroke: "#bfbfbf",
	    strokeWidth: 2
	});

	watch.smallTicks = newTicks(watch, 1, 10, 2, 96).attr({
		fill: "#e5e5e5"
	});
	watch.largeTicks = newTicks(watch, 1.5, 15, 2, 12).attr({
		fill: "#d9d9d9"
	});

	watch.minuteHand = newHand(watch, 5, (watch.width/2)*.9, (watch.width*.05), 0).attr({
		fill: "#888"
	});
	watch.hourHand = newHand(watch, 5, (watch.width/2)*.5, (watch.width*.05), 0).attr({
		fill: "#888"
	});

	watch.tbutton.click(function() {
		showTime(watch, 500);
	});
	watch.mbutton.click(function() {
		setHands(watch, 270, 90, 250);
	});
	watch.bbutton.click(function() {
		setHands(watch, 0, 0, 100);
	});
});

function newStrap(watch, width, height) {
	var strap = watch.canvas.rect(watch.x - (width/2),
								  watch.y - (height/2),
								  150,
								  600);
	return strap;
}

function newButton(watch, buttonStyle, angle, width, height, radius) {
	var button = watch.canvas.rect(watch.x+(watch.width/2),
							 	   watch.y-(height/2),
								   watch.bezel+width,
								   height,
								   radius)
	button.transform("r" + angle + "," + watch.x + "," + watch.y);
	button.attr({
		fill: buttonStyle.defaultFill,
		stroke: buttonStyle.defaultStroke,
		strokeWidth: buttonStyle.strokeWidth,
		"cursor": buttonStyle.cursor
	}).mousedown(function() {
		this.attr({
			fill: buttonStyle.downFill,
			stroke: buttonStyle.downStroke
		});
	}).mouseup(function() {
		this.attr({
			fill: buttonStyle.defaultFill,
			stroke: buttonStyle.defaultStroke
		});
	});
	return button;
}

function newDial(watch, ticks) {
	var dial = watch.canvas.group(watch.canvas.circle(watch.x, watch.y, (watch.width/2)+watch.bezel),
								  watch.canvas.circle(watch.x, watch.y, (watch.width/2)));
	for (var i=0; i<ticks; i++) {
		var ix = watch.x + ((watch.width/2) + (watch.bezel / 2)) * Math.cos(2 * Math.PI * i / ticks);
		var iy = watch.y + ((watch.width/2) + (watch.bezel / 2)) * Math.sin(2 * Math.PI * i / ticks);
		watch.canvas.circle(ix, iy, watch.bezel / 10).appendTo(dial);
	}
	return dial;
}

function newTicks(watch, width, height, padding, amount) {
	var ticks = watch.canvas.group();
	for (var i=0; i<amount; i++) {
		watch.canvas.rect(watch.x+(watch.width/2)-height-padding,
							 	   watch.y-(width/2),
								   height,
								   width).transform("r" + ((i / amount)*360) + "," + watch.x + "," + watch.y).appendTo(ticks);
	}
	return ticks;
}

function newHand(watch, width, height, bleed, angle) {
	var hand = watch.canvas.group(watch.canvas.circle(watch.x-bleed, watch.y, width/2, height/2));
	watch.canvas.rect(watch.x-bleed,
					  watch.y-(width/2),
					  height+bleed,
					  width).appendTo(hand);
	hand.transform("r" + (-90+angle) + "," + watch.x + "," + watch.y);
	return hand;
}

function setHands(watch, hour, minutes, speed) {
	watch.minuteHand.animate({transform: "r" + (minutes-90) + "," + watch.x + "," + watch.y}, speed);
	watch.hourHand.animate({transform: "r" + (hour-90) + "," + watch.x + "," + watch.y}, speed);
}

function showTime(watch, speed) {
	var date = new Date();
	var minutes = date.getMinutes();
	minutes = (minutes/60.0)*360;
	var hour = date.getHours(); if (hour > 12) {hour -= 12;}
	hour = (hour/12)*360;
	setHands(watch, hour, minutes, speed);
}