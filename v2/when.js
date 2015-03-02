when = {
	mode: 1,
	modes: ['', 'time', 'date', 'alarm', 'timer'],

	start: function(watch) {
		console.log('hello WHEN');
		watch.mode = 1;
		when[when.modes[when.mode]].start(watch);
	},

	end: function(watch, callback) {
		console.log('bye WHEN');
		when[when.modes[when.mode]].end(watch, callback);
	},

	time: {
		start: function(watch) {
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

		end: function(watch, callback) {
			setHand(watch, 'alarmHand', 0, 500);
			$('.numbers text, .alarm').animate({'opacity': '0'}, 250).promise().done(function() {
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
		}
	},

	date: {
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
		}
	},

	alarm: {
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
		}
	},

	timer: {
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
		}
	},

	button: function(watch) {
		switch(watch.mode) {
			case 0:
				when.start(watch);
				break;
			case 1:
				if (when.mode+1 < when.modes.length) {
					when[when.modes[when.mode]].end(watch,
					when[when.modes[when.mode+1]].start);
					when.mode++;
				} else {
					when[when.modes[when.mode]].end(watch,
					when[when.modes[1]].start);
					when.mode = 1;
				}
				break;
			case 2:
				what.end(watch, when.start);
				break;
			case 3:
				where.end(watch, when.start);
				break;
		}
	},

	tap: function(watch, event) {
		when[when.modes[when.mode]].tap(watch, event);
	},

	doubletap: function(watch, event) {
		when[when.modes[when.mode]].doubletap(watch, event);
	},

	rotate: function(watch, event) {
		when[when.modes[when.mode]].rotate(watch, event);
	}
}

function newNumbers(watch, offset) {
	var numbers = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, '12'));
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 6;
		numbers.add(watch.canvas.text(x, y, i));
	}
	return numbers;
}