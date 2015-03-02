what = {
	mode: 1,
	modes: ['', 'solo', 'total'],

	start: function(watch) {
		console.log('hello WHAT');
		watch.mode = 2;
		what[what.modes[what.mode]].start(watch);
	},

	end: function(watch, callback) {
		console.log('bye WHAT');
		what[what.modes[what.mode]].end(watch, callback);
	},

	solo: {
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

	total: {
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
				what.start(watch);
				break;
			case 1:
				when.end(watch, what.start);
				break;
			case 2:
				if (what.mode+1 < what.modes.length) {
					what[what.modes[what.mode]].end(watch,
					what[what.modes[what.mode+1]].start);
					what.mode++;
				} else {
					what[what.modes[what.mode]].end(watch,
					what[what.modes[1]].start);
					what.mode = 1;
				}
				break;
			case 3:
				where.end(watch, what.start);
				break;
		}
	},

	tap: function(watch, event) {
		what[what.modes[what.mode]].tap(watch, event);
	},

	doubletap: function(watch, event) {
		what[what.modes[what.mode]].doubletap(watch, event);
	},

	rotate: function(watch, event) {
		what[what.modes[what.mode]].rotate(watch, event);
	}
}