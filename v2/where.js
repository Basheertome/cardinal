where = {
	mode: 1,
	modes: ['', 'map', 'compass', 'weather'],

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
			if (where.weather.mode < 2) {
				watch.weatherdial = newCalendarDial(watch, 28, 4.5, where.weather.modesettings[where.weather.mode][6])
					.attr({'class': 'weatherdial'});
				watch.weatherHand = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
					.attr({'class': 'weatherhand'});
				watch.weatherlabel = watch.canvas.text(watch.x, watch.y + 55, where.weather.modesettings[where.weather.mode][0])
					.attr({'class': 'weatherlabel'});
				watch.icon = watch.canvas.path(where.weather.icons[where.weather.modesettings[where.weather.mode][7]])
					.transform('t' + (watch.x - 35) + ',' + (watch.y - 35) + 's.85')
					.attr({'class': 'weathericon'});
				watch.interface.add(
					watch.weatherdial,
					watch.weatherHand,
					watch.weatherlabel,
					watch.icon
				);

				var anglemapper = 360 / (where.weather.modesettings[where.weather.mode][5] - where.weather.modesettings[where.weather.mode][4]);

				setHand(watch, 'weatherHand', (where.weather.modesettings[where.weather.mode][2] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, 500);
				setTime(watch, (where.weather.modesettings[where.weather.mode][1] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, (where.weather.modesettings[where.weather.mode][3] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, 500);
				$('.weatherhand').animate({'opacity': '1'}, 500, function() {
					watch.highlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][3], where.weather.modesettings[where.weather.mode][4], 'High', ((watch.width/2)*.86), 'highlabel');
					watch.lowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4], 'Low', ((watch.width/2)*.55), 'lowlabel');
					watch.nowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][2], where.weather.modesettings[where.weather.mode][4], where.weather.modesettings[where.weather.mode][2] + 'º', ((watch.width/2)*.7), 'nowlabel');
					watch.interface.add(
						watch.highlabel,
						watch.lowlabel,
						watch.nowlabel
					);
					$('.highlabel, .lowlabel, .nowlabel').animate({'opacity': '1'}, 250);
				});
				$('.weathericon').animate({'opacity': '.25'}, 500);
				$('.weatherdial text, .weatherlabel').each(function(i) {
					$(this).delay(i*25).animate({'opacity': '1'}, 250);
				});
			} else {
				watch.weatherdial = newCalendarDial(watch, 28, 4.5, where.weather.modesettings[where.weather.mode][3])
					.attr({'class': 'weatherdial'});
				watch.weatherlabel = watch.canvas.text(watch.x, watch.y + 55, where.weather.modesettings[where.weather.mode][0])
					.attr({'class': 'weatherlabel'});
				watch.interface.add(
					watch.weatherdial,
					watch.weatherlabel
				);

				$('.weatherdial text, .weatherlabel').each(function(i) {
					$(this).delay(i*25).animate({'opacity': '1'}, 250);
				});

				watch.weatherHandOne = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
					.attr({'class': 'weatherhandone'});
				watch.weatherHandTwo = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
					.attr({'class': 'weatherhandtwo'});
				watch.interface.add(
					watch.weatherHandOne,
					watch.weatherHandTwo
				);

				var anglemapper = 360 / (where.weather.modesettings[where.weather.mode][2] - where.weather.modesettings[where.weather.mode][1]);

				setHand(watch, 'weatherHandOne', (where.weather.modesettings[where.weather.mode][4][1][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);
				setHand(watch, 'weatherHandTwo', (where.weather.modesettings[where.weather.mode][4][2][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);
				setTime(watch, (where.weather.modesettings[where.weather.mode][4][0][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, (where.weather.modesettings[where.weather.mode][4][0][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);

				$('.weatherhandone, .weatherhandtwo').animate({'opacity': '1'}, 500).promise().done(function() {
					var nextday = watch.time.shortWeekday[watch.time.day + 2];
					var nextdayone = watch.time.shortWeekday[watch.time.day + 3];
					var nextdaytwo = watch.time.shortWeekday[watch.time.day + 4];
					watch.nextLabelOne = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][1][0], where.weather.modesettings[where.weather.mode][1], nextdayone + ' ' + where.weather.modesettings[where.weather.mode][4][1][0] + 'º', ((watch.width/2)*.7) - 10.5, 'nextlabelone');
					watch.labelIconOne = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][1][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][1][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.nextLabelTwo = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][2][0], where.weather.modesettings[where.weather.mode][1], nextdaytwo + ' ' + where.weather.modesettings[where.weather.mode][4][2][0] + 'º', ((watch.width/2)*.7) - 10.5, 'nextlabeltwo');
					watch.labelIconTwo = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][2][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][2][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.nextLabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][0][0], where.weather.modesettings[where.weather.mode][1], nextday + ' ' + where.weather.modesettings[where.weather.mode][4][0][0] + 'º', ((watch.width/2)*.7) - 11, 'nextlabel');
					watch.labelIcon = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][0][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][0][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.interface.add(
						watch.nextLabelOne,
						watch.labelIconOne,
						watch.nextLabelTwo,
						watch.labelIconTwo,
						watch.nextLabel,
						watch.labelIcon
					);
					$('.nextlabelone, .nextlabeltwo, .nextlabel, .labelicon').animate({'opacity': '1'}, 250);
				});
			}
		},

		end: function(watch, callback) {
			$('.weatherdial text, .weatherlabel, .icon, .weatherhand, .weatherhandone, .weatherhandtwo, .nextlabelone, .nextlabeltwo, .nextlabel, .labelicon, .highlabel, .lowlabel, .nowlabel').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.weatherdial;
				delete watch.weatherHand;
				delete watch.weatherHandOne;
				delete watch.weatherHandTwo;
				delete watch.nextLabelOne;
				delete watch.labelIconOne;
				delete watch.nextLabelTwo;
				delete watch.labelIconTwo;
				delete watch.nextLabel;
				delete watch.labelIcon;
				delete watch.weatherlabel;
				delete watch.icon;
				delete watch.highlabel;
				delete watch.lowlabel;
				delete watch.nowlabel;
				watch.interface.clear();
				callback(watch);
			});
		},

		mode: 0,

		modesettings: [
			['Today', 36, 47, 53, 0, 60, ['0º', '15º', '30º', '45º'], 'rain'],
			['Tomorrow', -12, 7, 32, -15, 45, ['-15º', '0º', '15º', '30º'], 'snow'],
			['Soon', 0, 60, ['0º', '15º', '30º', '45º'], [
				[7, 'rain'],
				[41, 'sun'],
				[47, 'cloud'],
			]],
			['Hourly', 36, 53, 0, 60, ['0º', '15º', '30º', '45º'], [
				[42, 'rain'],
				[43, 'rain'],
				[43, 'sun'],
				[48, 'sun'],
				[50, 'sun'],
				[48, 'cloud'],
				[46, 'cloud'],
				[45, 'cloud'],
				[41, 'cloud'],
				[39, 'cloud'],
				[39, 'rain'],
				[38, 'rain'],
			]]
		],

		icons: {
			rain: 'M18.8,52.6c-1.6-0.9-2.2-2.9-1.4-4.5c0.8-1.5,2.8-2.5,4.2-3.7c2.1-1.9,3.3-3.3,3.3-3.3c0,0-0.5,1.8-0.9,4.6c-0.3,1.9,0,4.1-0.8,5.6C22.4,52.8,20.4,53.4,18.8,52.6z M5.9,51.2c0.8-1.5,0.5-3.7,0.8-5.6C7.1,42.8,7.5,41,7.5,41c0,0-1.2,1.4-3.3,3.3c-1.4,1.3-3.4,2.3-4.2,3.7c-0.9,1.6-0.2,3.6,1.4,4.5C3.1,53.4,5,52.8,5.9,51.2z M8.4,58.9c-1.9,1.7-4.5,3-5.6,5c-1.1,2.1-0.3,4.8,1.8,6c2.2,1.1,4.8,0.3,6-1.8c1-2,0.6-4.9,1-7.4c0.5-3.7,1.2-6.1,1.2-6.1C12.8,54.4,11.1,56.3,8.4,58.9z M25.6,58.9c-1.9,1.7-4.5,3-5.6,5c-1.1,2.1-0.3,4.8,1.8,6c2.2,1.1,4.8,0.3,6-1.8c1-2,0.6-4.9,1-7.4c0.5-3.7,1.2-6.1,1.2-6.1C30,54.4,28.4,56.3,25.6,58.9z M56.3,44.3c-1.4,1.3-3.4,2.3-4.2,3.7c-0.9,1.6-0.2,3.6,1.4,4.5c1.6,0.8,3.6,0.2,4.5-1.4c0.8-1.5,0.5-3.7,0.8-5.6c0.4-2.8,0.9-4.6,0.9-4.6C59.6,41,58.4,42.4,56.3,44.3z M42.8,58.9c-1.9,1.7-4.5,3-5.6,5c-1.1,2.1-0.3,4.8,1.8,6c2.2,1.1,4.8,0.3,6-1.8c1-2,0.6-4.9,1-7.4c0.5-3.7,1.2-6.1,1.2-6.1C47.2,54.4,45.6,56.3,42.8,58.9z M40.6,51.2c0.8-1.5,0.5-3.7,0.8-5.6c0.4-2.8,0.9-4.6,0.9-4.6c0,0-1.2,1.4-3.3,3.3c-1.4,1.3-3.4,2.3-4.2,3.7c-0.9,1.6-0.2,3.6,1.4,4.5C37.8,53.4,39.8,52.8,40.6,51.2z M22.5,8.9c-2.7-1.7-6-2.1-7.8-2.1c-8.3,0-15,6.7-15,15c0,7.9,6.1,14.4,13.8,15v0.1h44.6c6.7,0,12.2-5.4,12.2-12.2c0-6.7-5.5-12.2-12.2-12.2c-0.7,0-1.4,0.1-2,0.2c-2.2-7.2-8.7-12.5-16.5-13v0c-0.4,0-0.8-0.1-1.2-0.1c-0.6,0-1.1,0-1.7,0.1c-0.1,0-0.3,0-0.4,0c-0.5,0.1-1,0.1-1.5,0.2c0,0-0.1,0-0.1,0c-0.5,0.1-1,0.2-1.5,0.4c-0.2,0-0.3,0.1-0.5,0.2c-0.4,0.1-0.8,0.3-1.2,0.4c-0.2,0.1-0.3,0.1-0.5,0.2c-0.4,0.2-0.8,0.4-1.2,0.6c-0.2,0.1-0.4,0.2-0.6,0.3c-0.3,0.2-0.5,0.3-0.8,0.5c-0.3,0.2-0.6,0.4-0.9,0.6c-0.2,0.2-0.5,0.3-0.7,0.5c-0.2,0.2-0.4,0.3-0.6,0.5c-0.2,0.1-0.3,0.3-0.5,0.4C25.4,5,25,5.3,24.7,5.7c-0.1,0.1-0.2,0.3-0.4,0.4c-0.2,0.2-0.4,0.5-0.6,0.7c-0.1,0.1-0.2,0.3-0.3,0.4c0,0,0,0,0,0c-0.3,0.4-0.5,0.8-0.7,1.3L22.5,8.9z',
			snow: 'M22.9,14.5c0.2-0.4,0.4-0.9,0.7-1.2c0,0,0,0,0,0c0.1-0.1,0.2-0.3,0.3-0.4c0.2-0.2,0.4-0.5,0.6-0.7c0.1-0.1,0.2-0.2,0.3-0.4c0.3-0.4,0.7-0.7,1.1-1.1c0.2-0.1,0.3-0.3,0.5-0.4c0.2-0.2,0.4-0.4,0.6-0.5c0.2-0.2,0.4-0.3,0.7-0.5c0.3-0.2,0.6-0.4,0.9-0.6c0.3-0.2,0.5-0.3,0.8-0.5c0.2-0.1,0.4-0.2,0.6-0.3c0.4-0.2,0.7-0.4,1.1-0.5c0.2-0.1,0.3-0.1,0.5-0.2c0.4-0.2,0.8-0.3,1.2-0.4c0.2-0.1,0.3-0.1,0.5-0.1c0.5-0.1,1-0.3,1.5-0.4c0,0,0.1,0,0.1,0c0.5-0.1,1-0.2,1.5-0.2c0.1,0,0.3,0,0.4,0c0.5,0,1.1-0.1,1.7-0.1c0.4,0,0.8,0,1.2,0.1v0c7.7,0.5,14.1,5.7,16.3,12.8c0.7-0.1,1.3-0.2,2-0.2c6.6,0,12,5.4,12,12c0,6.6-5.4,12-12,12h-44v-0.1c-7.6-0.6-13.7-7-13.7-14.8c0-8.2,6.6-14.8,14.8-14.8c1.8,0,5.1,0.4,7.7,2.1L22.9,14.5z M45.8,59h0.7l0.3,0.6l-0.3,0.5h-0.7l-0.4-0.5L45.8,59z M46.1,64.2l0.4-0.3v-1.2l0.7,0.4l0.3-0.2v-0.5l-1-0.6v-0.8l0.7,0.4v-0.8l0.7,0.4v1.2l0.4,0.2l0.4-0.2v-0.8l1,0.6l0.4-0.2v-0.5l-1-0.6l0.6-0.4V60l-0.3-0.2l-1,0.6L47.7,60l0.7-0.4l-0.7-0.4l0.7-0.5l1,0.6l0.3-0.2v-0.4l-0.7-0.4l1.1-0.6v-0.5L49.8,57l-1.1,0.6v-0.8l-0.4-0.2L48,56.8v1.3l-0.7,0.4v-0.9L46.5,58v-0.8l1-0.6v-0.4L47.2,56l-0.7,0.4v-1.2l-0.4-0.3l-0.4,0.3v1.2L45,56l-0.3,0.2v0.4l1,0.6V58L45,57.6l0,0.8L44.2,58l0-1.2l-0.4-0.2l-0.3,0.2v0.8L42.5,57l-0.4,0.2v0.5l1.1,0.6l-0.7,0.4v0.4l0.4,0.2l1-0.6l0.7,0.4l-0.7,0.4l0.7,0.4l0,0l-0.7,0.4l-1-0.6L42.5,60v0.4l0.7,0.4l-1.1,0.6v0.5l0.5,0.2l1.1-0.6v0.8l0.3,0.2l0.4-0.2v-1.2l0.7-0.4v0.8l0.7-0.5v0.8l-1,0.6v0.4l0.3,0.2l0.7-0.4v1.2L46.1,64.2z M54.5,49.3H55l0.3,0.4L55,50.2h-0.5l-0.3-0.4L54.5,49.3z M54.7,53.2l0.3-0.2v-0.9l0.5,0.3l0.3-0.1v-0.3L55,51.5v-0.6l0.5,0.3v-0.6l0.6,0.3v0.9l0.3,0.2l0.3-0.2v-0.6l0.8,0.4l0.3-0.2v-0.4L57,50.7l0.5-0.3v-0.3l-0.3-0.2l-0.8,0.4l-0.6-0.3l0.5-0.3l-0.5-0.3l0.5-0.3l0.8,0.5l0.3-0.1v-0.3L57,48.8l0.8-0.5V48l-0.3-0.2l-0.8,0.4v-0.6l-0.3-0.1l-0.3,0.1v1l-0.6,0.3v-0.7L55,48.6V48l0.8-0.4v-0.3l-0.3-0.2L55,47.4v-0.9l-0.3-0.2l-0.3,0.2v0.9l-0.5-0.3l-0.3,0.2v0.3l0.8,0.4v0.6l-0.6-0.3l0,0.6l-0.5-0.3l0-0.9L53,47.5l-0.2,0.2v0.6L52,47.8L51.6,48v0.4l0.8,0.4L52,49.1v0.3l0.3,0.1l0.8-0.4l0.5,0.3L53,49.8l0.5,0.3l0,0L53,50.4l-0.8-0.4L52,50.1v0.3l0.5,0.3l-0.8,0.5v0.4l0.3,0.1l0.8-0.5v0.6L53,52l0.3-0.2v-0.9l0.5-0.3v0.6l0.6-0.4v0.6l-0.8,0.4v0.3l0.3,0.2l0.5-0.3v0.9L54.7,53.2z M37.6,49.3h0.5l0.3,0.4l-0.2,0.4h-0.5l-0.3-0.4L37.6,49.3z M37.9,53.2l0.3-0.2v-0.9l0.5,0.3l0.3-0.1v-0.3l-0.8-0.4v-0.6l0.5,0.3v-0.6l0.6,0.3v0.9l0.3,0.2l0.3-0.2v-0.6l0.8,0.4l0.3-0.2v-0.4l-0.8-0.5l0.5-0.3v-0.3l-0.3-0.2l-0.8,0.4L39,50.1l0.5-0.3l-0.5-0.3l0.5-0.3l0.8,0.5l0.3-0.1v-0.3l-0.5-0.3l0.8-0.5V48l-0.3-0.2l-0.8,0.4v-0.6l-0.3-0.1l-0.3,0.1v1l-0.6,0.3v-0.7l-0.5,0.3V48l0.8-0.4v-0.3l-0.3-0.2l-0.5,0.3v-0.9l-0.3-0.2l-0.3,0.2v0.9l-0.5-0.3l-0.3,0.2v0.3l0.8,0.4v0.6L37,48.3l0,0.6l-0.5-0.3l0-0.9l-0.3-0.2l-0.2,0.2v0.6l-0.8-0.5L34.8,48v0.4l0.8,0.4l-0.5,0.3v0.3l0.3,0.1l0.8-0.4l0.5,0.3l-0.5,0.3l0.5,0.3l0,0l-0.5,0.3l-0.8-0.4l-0.3,0.2v0.3l0.5,0.3l-0.8,0.5v0.4l0.3,0.1l0.8-0.5v0.6l0.2,0.2l0.3-0.2v-0.9l0.5-0.3v0.6l0.6-0.4v0.6l-0.8,0.4v0.3l0.3,0.2l0.5-0.3v0.9L37.9,53.2z M20.6,49.3h0.5l0.3,0.4l-0.2,0.4h-0.5l-0.3-0.4L20.6,49.3z M20.8,53.2l0.3-0.2v-0.9l0.5,0.3l0.3-0.1v-0.3l-0.8-0.4v-0.6l0.5,0.3v-0.6l0.6,0.3v0.9l0.3,0.2l0.3-0.2v-0.6l0.8,0.4l0.3-0.2v-0.4l-0.8-0.5l0.5-0.3v-0.3l-0.3-0.2l-0.8,0.4L22,50.1l0.5-0.3L22,49.5l0.5-0.3l0.8,0.5l0.3-0.1v-0.3l-0.5-0.3l0.8-0.5V48l-0.3-0.2l-0.8,0.4v-0.6l-0.3-0.1l-0.3,0.1v1l-0.6,0.3v-0.7l-0.5,0.3V48l0.8-0.4v-0.3l-0.3-0.2l-0.5,0.3v-0.9l-0.3-0.2l-0.3,0.2v0.9L20,47.1l-0.3,0.2v0.3l0.8,0.4v0.6l-0.6-0.3l0,0.6l-0.5-0.3l0-0.9l-0.3-0.2l-0.2,0.2v0.6l-0.8-0.5L17.7,48v0.4l0.8,0.4L18,49.1v0.3l0.3,0.1l0.8-0.4l0.5,0.3l-0.5,0.3l0.5,0.3l0,0l-0.5,0.3l-0.8-0.4l-0.3,0.2v0.3l0.5,0.3l-0.8,0.5v0.4l0.3,0.1l0.8-0.5v0.6l0.2,0.2l0.3-0.2v-0.9l0.5-0.3v0.6l0.6-0.4v0.6l-0.8,0.4v0.3l0.3,0.2l0.5-0.3v0.9L20.8,53.2z M3.4,49.3H4l0.3,0.4L4,50.2H3.5l-0.3-0.4L3.4,49.3z M3.7,53.2L4,53.1v-0.9l0.5,0.3l0.3-0.1v-0.3L4,51.5v-0.6l0.5,0.3v-0.6l0.6,0.3v0.9L5.4,52l0.3-0.2v-0.6l0.8,0.4l0.3-0.2v-0.4L6,50.7l0.5-0.3v-0.3l-0.3-0.2l-0.8,0.4l-0.6-0.3l0.5-0.3l-0.5-0.3l0.5-0.3l0.8,0.5l0.3-0.1v-0.3L6,48.8l0.8-0.5V48l-0.3-0.2l-0.8,0.4v-0.6l-0.3-0.1l-0.3,0.1v1l-0.6,0.3v-0.7L4,48.6V48l0.8-0.4v-0.3l-0.3-0.2L4,47.4v-0.9l-0.3-0.2l-0.3,0.2v0.9l-0.5-0.3l-0.3,0.2v0.3L3.4,48v0.6l-0.6-0.3l0,0.6l-0.5-0.3l0-0.9L2,47.5l-0.2,0.2v0.6l-0.8-0.5L0.6,48v0.4l0.8,0.4l-0.5,0.3v0.3l0.3,0.1L2,49.1l0.5,0.3L2,49.8l0.5,0.3l0,0L2,50.4l-0.8-0.4l-0.3,0.2v0.3l0.5,0.3l-0.8,0.5v0.4L1,51.7l0.8-0.5v0.6L2,52l0.3-0.2v-0.9l0.5-0.3v0.6l0.6-0.4v0.6l-0.8,0.4v0.3l0.3,0.2l0.5-0.3v0.9L3.7,53.2z M28.7,59h0.7l0.3,0.6l-0.3,0.5h-0.7l-0.4-0.5L28.7,59z M29,64.2l0.4-0.3v-1.2l0.7,0.4l0.3-0.2v-0.5l-1-0.6v-0.8l0.7,0.4v-0.8l0.7,0.4v1.2l0.4,0.2l0.4-0.2v-0.8l1,0.6l0.4-0.2v-0.5l-1-0.6l0.6-0.4V60l-0.3-0.2l-1,0.6L30.6,60l0.7-0.4l-0.7-0.4l0.7-0.5l1,0.6l0.3-0.2v-0.4L32,58.3l1.1-0.6v-0.5L32.7,57l-1.1,0.6v-0.8l-0.4-0.2l-0.4,0.2v1.3l-0.7,0.4v-0.9L29.4,58v-0.8l1-0.6v-0.4L30.1,56l-0.7,0.4v-1.2L29,54.9l-0.4,0.3v1.2L28,56l-0.3,0.2v0.4l1,0.6V58l-0.8-0.4l0,0.8L27.2,58l0-1.2l-0.4-0.2l-0.3,0.2v0.8L25.4,57L25,57.2v0.5l1.1,0.6l-0.7,0.4v0.4l0.4,0.2l1-0.6l0.7,0.4l-0.7,0.4l0.7,0.4l0,0l-0.7,0.4l-1-0.6L25.4,60v0.4l0.7,0.4L25,61.4v0.5l0.5,0.2l1.1-0.6v0.8l0.3,0.2l0.4-0.2v-1.2l0.7-0.4v0.8l0.7-0.5v0.8l-1,0.6v0.4l0.3,0.2l0.7-0.4v1.2L29,64.2z M11.7,59h0.7l0.3,0.6l-0.3,0.5h-0.7l-0.4-0.5L11.7,59z M12.1,64.2l0.4-0.3v-1.2l0.7,0.4l0.3-0.2v-0.5l-1-0.6v-0.8l0.7,0.4v-0.8l0.7,0.4v1.2l0.4,0.2l0.4-0.2v-0.8l1,0.6l0.4-0.2v-0.5l-1-0.6l0.6-0.4V60l-0.3-0.2l-1,0.6L13.6,60l0.7-0.4l-0.7-0.4l0.7-0.5l1,0.6l0.3-0.2v-0.4L15,58.3l1.1-0.6v-0.5L15.7,57l-1.1,0.6v-0.8l-0.4-0.2l-0.4,0.2v1.3l-0.7,0.4v-0.9L12.5,58v-0.8l1-0.6v-0.4L13.2,56l-0.7,0.4v-1.2l-0.4-0.3l-0.4,0.3v1.2L11,56l-0.3,0.2v0.4l1,0.6V58l-0.8-0.4l0,0.8L10.2,58l0-1.2l-0.4-0.2l-0.3,0.2v0.8L8.4,57L8,57.2v0.5l1.1,0.6l-0.7,0.4v0.4l0.4,0.2l1-0.6l0.7,0.4l-0.7,0.4l0.7,0.4l0,0l-0.7,0.4l-1-0.6L8.4,60v0.4l0.7,0.4L8,61.4v0.5l0.5,0.2l1.1-0.6v0.8l0.3,0.2l0.4-0.2v-1.2l0.7-0.4v0.8l0.7-0.5v0.8l-1,0.6v0.4l0.3,0.2l0.7-0.4v1.2L12.1,64.2z',
			sun: 'M63.3,42.9c0.9-3.4,5.5-6.5,5.5-6.5c0.9-0.6,0.9-1.6,0-2.2c0,0-4.9-3.2-5.9-6.5c-1-3.3,1.1-7.9,1.1-7.9c0.4-1-0.1-1.9-1.1-2c0,0-5.1-0.6-7.3-3.1c-2.3-2.5-2.5-8.4-2.5-8.4c0-1.1-0.9-1.6-1.8-1.1c0,0-5,2.3-8.4,1.4c-3.4-0.9-6.5-5.5-6.5-5.5c-0.6-0.9-1.6-0.9-2.2,0c0,0-3.2,4.9-6.5,5.9c-3.3,1-7.9-1.1-7.9-1.1c-1-0.4-1.9,0.1-2,1.1c0,0-0.6,5.1-3.1,7.4c-2.5,2.3-8.4,2.5-8.4,2.5c-1.1,0-1.6,0.9-1.1,1.8c0,0,2.3,5,1.4,8.4c-0.9,3.4-5.5,6.5-5.5,6.5c-0.9,0.6-0.9,1.6,0,2.2c0,0,4.9,3.2,5.9,6.5c1,3.3-1.1,7.9-1.1,7.9c-0.4,1,0.1,1.9,1.1,2c0,0,5.1,0.6,7.3,3.1c2.3,2.5,2.5,8.4,2.5,8.4c0,1.1,0.9,1.6,1.8,1.1c0,0,5-2.3,8.4-1.4c3.4,0.9,6.5,5.5,6.5,5.5c0.6,0.9,1.6,0.9,2.2,0c0,0,3.2-4.9,6.5-5.9c3.3-1,7.9,1.1,7.9,1.1c1,0.4,1.9-0.1,2-1.1c0,0,0.6-5.1,3.1-7.3c2.5-2.3,8.4-2.5,8.4-2.5c1.1,0,1.6-0.9,1.1-1.8C64.7,51.2,62.4,46.2,63.3,42.9z M28.3,59.2C14.9,55.5,7,41.7,10.8,28.3c3.7-13.4,17.6-21.2,31-17.5s21.2,17.6,17.5,31C55.5,55.1,41.7,63,28.3,59.2z M55.9,40.8c-3.2,11.5-15.2,18.3-26.7,15.1S10.9,40.7,14.1,29.2c3.2-11.5,15.2-18.3,26.7-15.1S59.1,29.3,55.9,40.8z',
			cloud: 'M22.8,25.8c-2.6-1.7-5.9-2.1-7.7-2.1C7,23.8,0.4,30.4,0.4,38.5c0,7.7,6,14.1,13.6,14.7v0.1h43.8c6.6,0,11.9-5.3,11.9-11.9c0-6.6-5.3-11.9-11.9-11.9c-0.7,0-1.3,0.1-2,0.2c-2.2-7.1-8.6-12.3-16.2-12.8v0c-0.4,0-0.8-0.1-1.2-0.1c-0.6,0-1.1,0-1.6,0.1c-0.1,0-0.3,0-0.4,0c-0.5,0.1-1,0.1-1.5,0.2c0,0-0.1,0-0.1,0c-0.5,0.1-1,0.2-1.5,0.4c-0.2,0-0.3,0.1-0.5,0.1c-0.4,0.1-0.8,0.3-1.2,0.4c-0.2,0.1-0.3,0.1-0.5,0.2c-0.4,0.2-0.8,0.3-1.1,0.5c-0.2,0.1-0.4,0.2-0.6,0.3c-0.3,0.1-0.5,0.3-0.8,0.5c-0.3,0.2-0.6,0.4-0.9,0.6c-0.2,0.2-0.5,0.3-0.7,0.5c-0.2,0.2-0.4,0.3-0.6,0.5c-0.2,0.1-0.3,0.3-0.5,0.4c-0.4,0.3-0.7,0.7-1.1,1.1c-0.1,0.1-0.2,0.2-0.3,0.4c-0.2,0.2-0.4,0.5-0.6,0.7c-0.1,0.1-0.2,0.3-0.3,0.4c0,0,0,0,0,0c-0.3,0.4-0.5,0.8-0.7,1.2L22.8,25.8z'
		},

		tap: function(watch, event) {
			var oldmode = where.weather.mode;

			if (oldmode < 2) {
				where.weather.mode++;
			} else {
				where.weather.mode = 0;
			}

			if (where.weather.mode < 2) {

				if (where.weather.modesettings[oldmode][6] != where.weather.modesettings[where.weather.mode][6]) {
					$('.weatherdial text').animate({'opacity': '0'}, 250).promise().done(function() {
						$('.weatherdial').remove();
						delete watch.weatherdial;
						watch.weatherdial = newCalendarDial(watch, 28, 4.5, where.weather.modesettings[where.weather.mode][6])
							.attr({'class': 'weatherdial'});
						watch.interface.add(watch.weatherdial);
						$('.weatherdial text').each(function(i) {
							$(this).delay(i*25).animate({'opacity': '1'}, 250);
						});
					});
				}

				$('.weatherhandone, .weatherhandtwo, .nextlabelone, .nextlabeltwo, .nextlabel, .labelicon').animate({'opacity': '0'}, 250).promise().done(function() {
					$('.weatherhandone, .weatherhandtwo, .nextlabelone, .nextlabeltwo, .nextlabel, .labelicon').remove();
					delete watch.weatherHandOne;
					delete watch.weatherHandTwo;
					delete watch.nextLabelOne;
					delete watch.labelIconOne;
					delete watch.nextLabelTwo;
					delete watch.labelIconTwo;
					delete watch.nextLabel;
					delete watch.labelIcon;
				});
				
				$('.weatherlabel, .weathericon, .highlabel, .lowlabel, .nowlabel').animate({'opacity': '0'}, 250, function() {
					watch.weatherlabel.attr('text', where.weather.modesettings[where.weather.mode][0]);
					$('.weathericon').remove();
					delete watch.icon;
					watch.icon = watch.canvas.path(where.weather.icons[where.weather.modesettings[where.weather.mode][7]])
					.transform('t' + (watch.x - 35) + ',' + (watch.y - 35) + 's.85')
					.attr({'class': 'weathericon'});
					watch.interface.add(watch.icon);
					$('.weatherlabel').animate({'opacity': '1'}, 250);
					$('.weathericon').animate({'opacity': '.25'}, 250);
					$('.highlabel, .lowlabel, .nowlabel').remove();
					delete watch.highlabel;
					delete watch.lowlabel;
					delete watch.nowlabel;
					watch.highlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][3], where.weather.modesettings[where.weather.mode][4], 'High', ((watch.width/2)*.86), 'highlabel');
					watch.lowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4], 'Low', ((watch.width/2)*.55), 'lowlabel');
					watch.nowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][2], where.weather.modesettings[where.weather.mode][4], where.weather.modesettings[where.weather.mode][2] + 'º', ((watch.width/2)*.7), 'nowlabel');
					watch.interface.add(
						watch.highlabel,
						watch.lowlabel,
						watch.nowlabel
					);
					$('.highlabel, .lowlabel, .nowlabel').animate({'opacity': '1'}, 250);
				});

				var anglemapper = 360 / (where.weather.modesettings[where.weather.mode][5] - where.weather.modesettings[where.weather.mode][4]);

				if (typeof watch.weatherHand == 'undefined') {
					watch.weatherHand = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
						.attr({'class': 'weatherhand'});
					watch.interface.add(watch.weatherHand);
					$('.weatherhand').animate({'opacity': '1'}, 500);
				}

				setHand(watch, 'weatherHand', (where.weather.modesettings[where.weather.mode][2] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, 500);
				setTime(watch, (where.weather.modesettings[where.weather.mode][1] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, (where.weather.modesettings[where.weather.mode][3] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, 500);
			} else {
				if (where.weather.modesettings[oldmode][6] != where.weather.modesettings[where.weather.mode][3]) {
					$('.weatherdial text').animate({'opacity': '0'}, 250).promise().done(function() {
						$('.weatherdial').remove();
						delete watch.weatherdial;
						watch.weatherdial = newCalendarDial(watch, 28, 4.5, where.weather.modesettings[where.weather.mode][3])
							.attr({'class': 'weatherdial'});
						watch.interface.add(watch.weatherdial);
						$('.weatherdial text').each(function(i) {
							$(this).delay(i*25).animate({'opacity': '1'}, 250);
						});
					});
				}

				$('.weatherlabel').animate({'opacity': '0'}, 250, function() {
					watch.weatherlabel.attr('text', where.weather.modesettings[where.weather.mode][0]);
					$('.weatherlabel').animate({'opacity': '1'}, 250);
				});

				$('.weatherhand, .weathericon, .highlabel, .lowlabel, .nowlabel').animate({'opacity': '0'}, 250).promise().done(function() {
					$('.weatherhand, .weathericon, .highlabel, .lowlabel, .nowlabel').remove();
					delete watch.weatherHand;
					delete watch.icon;
					delete watch.highlabel;
					delete watch.lowlabel;
					delete watch.nowlabel;
				});

				watch.weatherHandOne = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
					.attr({'class': 'weatherhandone'});
				watch.weatherHandTwo = newDigitalHand(watch, 7, (watch.width/2)*.7, 0)
					.attr({'class': 'weatherhandtwo'});
				watch.interface.add(
					watch.weatherHandOne,
					watch.weatherHandTwo
				);

				var anglemapper = 360 / (where.weather.modesettings[where.weather.mode][2] - where.weather.modesettings[where.weather.mode][1]);

				setHand(watch, 'weatherHandOne', (where.weather.modesettings[where.weather.mode][4][1][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);
				setHand(watch, 'weatherHandTwo', (where.weather.modesettings[where.weather.mode][4][2][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);
				setTime(watch, (where.weather.modesettings[where.weather.mode][4][0][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, (where.weather.modesettings[where.weather.mode][4][0][0] - where.weather.modesettings[where.weather.mode][1]) * anglemapper, 500);

				$('.weatherhandone, .weatherhandtwo').animate({'opacity': '1'}, 500).promise().done(function() {
					var nextday = watch.time.shortWeekday[watch.time.day + 2];
					var nextdayone = watch.time.shortWeekday[watch.time.day + 3];
					var nextdaytwo = watch.time.shortWeekday[watch.time.day + 4];
					watch.nextLabelOne = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][1][0], where.weather.modesettings[where.weather.mode][1], nextdayone + ' ' + where.weather.modesettings[where.weather.mode][4][1][0] + 'º', ((watch.width/2)*.7) - 10.5, 'nextlabelone');
					watch.labelIconOne = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][1][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][1][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.nextLabelTwo = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][2][0], where.weather.modesettings[where.weather.mode][1], nextdaytwo + ' ' + where.weather.modesettings[where.weather.mode][4][2][0] + 'º', ((watch.width/2)*.7) - 10.5, 'nextlabeltwo');
					watch.labelIconTwo = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][2][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][2][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.nextLabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][0][0], where.weather.modesettings[where.weather.mode][1], nextday + ' ' + where.weather.modesettings[where.weather.mode][4][0][0] + 'º', ((watch.width/2)*.7) - 11, 'nextlabel');
					watch.labelIcon = newiconlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][4][0][0], where.weather.modesettings[where.weather.mode][1], where.weather.modesettings[where.weather.mode][4][0][1], ((watch.width/2)*.7) - 4, 'labelicon');
					watch.interface.add(
						watch.nextLabelOne,
						watch.labelIconOne,
						watch.nextLabelTwo,
						watch.labelIconTwo,
						watch.nextLabel,
						watch.labelIcon
					);
					$('.nextlabelone, .nextlabeltwo, .nextlabel, .labelicon').animate({'opacity': '1'}, 250);
				});
			}
		},

		doubletap: function(watch, event) {
			// console.log('doubletap!');
		},

		rotate: function(watch, event) {
			if (where.weather.mode == 0) {
				if (event.type == 'rotatestart') {
					watch.weatherHighShadow = newDigitalHand(watch, 7, (watch.width/2)*.86, watch.minutes)
						.attr({'class': 'weathershadows'});
					watch.weatherLowShadow = newDigitalHand(watch, 7, (watch.width/2)*.55, watch.hour)
						.attr({'class': 'weathershadows'});
					watch.interface.add(
						watch.weatherHighShadow,
						watch.weatherLowShadow
					);
					var anglemapper = 360 / (where.weather.modesettings[3][4] - where.weather.modesettings[3][3]);
					$('.nowlabel, .weatherlabel').animate({'opacity': '0'}, 125, function() {
						if ((watch.time.hour/360)*12 < 23) {
							watch.weatherlabel.attr('text', ((watch.time.hour/360)*12 + 1) + ':00');
						} else {
							watch.weatherlabel.attr('text', '0:00');
						}
						$('.nowlabel').remove();
						delete watch.nowlabel;
						watch.nowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[3][6][0][0], where.weather.modesettings[3][3], where.weather.modesettings[3][6][0][0] + 'º', ((watch.width/2)*.7), 'nowlabel');
						watch.interface.add(watch.nowlabel);
						$('.nowlabel, .weatherlabel').animate({'opacity': '1'}, 125);
					});
					if (where.weather.modesettings[3][6][0][1] != where.weather.modesettings[where.weather.mode][7]) {
						$('.weathericon').animate({'opacity': '0'}, 125, function() {
							$('.weathericon').remove();
							delete watch.icon;
							watch.icon = watch.canvas.path(where.weather.icons[where.weather.modesettings[3][6][0][1]])
								.transform('t' + (watch.x - 35) + ',' + (watch.y - 35) + 's.85')
								.attr({'class': 'weathericon'});
							watch.interface.add(watch.icon);
							$('.weathericon').animate({'opacity': '.25'}, 250);
						});
					}
					setTime(watch, (where.weather.modesettings[3][6][0][0] - where.weather.modesettings[3][3]) * anglemapper, (where.weather.modesettings[3][6][0][0] - where.weather.modesettings[3][3]) * anglemapper, 250);
					$('.weatherhand').animate({'opacity': '0'}, 250, function() {
						where.weather.rotatemodecounter = 0;
						rotateUpdate = setInterval(function() {
							if ((Math.abs(Math.floor(where.weather.rotatecounter/15)) != where.weather.rotatemodecounter) && (Math.abs(Math.floor(where.weather.rotatecounter/15)) < where.weather.modesettings[3][6].length)) {
								if (where.weather.modesettings[3][6][Math.abs(Math.floor(where.weather.rotatecounter/15))][1] != where.weather.modesettings[3][6][where.weather.rotatemodecounter][1]) {
									$('.weathericon').animate({'opacity': '0'}, 125, function() {
										$('.weathericon').remove();
										delete watch.icon;
										watch.icon = watch.canvas.path(where.weather.icons[where.weather.modesettings[3][6][Math.abs(Math.floor(where.weather.rotatecounter/15))][1]])
											.transform('t' + (watch.x - 35) + ',' + (watch.y - 35) + 's.85')
											.attr({'class': 'weathericon'});
										watch.interface.add(watch.icon);
										$('.weathericon').animate({'opacity': '.25'}, 250);
									});
								}
								where.weather.rotatemodecounter = Math.abs(Math.floor(where.weather.rotatecounter/15));
								var anglemapper = 360 / (where.weather.modesettings[3][4] - where.weather.modesettings[3][3]);
								$('.nowlabel, .weatherlabel').animate({'opacity': '0'}, 50, function() {
									if ((watch.time.hour/360)*12 < 23) {
										watch.weatherlabel.attr('text', ((watch.time.hour/360)*12 + where.weather.rotatemodecounter + 1) + ':00');
									} else {
										watch.weatherlabel.attr('text', '0:00');
									}
									$('.nowlabel').remove();
									delete watch.nowlabel;
									watch.nowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[3][6][where.weather.rotatemodecounter][0], where.weather.modesettings[3][3], where.weather.modesettings[3][6][where.weather.rotatemodecounter][0] + 'º', ((watch.width/2)*.7), 'nowlabel');
									watch.interface.add(watch.nowlabel);
									$('.nowlabel, .weatherlabel').animate({'opacity': '1'}, 50);
								});
								setTime(watch, (where.weather.modesettings[3][6][where.weather.rotatemodecounter][0] - where.weather.modesettings[3][3]) * anglemapper, (where.weather.modesettings[3][6][where.weather.rotatemodecounter][0] - where.weather.modesettings[3][3]) * anglemapper, 250);
							}
						}, 100);
					});
				} else if (event.type == 'rotateend') {
					$('.weatherhand').animate({'opacity': '1'}, 250, function() {
						$('.weathershadows').remove();
						delete watch.weatherHighShadow;
						delete watch.weatherLowShadow;
					});
					var anglemapper = 360 / (where.weather.modesettings[where.weather.mode][5] - where.weather.modesettings[where.weather.mode][4]);
					$('.nowlabel, .weatherlabel').animate({'opacity': '0'}, 125, function() {
						watch.weatherlabel.attr('text', where.weather.modesettings[where.weather.mode][0]);
						$('.nowlabel').remove();
						delete watch.nowlabel;
						watch.nowlabel = newhandlabel(watch, anglemapper, where.weather.modesettings[where.weather.mode][2], where.weather.modesettings[where.weather.mode][4], where.weather.modesettings[where.weather.mode][2] + 'º', ((watch.width/2)*.7), 'nowlabel');
						watch.interface.add(watch.nowlabel);
						$('.nowlabel, .weatherlabel').animate({'opacity': '1'}, 125);
					});
					if (where.weather.modesettings[3][6][where.weather.rotatemodecounter][1] != where.weather.modesettings[where.weather.mode][7]) {
						$('.weathericon').animate({'opacity': '0'}, 125, function() {
							$('.weathericon').remove();
							delete watch.icon;
							watch.icon = watch.canvas.path(where.weather.icons[where.weather.modesettings[where.weather.mode][7]])
								.transform('t' + (watch.x - 35) + ',' + (watch.y - 35) + 's.85')
								.attr({'class': 'weathericon'});
							watch.interface.add(watch.icon);
							$('.weathericon').animate({'opacity': '.25'}, 250);
						});
					}
					setTime(watch, (where.weather.modesettings[where.weather.mode][1] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, (where.weather.modesettings[where.weather.mode][3] - where.weather.modesettings[where.weather.mode][4]) * anglemapper, 250);
					clearInterval(rotateUpdate);
				} else {
					where.weather.rotatecounter = event.rotation;
				}
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

function newhandlabel(watch, anglemapper, anglevalue, angleoffset, text, handlength, name) {
	var angle = (anglevalue - angleoffset) * anglemapper + 90;
	if (angle < 270) {
		label = watch.canvas.text(watch.x, watch.y, text)
			.transform('r180,' + watch.x + ',' + watch.y + 'r' + angle + ',' + watch.x + ',' + watch.y + 't' + handlength + ',-8')
			.attr({'class': name + ' flipped'});
	} else {
		label = watch.canvas.text(watch.x, watch.y, text)
			.transform('r' + angle + ',' + watch.x + ',' + watch.y + 't' + -handlength + ',-8')
			.attr({'class': name});
	}
	return label;
}

function newiconlabel(watch, anglemapper, anglevalue, angleoffset, icontype, handlength, name) {
	var angle = (anglevalue - angleoffset) * anglemapper + 90;
	if (angle < 270) {
		icon = watch.canvas.path(where.weather.icons[icontype])
			.transform(
				't' + (watch.x - 35) + ',' + (watch.y - 35) +
				'r180,' + 35 + ',' + 35 + 'r' + angle + ',' + 35 + ',' + 35 + 't' + handlength + ',-11' + 's.12'
			)
			.attr({'class': name});
	} else {
		icon = watch.canvas.path(where.weather.icons[icontype])
			.transform(
				't' + (watch.x - 35) + ',' + (watch.y - 35) +
				'r' + angle + ',' + 35 + ',' + 35 + 't' + -handlength + ',-11' + 's.12'
			)
			.attr({'class': name});
	}
	return icon;
}