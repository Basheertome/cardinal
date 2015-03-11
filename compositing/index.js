$(document).ready(function(){

	watch = {
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
		stroke: 'l(.5, 0, .5, 1)#000:10-#1a1a1a:30-#1a1a1a:70-#000:90',
		'class': 'strap'
	});

	watch.h1 = watch.canvas.text(watch.x, watch.y - (watch.width/2) - (watch.bezel*2.55), '')
		.attr({'class': 'h1'});
	watch.h2 = watch.canvas.text(watch.x, watch.y - (watch.width/2) - (watch.bezel*1.9), '')
		.attr({'class': 'h2'});
	watch.h3a = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*2.15), '')
		.attr({'class': 'h3'});
	watch.h3b = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*2.15) + 18, '')
		.attr({'class': 'h3'});
	watch.h3c = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*2.15) + 36, '')
		.attr({'class': 'h3'});
	watch.h3d = watch.canvas.text(watch.x, watch.y + (watch.width/2) + (watch.bezel*2.15) + 54, '')
		.attr({'class': 'h3'});

	watch.buttonlabel1 = [
		watch.canvas.text(watch.x + watch.width*.72, watch.y + 3, '●')
			.transform('r' + -25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 10, watch.y + 3, '●')
			.transform('r' + -25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 20, watch.y + 3, '●')
			.transform('r' + -25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 30, watch.y + 3, '●')
			.transform('r' + -25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'})
	];
	watch.buttonlabel2 = [
		watch.canvas.text(watch.x + watch.width*.72, watch.y + 3, '●')
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 10, watch.y + 3, '●')
			.attr({'class': 'buttonlabel'})
	];
	watch.buttonlabel3 = [
		watch.canvas.text(watch.x + watch.width*.72, watch.y + 3, '●')
			.transform('r' + 25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 10, watch.y + 3, '●')
			.transform('r' + 25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 20, watch.y + 3, '●')
			.transform('r' + 25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 30, watch.y + 3, '●')
			.transform('r' + 25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'})
	];

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
		watch.h3a,
		watch.h3b,
		watch.h3c,
		watch.h3d,
		watch.buttonlabel1[0],
		watch.buttonlabel1[1],
		watch.buttonlabel1[2],
		watch.buttonlabel1[3],
		watch.buttonlabel2[0],
		watch.buttonlabel2[1],
		watch.buttonlabel3[0],
		watch.buttonlabel3[1],
		watch.buttonlabel3[2],
		watch.buttonlabel3[3],
		watch.dial,
		watch.smallTicks,
		watch.largeTicks
	).attr({'class': 'base'});

	watch.interface = watch.canvas.group().attr({'class': 'interface'});

	watch.minuteHand = newHand(watch, 7, (watch.width/2)*.86, 7, 0)
		.attr({'class': 'minute'});
	watch.minutes = 0;
	watch.hourHand = newHand(watch, 7, (watch.width/2)*.55, 7, 0)
		.attr({'class': 'hour'});
	watch.hour = 0;

	watch.hands = watch.canvas.group(
		watch.minuteHand,
		watch.hourHand
	).attr({'class': 'hands'});

	touchListeners(watch);
	buttonListeners(watch);

	var date = new Date();
	watch.time = {
		minutes: 0,
		hour: 0,
		day: date.getDay(),
		date: date.getDate(),
		month: date.getMonth(),
		year: date.getFullYear(),
		fullMonth: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		shortMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		shortWeekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
	};
	var minutes = date.getMinutes();
	watch.time.minutes = (minutes/60.0)*360;
	var hour = date.getHours(); if (hour > 12) {hour -= 12;}
	watch.time.hour = (hour/12)*360;
}

function newDigitalHand(watch, width, height, angle) {
	var hand = watch.canvas.path(
			   'm' + watch.x + ',' + (watch.y-(width/2)) +
			   'l' + height + ',0' +
			   'l' + (width/2) + ',' + (width/2) +
			   'l' + (width/-2) + ',' + (width/2) + 
			   'l' + -height + ',0z'
	).transform('r' + (angle-90) + ',' + watch.x + ',' + watch.y);
	return hand;
}

function setTime(watch, hour, minutes, speed) {
	setHand(watch, 'minuteHand', minutes, speed);
	setShadow(watch, 'minuteHand', minutes, speed);
	watch.minutes = minutes;
	setHand(watch, 'hourHand', hour, speed);
	setShadow(watch, 'hourHand', hour, speed);
	watch.hour = hour;
}

function setHand(watch, hand, angle, speed) {
	watch[hand].animate({transform: 'r' + (angle-90) + ',' + watch.x + ',' + watch.y}, speed, mina.easeinout);
}

function setShadow(watch, hand, angle, speed) {
	var shadowx = parseFloat(Math.sin(angle * (Math.PI / 180)) * -5).toFixed(3);
	var shadowy = parseFloat(Math.cos(angle * (Math.PI / 180)) * -5).toFixed(3);
	watch[hand][0].animate({transform: 't' + shadowy + ',' + -shadowx}, speed, mina.easeinout);
}

function setInstructions(watch, line1, line2, line3, line4) {
	$('.h3').fadeOut(250, function() {
		$(watch.h3a.node).text(line1);
		$(watch.h3b.node).text(line2);
		$(watch.h3c.node).text(line3);
		$(watch.h3d.node).text(line4);
		$('.h3').fadeIn(250);
	});
}