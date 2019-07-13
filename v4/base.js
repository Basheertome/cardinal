function newStrap(watch, width, height) {
	var strap = watch.canvas.rect(watch.x - (width/2),
								  watch.y - (height/2),
								  width,
								  height);
	return strap;
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
							 .transform('t0,' + angle)
							 .attr({'class': 'button', 'id': id});
	return button;
}

function newDial(watch) {
	var dial = watch.canvas.group(watch.canvas.rect(watch.x-(watch.width/2)-watch.bezel*0.4375, watch.y-(watch.height/2)-watch.bezel*0.4375, watch.width+(watch.bezel*0.4375*2), watch.height+(watch.bezel*0.4375*2),watch.bezel*1.5,watch.bezel*1.5).attr({'class': 'screen'}));
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