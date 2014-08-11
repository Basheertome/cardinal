$(document).ready(function(){

	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	}

	$(window).bind('touchmove', function(e) {
		e.preventDefault();
	});

	$('body').delay(500).animate({"opacity": "1"}, 500);

	var s = Snap(".watch");

	var watch = {
		canvas: s,
		x: $(window).width() / 2,
		y: $(window).height() / 2,
		width: 200,
		bezel: 20
	};

	watch.strap = newStrap(watch, 150, 600).attr({
		stroke: "l(.5, 0, .5, 1)#000:5-#404040:40-#404040:60-#000:95",
		"class": "strap"
	});

	watch.tbutton = newButton(watch, -32, 7, 40, 3);
	watch.mbutton = newButton(watch, 0, 10, 45, 3);
	watch.bbutton = newButton(watch, 32, 7, 40, 3);

	watch.dial = newDial(watch, 20)
		.attr({"class": "dial"});

	watch.numbers = newNumbers(watch, 30)
		.attr({"class": "numbers"});

	watch.compass = newCompass(watch, 30)
		.attr({"class": "compass"});

	watch.smallTicks = newTicks(watch, 1, 10, 2, 96)
		.attr({"class": "smallTicks"});
	watch.largeTicks = newTicks(watch, 1.5, 15, 2, 12)
		.attr({"class": "largeTicks"});

	watch.minuteHand = newHand(watch, 3, (watch.width/2)*.9, (watch.width*.05), 0)
		.attr({"class": "minute"});
	watch.hourHand = newHand(watch, 3, (watch.width/2)*.5, (watch.width*.05), 0)
		.attr({"class": "hour"});

	watch.tbutton.click(function() {
		showTime(watch, 500);
		$('.compass text').animate({"opacity": "0"}, 250);
		$('.numbers text').each(function(i) {
			$(this).delay(i*25).animate({"opacity": "1"}, 250);
		});
	});
	watch.mbutton.click(function() {
		setHands(watch, 220, 220, 500);
		$('.numbers text').animate({"opacity": "0"}, 250);
		$('.compass text').each(function(i) {
			$(this).delay(i*100).animate({"opacity": "1"}, 250);
		});
	});
	watch.bbutton.click(function() {
		setHands(watch, 0, 0, 500);
		$('.numbers text, .compass text').animate({"opacity": "0"}, 250);
	});
});

function newStrap(watch, width, height) {
	var strap = watch.canvas.rect(watch.x - (width/2),
								  watch.y - (height/2),
								  150,
								  600);
	return strap;
}

function newButton(watch, angle, width, height, radius) {
	var button = watch.canvas.rect(watch.x+(watch.width/2),
							 	   watch.y-(height/2),
								   watch.bezel+width,
								   height,
								   radius)
							 .transform("r" + angle + "," + watch.x + "," + watch.y)
							 .attr({"class": "button"});
	return button;
}

function newDial(watch, ticks) {
	var dial = watch.canvas.group(watch.canvas.circle(watch.x, watch.y, (watch.width/2)+watch.bezel)
								  	.attr({"class": "ring"}),
								  watch.canvas.circle(watch.x, watch.y, (watch.width/2))
								    .attr({"class": "ring"}));
	for (var i=0; i<ticks; i++) {
		var ix = watch.x + ((watch.width/2) + (watch.bezel / 2)) * Math.cos(2 * Math.PI * i / ticks);
		var iy = watch.y + ((watch.width/2) + (watch.bezel / 2)) * Math.sin(2 * Math.PI * i / ticks);
		dial.add(watch.canvas.circle(ix, iy, watch.bezel / 10).attr({"class": "tick"}));
	}
	return dial;
}

function newNumbers(watch, offset) {
	var numbers = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, "12"));
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 6;
		numbers.add(watch.canvas.text(x, y, i));
	}
	return numbers;
}

function newCompass(watch, offset) {
	var compass = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, "N"));
	var text = "NESW"
	for (var i=1; i<4; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-1) / 4);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-1) / 4) + 6;
		compass.add(watch.canvas.text(x, y, text[i]));
	}
	return compass;
}

function newTicks(watch, width, height, padding, amount) {
	var ticks = watch.canvas.group();
	for (var i=0; i<amount; i++) {
		ticks.add(watch.canvas.rect(watch.x+(watch.width/2)-height-padding,
							 	   watch.y-(width/2),
								   height,
								   width)
							  .transform("r" + ((i / amount)*360) + "," + watch.x + "," + watch.y));
	}
	return ticks;
}

function newHand(watch, width, height, bleed, angle) {
	var hand = watch.canvas.group(watch.canvas.circle(watch.x-bleed, watch.y, width/2, height/2));
	hand.add(watch.canvas.rect(watch.x-bleed,
					  watch.y-(width/2),
					  height+bleed,
					  width));
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