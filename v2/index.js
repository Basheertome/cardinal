$(document).ready(function(){

	var watch = {
		canvas: Snap('.watch'),
		mode: 0,
		width: 209,
		bezel: 30,
		x: 360 / 2,
		y: 600 / 2,
	};

	setup(watch);

	$('body').delay(500).animate({'opacity': '1'}, 500, function() {
		when.start(watch);
	});

});

function setup(watch) {
	$('.watch')[0].setAttribute('viewBox', '0 0 ' + (watch.x*2) + ' ' + (watch.y*2));

	watch.buttons = {
		top: newButton(watch, 'top', -25, 8, 45, 1),
		middle: newButton(watch, 'middle', 0, 8, 45, 1),
		bottom: newButton(watch, 'bottom', 25, 8, 45, 1)
	};
	watch.buttons.group = watch.canvas.group(
		watch.buttons.top,
		watch.buttons.middle,
		watch.buttons.bottom
	).attr({'class': 'buttons'});

	watch.frame = newFrame(watch).
		attr({'class': 'frame'});

	watch.strap = newStrap(watch, 125, 600).attr({
		stroke: 'l(.5, 0, .5, 1)#fff:10-#e6e7e8:30-#e6e7e8:70-#fff:90',
		'class': 'strap'
	});

	watch.h1 = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*1.9), 'mode').
		attr({'class': 'h1'});
	watch.h2 = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*2.55), 'submode').
		attr({'class': 'h2'});

	watch.dial = newDial(watch)
		.attr({'class': 'dial'});

	watch.smallTicks = newTicks(watch, 1.25, 8, 1, 60)
		.attr({'class': 'smallTicks'});
	watch.largeTicks = newTicks(watch, 1.25, 16, 1, 12)
		.attr({'class': 'largeTicks'});

	watch.base = watch.canvas.group(
		watch.buttons.group,
		watch.frame,
		watch.strap,
		watch.h1,
		watch.h2,
		watch.dial,
		watch.smallTicks,
		watch.largeTicks
	).attr({'class': 'base'});

	watch.interface = watch.canvas.group().attr({'class': 'interface'});

	watch.minuteHand = newHand(watch, 7, (watch.width/2)*.86, 7, 0)
		.attr({'class': 'minute'});
	watch.hourHand = newHand(watch, 7, (watch.width/2)*.55, 7, 0)
		.attr({'class': 'hour'});

	watch.hands = watch.canvas.group(
		watch.minuteHand,
		watch.hourHand
	).attr({'class': 'hands'});

	touchListeners(watch);
	buttonListeners(watch);
}

function newDigitalHand(watch, width, height, angle) {
	var hand = watch.canvas.path(
			   'm' + watch.x + ',' + (watch.y-(width/2)) +
			   'l' + height + ',0' +
			   'l' + (width/2) + ',' + (width/2) +
			   'l' + (width/-2) + ',' + (width/2) + 
			   'l' + -height + ',0z'
	);
	hand.transform('r' + (-90+angle) + ',' + watch.x + ',' + watch.y);
	return hand;
}

function setTime(watch, hour, minutes, speed) {
	setHand(watch, 'minuteHand', minutes, speed);
	setShadow(watch, 'minuteHand', minutes, speed);
	setHand(watch, 'hourHand', hour, speed);
	setShadow(watch, 'hourHand', hour, speed);
}

function setHand(watch, hand, angle, speed) {
	watch[hand].animate({transform: 'r' + (angle-90) + ',' + watch.x + ',' + watch.y}, speed);
}

function setShadow(watch, hand, angle, speed) {
	var shadowx = parseFloat(Math.sin(angle * (Math.PI / 180)) * -5).toFixed(3);
	var shadowy = parseFloat(Math.cos(angle * (Math.PI / 180)) * -5).toFixed(3);
	watch[hand][0].animate({transform: 't' + shadowy + ',' + -shadowx}, speed);
}

function showTime(watch, speed) {
	var date = new Date();
	var minutes = date.getMinutes();
	minutes = (minutes/60.0)*360;
	var hour = date.getHours(); if (hour > 12) {hour -= 12;}
	hour = (hour/12)*360;
	setTime(watch, hour, minutes, speed);
}