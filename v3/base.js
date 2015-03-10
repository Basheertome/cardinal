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
								   (watch.bezel+width)*2,
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

function newDial(watch) {
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
	).attr({
		'filter': watch.canvas.filter(Snap.filter.blur(1, 1)),
		'class': 'shadow'
	}));
	hand.add(watch.canvas.path(
								  'm' + watch.x + ',' + (watch.y-(width/2)) +
								  'l' + height + ',0' +
								  'l' + (width/2) + ',' + (width/2) +
								  'l' + (width/-2) + ',' + (width/2) + 
								  'l' + -height + ',0z'
	).attr({'class': 'core'}));
	hand.add(watch.canvas.path(
								  'm' + watch.x + ',' + (watch.y+(width/2)) +
								  'l' + height + ',0'
	).attr({'class': 'innershadow'}));
	hand.add(watch.canvas.rect(watch.x,
								  watch.y-(width/2),
								  black,
								  width).attr({'class': 'black'}));
	hand.add(watch.canvas.circle(watch.x, watch.y, width/1.2, height/1.2
	).attr({'class': 'cap'}));
	hand.transform('r' + (-90+angle) + ',' + watch.x + ',' + watch.y);
	return hand;
}