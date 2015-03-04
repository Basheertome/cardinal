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
			watch.heading = 150;

			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', function(e) {
					if (typeof e.webkitCompassHeading != 'undefined') {
						watch.heading = e.webkitCompassHeading;
						if (watch.rotation > 0) {
							watch.compassLabel.attr('text', Math.round(360 - watch.heading - watch.rotation) + 'º');
						} else {
							watch.compassLabel.attr('text', Math.round(360 - watch.heading) + 'º');
						}
					}
				});
				compassUpdate = setInterval(function() {
					if (watch.heading > 0) {
						setTime(watch, 360-watch.heading, 360-watch.heading, 100);
						if (typeof watch.pie != 'undefined') {
							if (360 - watch.heading > watch.savedCompass) {
								setPie(watch, watch.pie, 27, watch.savedCompass, 360-watch.heading, 100);
							} else {
								setPie(watch, watch.pie, 27, 360-watch.heading, watch.savedCompass, 100);
							}
						}
					}
				}, 100);
			}

			watch.compassDial = newCompassDial(watch, 30)
				.attr({'class': 'compassDial'});
			watch.compassSubdial = newCompassSubdial(watch, 30)
				.attr({'class': 'compassSubdial'});

			watch.rose = watch.canvas.path(
				'm' + (watch.x - 1.5) + ',' + (watch.y + 1.5) +
				'l1.5,' + (-watch.width/7) +
				'l1.5,' + (watch.width/7) +
				'l' + (watch.width/7) + ',-1.5' +
				'l' + (-watch.width/7) + ',-1.5' +
				'l-1.5,' + (watch.width/7) +
				'l-1.5,' + (-watch.width/7) +
				'l' + (-watch.width/7) + ',1.5z'
			).attr({'class': 'rose'});

			watch.compassLabel = watch.canvas.text(watch.x, watch.y - 40, Math.round(360 - watch.heading) + 'º')
				.attr({'class': 'compasslabel'});

			watch.rotationgroup = watch.canvas.group();
			watch.rotationgroup.add(
				watch.compassDial,
				watch.compassSubdial,
				watch.compassLabel,
				watch.rose
			);
			watch.interface.add(watch.rotationgroup);

			setTime(watch, 220, 220, 500);
			$('.compasslabel, .rose').animate({'opacity': '1'}, 500);
			$('.compassDial text, .compassSubdial text').each(function(i) {
				$(this).delay(i*35).animate({'opacity': '1'}, 250);
			});

			if (typeof watch.rotation != 'undefined') {
				watch.rotationgroup.animate({transform: 'r' + watch.rotation + ',' + watch.x + ',' + watch.y}, 500);
			}
		},

		end: function(watch, callback) {
			if (window.DeviceOrientationEvent) {
				window.removeEventListener('deviceorientation');
				clearInterval(compassUpdate);
			}
			if (typeof watch.rotation != 'undefined') {
				watch.rotationgroup.animate({transform: 'r' + 0 + ',' + watch.x + ',' + watch.y}, 500);
			}
			$('.compasslabel, .rose, .compassHand, .savedcompasslabel').animate({'opacity': '0'}, 250);
			$('.compassDial text, .compassSubdial text').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.compassDial;
				delete watch.compassSubdial;
				delete watch.compassLabel;
				delete watch.savedCompass;
				delete watch.savedCompassLabel;
				delete watch.compassHand;
				delete watch.pie;
				delete watch.rose;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			if (typeof watch.savedCompass != 'undefined') {
				watch.savedCompass = 360-watch.heading;
				setHand(watch, 'compassHand', watch.savedCompass, 100);
				watch.savedCompassLabel.attr('text', Math.round(360 - watch.heading) + 'º');
			} else {
				watch.compassHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 360-watch.heading)
					.attr({'class': 'compassHand'});
				watch.savedCompass = 360-watch.heading;
				watch.savedCompassLabel = watch.canvas.text(watch.x, watch.y + 52, Math.round(360 - watch.heading) + 'º')
					.attr({'class': 'savedcompasslabel'});
				watch.pie = newPie(watch, 27, watch.savedCompass, 360-watch.heading);
				watch.pie.circle.attr({'class': 'pie'});
				watch.rotationgroup.add(
					watch.savedCompassLabel
				);
				watch.interface.add(
					watch.compassHand,
					watch.pie.circle
				);
				$('.compassHand, .savedcompasslabel').animate({'opacity': '1'}, 500);
			}
		},

		doubletap: function(watch, event) {
			if (typeof watch.rotation != 'undefined') {
				watch.rotationgroup.animate({transform: 'r' + 0 + ',' + watch.x + ',' + watch.y}, 500);
				watch.rotation = 0;
			}
			if (typeof watch.savedCompass != 'undefined') {
				$('.compassHand, .savedcompasslabel, .pie').animate({'opacity': '0'}, 250, function() {
					$(this).remove();
					delete watch.savedCompass;
					delete watch.savedCompassLabel;
					delete watch.compassHand;
					delete watch.pie;
				});
			}
		},

		rotate: function(watch, event) {
			if (event.type == 'rotatestart') {
				if (typeof watch.rotation == 'undefined') {
					watch.rotation = 0;
					where.compass.rotatecounter = 0;
				}
				rotateUpdate = setInterval(function() {
					watch.rotationgroup.animate({transform: 'r' + (watch.rotation + where.compass.rotatecounter) + ',' + watch.x + ',' + watch.y}, 100);
				}, 100);
			} else if (event.type == 'rotateend') {
				watch.rotation += where.compass.rotatecounter;
				clearInterval(rotateUpdate);
			} else {
				where.compass.rotatecounter = event.rotation;
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

function newCompassDial(watch, offset) {
	var compass = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, 'N'));
	var text = 'NESW'
	for (var i=1; i<4; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-1) / 4);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-1) / 4) + 6;
		compass.add(watch.canvas.text(x, y, text[i]));
	}
	return compass;
}

function newCompassSubdial(watch, offset) {
	var compassSubdial = watch.canvas.group();
	var text = ['N', '30º', '60º', 'E', '120º', '150º', 'S', '210º', '240º', 'W', '270º', '300º'];
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 6;
		compassSubdial.add(watch.canvas.text(x, y, text[i]));
		if (i == 2 || i == 5 || i == 8) {i+=1};
	}
	return compassSubdial;
}