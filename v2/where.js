where = {
	mode: 1,
	modes: ['', 'map', 'train', 'compass', 'weather'],

	start: function(watch) {
		watch.mode = 3;
		$('.h1').fadeOut(250, function() {
			$(this).text('where');
			$(this).fadeIn(250);
		});
		$('.h2').fadeOut(250, function() {
			$(this).text(where.modes[where.mode]);
			$(this).fadeIn(250);
		});
		where[where.modes[where.mode]].start(watch);
	},

	end: function(watch, callback) {
		where[where.modes[where.mode]].end(watch, callback);
	},

	map: {
		start: function(watch) {

		},

		end: function(watch, callback) {
			callback(watch);
		},

		tap: function(watch, event) {
			console.log('tap!');
		},

		doubletap: function(watch, event) {
			console.log('doubletap!');
		},

		rotate: function(watch, event) {
			console.log('rotate!');
			if (event.type == 'rotatestart') {

			} else if (event.type == 'rotateend') {

			} else {

			}
		}
	},

	train: {
		start: function(watch) {

		},

		end: function(watch, callback) {
			callback(watch);
		},

		tap: function(watch, event) {
			console.log('tap!');
		},

		doubletap: function(watch, event) {
			console.log('doubletap!');
		},

		rotate: function(watch, event) {
			console.log('rotate!');
			if (event.type == 'rotatestart') {

			} else if (event.type == 'rotateend') {

			} else {

			}
		}
	},

	compass: {
		start: function(watch) {
			watch.heading = 220;

			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', function(e) {
					watch.heading = e.webkitCompassHeading;
				});
				compassUpdate = setInterval(function() {
					if (watch.heading > 0) {
						setTime(watch, 360-watch.heading, 360-watch.heading, 100);
					}
				}, 100);
			}

			watch.compass = newCompass(watch, 30)
				.attr({'class': 'compass'});

			watch.interface.add(watch.compass);

			setTime(watch, 220, 220, 500);
			$('.compass text').each(function(i) {
				$(this).delay(i*100).animate({'opacity': '1'}, 250);
			});
		},

		end: function(watch, callback) {
			if (window.DeviceOrientationEvent) {
				window.removeEventListener('deviceorientation');
				clearInterval(compassUpdate);
			}

			$('.compass text').animate({'opacity': '0'}, 250).promise().done(function() {
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			console.log('tap!');
		},

		doubletap: function(watch, event) {
			console.log('doubletap!');
		},

		rotate: function(watch, event) {
			console.log('rotate!');
			if (event.type == 'rotatestart') {

			} else if (event.type == 'rotateend') {

			} else {

			}
		}
	},

	weather: {
		start: function(watch) {

		},

		end: function(watch, callback) {
			callback(watch);
		},

		tap: function(watch, event) {
			console.log('tap!');
		},

		doubletap: function(watch, event) {
			console.log('doubletap!');
		},

		rotate: function(watch, event) {
			console.log('rotate!');
			if (event.type == 'rotatestart') {

			} else if (event.type == 'rotateend') {

			} else {

			}
		}
	},

	button: function(watch) {
		switch (watch.mode) {
			case 0:
				where.start(watch);
				break;
			case 1:
				when.end(watch, where.start);
				break;
			case 2:
				what.end(watch, where.start);
				break;
			case 3:
				if (where.mode+1 < where.modes.length) {
					where[where.modes[where.mode]].end(watch,
					where[where.modes[where.mode+1]].start);
					where.mode++;
				} else {
					where[where.modes[where.mode]].end(watch,
					where[where.modes[1]].start);
					where.mode = 1;
				}
				$('.h2').fadeOut(250, function() {
					$(this).text(where.modes[where.mode]);
					$(this).fadeIn(250);
				});
				break;
		}
	},

	tap: function(watch, event) {
		where[where.modes[where.mode]].tap(watch, event);
	},

	doubletap: function(watch, event) {
		where[where.modes[where.mode]].doubletap(watch, event);
	},

	rotate: function(watch, event) {
		where[where.modes[where.mode]].rotate(watch, event);
	}
}

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