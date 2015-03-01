$(document).ready(function(){

	touchListeners();

	var watch = {
		canvas: Snap('.watch'),
		mode: 0,
		x: $(window).width() / 2,
		y: $(window).height() / 2,
		width: 209,
		bezel: 30
	};

	setup(watch);

	$('body').delay(500).animate({'opacity': '1'}, 500, function() {
		when.start(watch);
	});

});

function setup(watch) {
	watch.buttons = {
		top: newButton(watch, 'top', -25, 8, 45, 1),
		middle: newButton(watch, 'middle', 0, 8, 45, 1),
		bottom: newButton(watch, 'bottom', 25, 8, 45, 1)
	};
	watch.buttons.group = watch.canvas.group(watch.buttons.top, watch.buttons.middle, watch.buttons.bottom).attr({'class': 'buttons'});

	watch.frame = newFrame(watch).
		attr({'class': 'frame'});

	watch.strap = newStrap(watch, 125, 600).attr({
		stroke: 'l(.5, 0, .5, 1)#fff:10-#e6e7e8:30-#e6e7e8:70-#fff:90',
		'class': 'strap'
	});

	watch.dial = newDial(watch, 20)
		.attr({'class': 'dial'});

	watch.smallTicks = newTicks(watch, 1.25, 8, 1, 60)
		.attr({'class': 'smallTicks'});
	watch.largeTicks = newTicks(watch, 1.25, 16, 1, 12)
		.attr({'class': 'largeTicks'});

	watch.base = watch.canvas.group(watch.buttons.group, watch.frame, watch.strap, watch.dial, watch.smallTicks, watch.largeTicks).attr({'class': 'base'});

	watch.interface = watch.canvas.group();

	watch.minuteHand = newHand(watch, 7, (watch.width/2)*.86, 7, 0)
		.attr({'class': 'minute'});
	watch.hourHand = newHand(watch, 7, (watch.width/2)*.55, 7, 0)
		.attr({'class': 'hour'});

	watch.hands = watch.canvas.group(watch.minuteHand, watch.hourHand);

	buttonListeners(watch);
}

when = {
	start: function(watch) {
		console.log('hello WHEN');
		watch.mode = 1;

		watch.numbers = newNumbers(watch, 27)
			.attr({'class': 'numbers'});
		watch.alarmHand = newDigitalHand(watch, 7, (watch.width/2)*.55, 7, 0)
			.attr({'class': 'alarm'});
		watch.interface.add(watch.numbers, watch.alarmHand);

		showTime(watch, 500);
		$('.numbers text').each(function(i) {
			$(this).delay(i*25).animate({'opacity': '1'}, 250);
		});
		$('.alarm').animate({'opacity': '1'}, 500);
		setHand(watch, 'alarmHand', 254, 500);
	},

	end: function(watch) {
		console.log('bye WHEN');
		$('.numbers text').animate({'opacity': '0'}, 250);
	},

	button: function(watch) {
		switch(watch.mode) {
			case 0:
				when.start(watch);
				break;
			case 1:

				break;
			case 2:
				what.end(watch);
				when.start(watch);
				break;
			case 3:
				where.end(watch);
				when.start(watch);
				break;
		}
	}
}

what = {
	start: function(watch) {
		console.log('hello WHAT');
		watch.mode = 2;
	},

	end: function(watch) {
		console.log('bye WHAT');
	},

	button: function(watch) {
		switch(watch.mode) {
			case 0:
				what.start(watch);
				break;
			case 1:
				when.end(watch);
				what.start(watch);
				break;
			case 2:
				
				break;
			case 3:
				where.end(watch);
				what.start(watch);
				break;
		}
	}
}

where = {
	start: function(watch) {
		console.log('hello WHERE');
		watch.mode = 3;

		watch.compass = newCompass(watch, 30)
			.attr({'class': 'compass'});

		watch.interface.add(watch.compass);

		compass = 1;

		setTime(watch, 220, 220, 500);
		$('.compass text').each(function(i) {
			$(this).delay(i*100).animate({'opacity': '1'}, 250);
		});
	},

	end: function(watch) {
		console.log('bye WHERE');
		compass = 0;
		$('.compass text').animate({'opacity': '0'}, 250);
	},

	button: function(watch) {
		switch(watch.mode) {
			case 0:
				where.start(watch);
				break;
			case 1:
				when.end(watch);
				where.start(watch);
				break;
			case 2:
				what.end(watch);
				where.start(watch);
				break;
			case 3:

				break;
		}
	}
}

// Listener Functions

function buttonListeners(watch) {
	// UI & Hover animations for buttons

	$('.button').on('mouseenter', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't3'}, 50);
	});
	$('.button').on('mouseleave', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't0'}, 50);
	});
	$('.button').on('mousedown', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't-4'}, 50);
	});
	$('.button').on('mouseup', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't3'}, 50);
	});

	$('#top').on('click', function() {
		when.button(watch);
	});
	$('#middle').on('click', function() {
		what.button(watch);
	});
	$('#bottom').on('click', function() {
		where.button(watch);
	});
}

function touchListeners() {
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	}

	$(window).bind('touchmove', function(e) {
		e.preventDefault();
	});

	window.addEventListener('deviceorientation', function(e) {
		try{
			if (compass > 0) {
		    	setTime(watch, -e.webkitCompassHeading, -e.webkitCompassHeading, 100);
		    }
		} catch(err) {
			compass = 0;
		}
	}, false);
}

// Watch Frame Builder Functions

function newStrap(watch, width, height) {
	var strap = watch.canvas.rect(watch.x - (width/2),
								  watch.y - (height/2),
								  width,
								  height);
	return strap;
}

function newFrame(watch) {
	var frame = watch.canvas.group(watch.canvas.path('m-62.41765,-118.7l0.01785,-0.0196v-37.5305l-1.9789,-3.7457l-1.06015,-0.63595l-8.55155,5.7953l-39.537,83.243l0.00945,-0.00455c12.575,-19.837,30.214,-36.14,51.1,-47.102z'));
	frame.add(watch.canvas.path('m113.1056,-71.59805l0.00945,0.00455l-39.537,-83.243l-8.55155,-5.7953l-2.028355,0.63595l-1.9789,3.7457v37.5305l0.01785,0.0196c21.854,10.962,39.494,27.265,52.069,47.102z'));
	frame.add(watch.canvas.path('m-113,71.52792l39.0096,82.93345l8.55155,5.7953l1.06015,-0.63595l1.9789,-3.7457v-37.253c-20.607,-10.811,-38.058,-26.82,-50.6,-46.294z'));
	frame.add(watch.canvas.path('m61.98775,118.8737v37.25225l1.9789,3.7457l1.06015,0.63595l8.55155,-5.7953l39.0096,-82.13345c-12.543,19.474,-29.993,35.484,-50.6,46.294z'));
	frame.add(watch.canvas.path('m129.39985,-34.3227l2.8861,-1.34575c0.31745,-0.14805,0.45605,-0.5285,0.308,-0.84595l-19.41415,-41.63355c-0.14805,-0.31745,-0.5285,-0.45605,-0.84595,-0.308l-2.9078,1.3559c9.021,12.79,15.857,27.23,19.974,42.777z'));
	frame.add(watch.canvas.path('m134.99425,-23.5231h-3.2032c1.36115,7.66325,2.07305,15.5512,2.07305,23.6054c0,8.0542,-0.7119,15.94215,-2.07305,23.6054h3.2032c0.35,0,0.63665,-0.2863,0.63665,-0.63665v-45.9375c0,-0.35,-0.287,-0.637,-0.637,-0.637z'));
	frame.add(watch.canvas.path('m132.28595,35.83305l-2.8861,-1.34575c-4.11635,15.54735,-10.95255,29.98695,-19.9738,42.77735l2.9078,1.3559c0.31745,0.14805,0.6979,0.00945,0.84595,-0.308l19.41415,-41.63355c0.148,-0.317,0.009,-0.698,-0.308,-0.846z'));
	frame.transform('t' + watch.x + ',' + watch.y);
	return frame;
}

function newButton(watch, id, angle, width, height, radius) {
	var button = watch.canvas.group(watch.canvas.rect(watch.x+(watch.width/2),
							 	   watch.y-(height/2),
								   (watch.bezel+width)*1.5,
								   height,
								   radius).attr({'class': 'padding'}));
	button.add(watch.canvas.rect(watch.x+(watch.width/2),
							 	   watch.y-(height/2),
								   watch.bezel+width,
								   height,
								   radius)
							 .attr({'class': 'core'}))
							 .transform('r' + angle + ',' + watch.x + ',' + watch.y)
							 .attr({'class': 'button', 'id': id});
	return button;
}

function newDial(watch, ticks) {
	var dial = watch.canvas.group(watch.canvas.circle(watch.x, watch.y, (watch.width/2)+watch.bezel)
								  	.attr({'class': 'ring'}),
								  watch.canvas.circle(watch.x, watch.y, (watch.width/2)+(watch.bezel*0.4375))
								    .attr({'class': 'ring'}),
								  watch.canvas.circle(watch.x, watch.y, (watch.width/2))
								    .attr({'class': 'screen'}));
	return dial;
}

function newTicks(watch, width, height, padding, amount) {
	var ticks = watch.canvas.group();
	for (var i=0; i<amount; i++) {
		ticks.add(watch.canvas.rect(watch.x+(watch.width/2)-height-padding,
							 	   watch.y-(width/2),
								   height,
								   width)
							  .transform('r' + ((i / amount)*360) + ',' + watch.x + ',' + watch.y));
	}
	return ticks;
}

function newHand(watch, width, height, black, angle) {
	var hand = watch.canvas.group(watch.canvas.path(
								  'm' + watch.x + ',' + (watch.y-(width/2)) +
								  'l' + height + ',0' +
								  'l' + (width/2) + ',' + (width/2) +
								  'l' + (width/-2) + ',' + (width/2) + 
								  'l' + -height + ',0z'
	).attr({'class': 'shadow'}));
	hand.add(watch.canvas.path(
								  'm' + watch.x + ',' + (watch.y-(width/2)) +
								  'l' + height + ',0' +
								  'l' + (width/2) + ',' + (width/2) +
								  'l' + (width/-2) + ',' + (width/2) + 
								  'l' + -height + ',0z'
	).attr({'class': 'core'}));
	hand.add(watch.canvas.rect(watch.x,
								  watch.y-(width/2),
								  black,
								  width).attr({'class': 'black'}));
	hand.add(watch.canvas.circle(watch.x, watch.y, width/1.2, height/1.2));
	hand.transform('r' + (-90+angle) + ',' + watch.x + ',' + watch.y);
	return hand;
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

// When Builder Functions

function newNumbers(watch, offset) {
	var numbers = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, '12'));
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 6;
		numbers.add(watch.canvas.text(x, y, i));
	}
	return numbers;
}

// Where Builder Functions

function newCompass(watch, offset) {
	var compass = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, 'N'));
	var text = 'NESW'
	for (var i=1; i<4; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-1) / 4);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-1) / 4) + 6;
		compass.add(watch.canvas.text(x, y, text[i]));
	}
	return compass;
}