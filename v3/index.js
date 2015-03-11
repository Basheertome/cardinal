$(document).ready(function(){

	watch = {
		canvas: Snap('.watch'),
		mode: 0,
		width: 212,
		bezel: 31,
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
		top: newButton(watch, 'top', -25.25, 4.5, 42, 1),
		middle: newButton(watch, 'middle', -.25, 4.5, 42, 1),
		bottom: newButton(watch, 'bottom', 24.85, 4.5, 42, 1),
		mask: watch.canvas.circle(watch.x, watch.y, (watch.width/2)+(2*watch.bezel*0.4375) + 3 + 25).attr({'class': 'buttonmask'})
	};
	watch.buttons.group = watch.canvas.group(
		watch.buttons.top,
		watch.buttons.middle,
		watch.buttons.bottom,
		watch.buttons.mask
	).attr({'class': 'buttons'});

	Snap($('.button#top .core')[0]).attr({
		'fill': watch.canvas.gradient("l(0.5, 0, 0.5, 1)#a49b97:0-#897f76:3-#6a615a:100")
	});
	Snap($('.button#middle .core')[0]).attr({
		'fill': watch.canvas.gradient("l(0.5, 0, 0.5, 1)#c4b8a9:0-#564e4b:3-#3e3935:100")
	});
	Snap($('.button#bottom .core')[0]).attr({
		'fill': watch.canvas.gradient("l(0.5, 0, 0.5, 1)#9b928c:0-#33302c:3-#2a2623:100")
	});
	watch.buttons.group.attr({'mask': watch.buttons.mask});

	watch.frame = newFrame(watch).
		attr({'class': 'frame'});

	watch.strap = newStrap(watch, 125, 600).attr({
		'fill': 'transparent',
		'class': 'strap'
	});

	watch.h1 = watch.canvas.text(watch.x, watch.y - (watch.width/2) - (watch.bezel*2.55), '')
		.attr({'class': 'h1'});
	watch.h2 = watch.canvas.text(watch.x, watch.y - (watch.width/2) - (watch.bezel*1.9), '')
		.attr({'class': 'h2'});

	watch.buttonlabel1 = [
		watch.canvas.text(watch.x + watch.width*.72, watch.y + 3, '●')
			.transform('r' + -25.25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 10, watch.y + 3, '●')
			.transform('r' + -25.25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 20, watch.y + 3, '●')
			.transform('r' + -25.25 + ',' + watch.x + ',' + watch.y)
			.attr({'class': 'buttonlabel'}),
		watch.canvas.text(watch.x + watch.width*.72 + 30, watch.y + 3, '●')
			.transform('r' + -25.25 + ',' + watch.x + ',' + watch.y)
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

	watch.reflection = watch.canvas.circle(watch.x, watch.y, (watch.width/2)+(watch.bezel*0.5)).attr({
		'fill': watch.canvas.gradient("l(0, 0, 1, 1)rgba(255,255,255,.1):50-rgba(255,255,255,.20):50-rgba(255,255,255,.1):70"),
		'stroke': watch.canvas.gradient("l(0, 0, 0, 1)rgba(255,255,255,.25)-rgba(255,255,255,.15)"),
		'class': 'reflection'
	});

	watch.pattern = watch.canvas.group(
		watch.canvas.path('M0,0l1.5,0l0,.75l-.75,0l0,.75l-.75,0z').attr({'class': 'pattern'}),
		watch.canvas.rect(.75, .75, .75, .75).attr({'class': 'patternfill'})
	).toPattern(0, 0, 1.5, 1.5);
	watch.patternmask = watch.canvas.rect(watch.x - watch.width/2, watch.y - watch.width/2, watch.width, watch.width).attr({fill: watch.pattern});

	watch.interface.attr({
		mask: watch.patternmask,
		filter: watch.canvas.filter(Snap.filter.shadow(0, 0, 5, '#fff', 1))
	});

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
	watch[hand].animate({transform: 'r' + (angle-90) + ',' + watch.x + ',' + watch.y}, speed, mina.easeinout, function() {
		if (hand == 'minuteHand' || hand == 'hourHand') {
			if (angle > 180) {
				Snap($(watch[hand].node).find('.innershadow')[0]).transform('t0,-7');
			} else {
				Snap($(watch[hand].node).find('.innershadow')[0]).transform('t0,0');
			}
		}
	});
}

function setShadow(watch, hand, angle, speed) {
	var shadowx = parseFloat(Math.sin(angle * (Math.PI / 180)) * -5).toFixed(3);
	var shadowy = parseFloat(Math.cos(angle * (Math.PI / 180)) * -5).toFixed(3);
	watch[hand][0].animate({transform: 't' + shadowy + ',' + -shadowx}, speed, mina.easeinout);
}