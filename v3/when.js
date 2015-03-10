when = {
	mode: 1,
	modes: ['', 'time', 'date', 'alarm', 'timer'],

	start: function(watch) {
		watch.mode = 1;
		$('.h1').fadeOut(250, function() {
			$(this).text('when');
			$(this).fadeIn(250);
		});
		$('.h2').fadeOut(250, function() {
			$(this).text(when.modes[when.mode]);
			$(this).fadeIn(250);
		});
		when[when.modes[when.mode]].start(watch);
	},

	end: function(watch, callback) {
		when[when.modes[when.mode]].end(watch, callback);
	},

	time: {
		start: function(watch) {
			updateWhenDots(watch);
			watch.numbers = newNumbers(watch, 27)
				.attr({'class': 'numbers'});
			watch.interface.add(watch.numbers);

			setTime(watch, watch.time.hour, watch.time.minutes, 500);
			$('.numbers text').each(function(i) {
				$(this).delay(i*25).animate({'opacity': '1'}, 250);
			});

			if (typeof watch.alarm === 'undefined') {
				watch.alarm = 17; }
			if (watch.alarmState != 'none') {
				watch.alarmHand = newDigitalHand(watch, 7, (watch.width/2)*.55, 0)
					.attr({'class': 'alarm'});
				watch.interface.add(watch.alarmHand);
				$('.alarm').animate({'opacity': '1'}, 500);
				setHand(watch, 'alarmHand', watch.alarm * 15, 500);
			}
		},

		end: function(watch, callback) {
			if (watch.alarmState != 'none') {
				setHand(watch, 'alarmHand', 0, 500);
			}
			$('.numbers text, .alarm').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.numbers;
				delete watch.alarmHand;
				delete watch.zoneHand;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			if (!watch.zoneHand) {
				newZoneHand(watch, watch.time.hour);
				if (typeof watch.zone === 'undefined') {
					watch.zone = watch.time.hour - 60;
				}
				setTime(watch, watch.zone, watch.time.minutes, 500);
			} else if (watch.hour == watch.time.hour) {
				setTime(watch, watch.zone, watch.time.minutes, 500);
			} else {
				setTime(watch, watch.time.hour, watch.time.minutes, 500);
			}
		},

		doubletap: function(watch, event) {
			if (!watch.zoneHand) {
				newZoneHand(watch, watch.time.hour);
				watch.zone = 0;
				setTime(watch, 0, watch.time.minutes, 500);
			} else if (watch.hour != 0) {
				watch.zone = 0;
				setTime(watch, 0, watch.time.minutes, 500);
			}
		},

		rotate: function(watch, event) {
			if (watch.zoneHand && watch.zone == 0) {
				if (event.type == 'rotatestart') {
					when.time.rotatecounter = 0;
					rotateUpdate = setInterval(function() {
						setTime(watch, watch.zone + when.time.rotatecounter, watch.time.minutes, 100);
					}, 100);
				} else if (event.type == 'rotateend') {
					watch.zone += when.time.rotatecounter;
					clearInterval(rotateUpdate);
				} else {
					when.time.rotatecounter = event.rotation;
				}
			}
		}
	},

	date: {
		start: function(watch) {
			updateWhenDots(watch);
			showMonth(watch);
		},

		end: function(watch, callback) {
			$('.calendar text').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.calendar;
				delete watch.calLabel;
				delete watch.yearDial;
				delete watch.monthDial;
				delete watch.dayDial;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			$('.calendar text, .calendarlabel').animate({'opacity': '0'}, 250).promise().done(function() {
				watch.interface.clear();
				switch (when.date.mode) {
					case 1:
						showYear(watch);
						break;
					case 2:
						showMonth(watch);
						break;
					case 3:
						showSetMonth(watch);
						break;
					case 4:
						showSetDate(watch);
						break;
					case 5:
						showMonth(watch);
						break;
				}
			});
		},

		doubletap: function(watch, event) {
			$('.calendar text, .calendarlabel').animate({'opacity': '0'}, 250).promise().done(function() {
				watch.interface.clear();
				showSetYear(watch);
			});
		},

		rotate: function(watch, event) {
			switch (when.date.mode) {
				case 3:
					if (event.type == 'rotatestart') {
						rotateUpdate = setInterval(function() {
							setTime(
								watch,
								((watch.time.year - 2000) * 6) + when.date.rotatecounter,
								((watch.time.year - 2000) * 6) + when.date.rotatecounter,
								100
							);
						}, 100);
					} else if (event.type == 'rotateend') {
						watch.time.year += Math.round(when.date.rotatecounter / 6);
						setTime(watch, (watch.time.year - 2000) * 6, (watch.time.year - 2000) * 6, 100);
						clearInterval(rotateUpdate);
					} else {
						when.date.rotatecounter = event.rotation;
					}
					break;
				case 4:
					if (event.type == 'rotatestart') {
						rotateUpdate = setInterval(function() {
							setTime(
								watch,
								((watch.time.month - 1) * 30) + when.date.rotatecounter,
								((watch.time.month - 1) * 30) + when.date.rotatecounter,
								100
							);
						}, 100);
					} else if (event.type == 'rotateend') {
						watch.time.month += Math.round(when.date.rotatecounter / 30);
						setTime(watch, (watch.time.month - 1) * 30, (watch.time.month - 1) * 30, 100);
						clearInterval(rotateUpdate);
					} else {
						when.date.rotatecounter = event.rotation;
					}
					break;
				case 5:
					if (event.type == 'rotatestart') {
						rotateUpdate = setInterval(function() {
							setTime(
								watch,
								(watch.time.date * 10) + when.date.rotatecounter,
								(watch.time.date * 10) + when.date.rotatecounter,
								100
							);
						}, 100);
					} else if (event.type == 'rotateend') {
						watch.time.date += Math.round(when.date.rotatecounter / 10);
						setTime(watch, watch.time.date * 10, watch.time.date * 10, 100);
						clearInterval(rotateUpdate);
					} else {
						when.date.rotatecounter = event.rotation;
					}
					break;
			}
		}
	},

	alarm: {
		start: function(watch) {
			updateWhenDots(watch);
			watch.numbers = newNumbers(watch, 27)
				.attr({'class': 'numbers'});
			watch.interface.add(watch.numbers);

			setTime(watch, watch.time.hour, watch.time.minutes, 500);
			$('.numbers text').each(function(i) {
				$(this).delay(i*25).animate({'opacity': '1'}, 250);
			});

			watch.alarmHand = newDigitalHand(watch, 7, (watch.width/2)*.55, 0)
				.attr({'class': 'alarm'});
			watch.alarmLabel = watch.canvas.text(watch.x, watch.y + 47, getAlarmLabel(watch))
				.attr({'class': 'alarmlabel'});
			watch.interface.add(
				watch.alarmHand,
				watch.alarmLabel
			);

			setHand(watch, 'alarmHand', watch.alarm * 15, 500);

			if (watch.alarmState != 'none') {
				$('.alarm, .alarmlabel').animate({'opacity': '1'}, 500);
			}
		},

		end: function(watch, callback) {
			setHand(watch, 'alarmHand', 0, 500);
			$('.numbers text, .alarm, .alarmlabel').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.numbers;
				delete watch.alarmHand;
				delete watch.zoneHand;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			// console.log('tap!');
		},

		doubletap: function(watch, event) {
			if (watch.alarmState == 'none') {
				$('.alarm, .alarmlabel').animate({'opacity': '1'}, 500);
				watch.alarmState = 'on';
			} else {
				$('.alarm, .alarmlabel').animate({'opacity': '0'}, 500);
				watch.alarmState = 'none';
			}
		},

		rotate: function(watch, event) {
			if (event.type == 'rotatestart') {
				if (watch.alarmState == 'none') {
					$('.alarm, .alarmlabel').animate({'opacity': '1'}, 500);
					watch.alarmState = 'on';
				}

				rotateUpdate = setInterval(function() {
					setHand(
						watch,
						'alarmHand',
						watch.alarm * 15 + when.alarm.rotatecounter,
						100
					);
				}, 100);
			} else if (event.type == 'rotateend') {
				watch.alarm += Math.round(when.alarm.rotatecounter / 15);
				setHand(watch, 'alarmHand', watch.alarm * 15, 100);
				$('.alarmlabel').animate({'opacity': '0'}, 250).promise().done(function() {
					$('.alarmlabel').text(getAlarmLabel(watch));
					$('.alarmlabel').animate({'opacity': '1'}, 500);
				});
				clearInterval(rotateUpdate);
			} else {
				when.alarm.rotatecounter = event.rotation;
			}
		}
	},

	timer: {
		start: function(watch) {
			updateWhenDots(watch);
			watch.timerDial = newTimerDial(watch, 30)
				.attr({'class': 'timerDial'});
			watch.timerSubdial = newTimerSubdial(watch, 30)
				.attr({'class': 'timerSubdial'});
			watch.interface.add(
				watch.timerDial,
				watch.timerSubdial
			);

			$('.timerDial text, .timerSubdial text').each(function(i) {
				$(this).delay(i*25).animate({'opacity': '1'}, 250);
			});

			if (watch.timerstatus == 'on') {
				watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
					.attr({'class': 'timerHand'});
				watch.pie = newPie(watch, 27, 0, watch.timercounter);
				watch.pie.circle.attr({'class': 'pie'});
				watch.interface.add(
					watch.timerHand,
					watch.pie.circle
				);
				$('.timerHand').animate({'opacity': '1'}, 500);

				timerUpdate = setInterval(function() {
					watch.timercounter++;
					setTime(watch, 0, watch.timercounter, 150);
					setPie(watch, watch.pie, 27, 0, watch.timercounter, 150);
				}, 150);
			} else if (watch.timerstatus == 'paused') {
				watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
					.attr({'class': 'timerHand'});
				watch.pie = newPie(watch, 27, 0, 0);
				watch.pie.circle.attr({'class': 'pie'});
				watch.interface.add(
					watch.timerHand,
					watch.pie.circle
				);
				$('.timerHand').animate({'opacity': '1'}, 500);
				setTime(watch, 0, watch.timercounter, 500);
				setPie(watch, watch.pie, 27, 0, watch.timercounter, 500);
			} else if (watch.timerstatus == 'timing') {
				watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
					.attr({'class': 'timerHand'});
				watch.pie = newPie(watch, 27, 0, 0);
				watch.pie.circle.attr({'class': 'pie'});
				watch.interface.add(
					watch.timerHand,
					watch.pie.circle
				);
				$('.timerHand').animate({'opacity': '1'}, 500);

				setTime(watch, 0, watch.timercounter, 100);
				setHand(watch, 'timerHand', watch.timerstarted, 100);
				setPie(watch, watch.pie, 27, 0, watch.timercounter, 100);
				timerUpdate = setInterval(function() {
					watch.timercounter--;
					setTime(watch, 0, watch.timercounter, 150);
					setPie(watch, watch.pie, 27, 0, watch.timercounter, 150);
				}, 150);
			} else if (watch.timerstatus == 'set') {
				watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
					.attr({'class': 'timerHand'});
				watch.pie = newPie(watch, 27, 0, 0);
				watch.pie.circle.attr({'class': 'pie'});
				watch.interface.add(
					watch.timerHand,
					watch.pie.circle
				);
				$('.timerHand').animate({'opacity': '1'}, 500);

				setTime(watch, 0, watch.timercounter, 500);
				setHand(watch, 'timerHand', watch.timerstarted, 500);
				setPie(watch, watch.pie, 27, 0, watch.timercounter, 500);
			} else {
				setTime(watch, 0, 0, 500);
			}
		},

		end: function(watch, callback) {
			if (watch.timerstatus == 'on' || watch.timerstatus == 'timing') {
				clearInterval(timerUpdate);
			}
			if (typeof watch.timerstatus !== 'undefined') {
				$(watch.pie.circle.node).animate({'opacity': '0'}, 250, function() {
					$(this).remove();
					$('.timerHand').remove();
				});
			}
			$('.timerDial text, .timerSubdial text').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.timerDial;
				delete watch.timerSubdial;
				delete watch.timerHand;
				delete watch.pie;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			if (typeof watch.timercounter === 'undefined') {
				watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
					.attr({'class': 'timerHand'});
				watch.pie = newPie(watch, 27, 0, 0);
				watch.pie.circle.attr({'class': 'pie'});
				watch.interface.add(
					watch.timerHand,
					watch.pie.circle
				);
				$('.timerHand').animate({'opacity': '1'}, 500);

				watch.timercounter = 0;
				watch.timerstatus = 'on';

				timerUpdate = setInterval(function() {
					watch.timercounter++;
					setTime(watch, 0, watch.timercounter, 150);
					setPie(watch, watch.pie, 27, 0, watch.timercounter, 150);
				}, 150);
			} else if (watch.timerstatus == 'on') {
				clearInterval(timerUpdate);
				watch.timerstatus = 'paused';
			} else if (watch.timerstatus == 'paused') {
				timerUpdate = setInterval(function() {
					watch.timercounter++;
					setTime(watch, 0, watch.timercounter, 150);
					setPie(watch, watch.pie, 27, 0, watch.timercounter, 150);
				}, 150);
				watch.timerstatus = 'on';
			} else if (watch.timerstatus == 'timing') {
				clearInterval(timerUpdate);
				watch.timerstatus = 'set';
			} else if (watch.timerstatus == 'set') {
				timerUpdate = setInterval(function() {
					watch.timercounter--;
					setTime(watch, 0, watch.timercounter, 150);
					setPie(watch, watch.pie, 27, 0, watch.timercounter, 150);
					if (watch.timercounter < 1) {
						setTime(watch, 0, 0, 500);
						setHand(watch, 'timerHand', 0, 500);
						$(watch.pie.circle.node).animate({'opacity': '0'}, 500, function() {
							$(this).remove();
							$('.timerHand').remove();
						});
						delete watch.timercounter;
						delete watch.timerstatus;
						delete watch.timerHand;
						delete watch.pie;
						clearInterval(timerUpdate);
					}
				}, 150);
				watch.timerstatus = 'timing';
			}
		},

		doubletap: function(watch, event) {
			if (watch.timerstatus == 'on' || watch.timerstatus == 'paused' || watch.timerstatus == 'timing' || watch.timerstatus == 'set') {
				if (watch.timerstatus == 'on' || watch.timerstatus == 'paused' || watch.timerstatus == 'timing') {
					clearInterval(timerUpdate);
				}
				setTime(watch, 0, 0, 500);
				setHand(watch, 'timerHand', 0, 500);
				$(watch.pie.circle.node).animate({'opacity': '0'}, 500, function() {
					$(this).remove();
					$('.timerHand').remove();
				});
				delete watch.timercounter;
				delete watch.timerstatus;
				delete watch.timerHand;
				delete watch.pie;
			}
		},

		rotate: function(watch, event) {
			if (event.type == 'rotatestart') {
				if (typeof watch.timercounter === 'undefined') {
					watch.timerHand = newDigitalHand(watch, 7, (watch.width/2)*.86, 0)
						.attr({'class': 'timerHand'});
					watch.pie = newPie(watch, 27, 0, 0);
					watch.pie.circle.attr({'class': 'pie'});
					watch.interface.add(
						watch.timerHand,
						watch.pie.circle
					);
					$('.timerHand').animate({'opacity': '1'}, 500);
					watch.timercounter = 0;
				} else if (watch.timerstatus == 'on' || watch.timerstatus == 'paused' || watch.timerstatus == 'timing') {
					clearInterval(timerUpdate);
					delete watch.timerstatus;
				}
				rotateUpdate = setInterval(function() {
					setTime(watch, 0, watch.timercounter + when.timer.rotatecounter, 100);
					setHand(watch, 'timerHand', watch.timercounter + when.timer.rotatecounter, 100);
					setPie(watch, watch.pie, 27, 0, watch.timercounter + when.timer.rotatecounter, 100);
				}, 100);
			} else if (event.type == 'rotateend') {
				watch.timercounter += Math.round(when.timer.rotatecounter);
				watch.timerstarted = watch.timercounter;
				setTime(watch, 0, watch.timercounter, 100);
				setHand(watch, 'timerHand', watch.timerstarted, 100);
				setPie(watch, watch.pie, 27, 0, watch.timercounter, 100);
				clearInterval(rotateUpdate);
				watch.timerstatus = 'set';
			} else {
				when.timer.rotatecounter = event.rotation;
			}
		}
	},

	button: function(watch) {
		switch (watch.mode) {
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
				$('.h2').fadeOut(250, function() {
					$(this).text(when.modes[when.mode]);
					$(this).fadeIn(250);
				});
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
	var numbers = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 5, '12'));
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 5;
		numbers.add(watch.canvas.text(x, y, i));
	}
	return numbers;
}

function newZoneHand(watch, angle) {
	watch.zoneHand = newDigitalHand(watch, 7, (watch.width/2)*.55, angle)
		.attr({'class': 'zone'});
	watch.interface.add(watch.zoneHand);
	$('.zone').css({'opacity': '1'});
}

function newCalendarDial(watch, offset, textOffset, labels) {
	var calendarDial = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + textOffset + 2, labels[0]));
	for (var i=1; i<labels.length; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-labels.length/4) / labels.length);
		if (i == 6) {
			var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-labels.length/4) / labels.length) + textOffset - 2;
		} else {
			var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-labels.length/4) / labels.length) + textOffset;
		}
		calendarDial.add(watch.canvas.text(x, y, labels[i]));
	}
	return calendarDial;
}

function newDayDial(watch, offset) {
	var dayDial = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 3.5, '1'));
	for (var i=1; i<11; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 3.5;
		dayDial.add(watch.canvas.text(x, y, 3*i));
	}
	return dayDial;
}

function showMonth(watch) {
	when.date.mode = 1;

	watch.calendar = newCalendarDial(watch, 24, 3.5, ['mon', '5', '10', '15', '20', '25', 'sun', 'sat', 'fri', 'thurs', 'wed', 'tue'])
		.attr({'class': 'calendar'});
	watch.calLabel = watch.canvas.text(watch.x, watch.y + 47, watch.time.fullMonth[watch.time.month])
		.attr({'class': 'calendarlabel'});
	watch.interface.add(
		watch.calendar,
		watch.calLabel
	);

	var dateAngle = watch.time.date * 6;
	if (watch.time.day == 0) {
		var dayAngle = 180;
	} else {
		var dayAngle = 360 - ((watch.time.day - 1) * 30);
	}

	setTime(watch, dayAngle, dateAngle, 500);
	$('.calendar text, .calendarlabel').each(function(i) {
		$(this).delay(i*25).animate({'opacity': '1'}, 250);
	});
}

function showYear(watch) {
	when.date.mode = 2;

	watch.calendar = newCalendarDial(watch, 24, 3.5, ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', '10\'', '15\'', '20\'', '25\'', '30\'', '35\''])
		.attr({'class': 'calendar'});
	watch.calLabel = watch.canvas.text(watch.x, watch.y + 47, watch.time.date)
		.attr({'class': 'calendarlabel'});
	watch.interface.add(
		watch.calendar,
		watch.calLabel
	);
	
	var monthAngle = watch.time.month * 15;
	var yearAngle = 180 + ((watch.time.year - 2010) * 6);

	setTime(watch, yearAngle, monthAngle, 500);
	$('.calendar text, .calendarlabel').each(function(i) {
		$(this).delay(i*25).animate({'opacity': '1'}, 250);
	});
}

function showSetYear(watch) {
	when.date.mode = 3;
	watch.time.year = 2000;

	watch.calendar = newCalendarDial(watch, 24, 3.5, ['00\'', '05\'', '10\'', '15\'', '20\'', '25\'', '30\'', '35\'', '40\'', '45\'', '50\'', '55\''])
		.attr({'class': 'calendar'});
	watch.calLabel = watch.canvas.text(watch.x, watch.y + 47, 'Set Year')
		.attr({'class': 'calendarsetlabel'});
	watch.interface.add(
		watch.calendar,
		watch.calLabel
	);

	setTime(watch, 0, 0, 500);
	$('.calendar text, .calendarsetlabel').each(function(i) {
		$(this).delay(i*25).animate({'opacity': '1'}, 250);
	});
}

function showSetMonth(watch) {
	when.date.mode = 4;

	watch.calendar = newCalendarDial(watch, 24, 3.5, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
		.attr({'class': 'calendar'});
	watch.calLabel = watch.canvas.text(watch.x, watch.y + 47, 'Set Month')
		.attr({'class': 'calendarsetlabel'});
	watch.interface.add(
		watch.calendar,
		watch.calLabel
	);

	setTime(watch, 0, 0, 500);
	$('.calendar text, .calendarsetlabel').each(function(i) {
		$(this).delay(i*25).animate({'opacity': '1'}, 250);
	});
}

function showSetDate(watch) {
	when.date.mode = 5;

	watch.calendar = newDayDial(watch, 27)
		.attr({'class': 'calendar'});
	watch.calLabel = watch.canvas.text(watch.x, watch.y + 47, 'Set Date')
		.attr({'class': 'calendarsetlabel'});
	watch.interface.add(
		watch.calendar,
		watch.calLabel
	);

	setTime(watch, 0, 0, 500);
	$('.calendar text, .calendarsetlabel').each(function(i) {
		$(this).delay(i*25).animate({'opacity': '1'}, 250);
	});
}

function getAlarmLabel(watch) {
	var alarmlabel = String(watch.alarm / 2);
	if (alarmlabel.length > 2) {
		alarmlabel = alarmlabel.split('.')[0] + ':30';
	} else {
		alarmlabel = alarmlabel.split('.')[0] + ':00';
	}
	return alarmlabel;
}

function calcPie(watch, offset, start, stop) {
	var pieradius = (watch.width - offset) / 4;
	var piethickness = (watch.width - offset) / 2;

	var piestart = start / 360;
	var pieend = stop / 360;

	var pietotallength = 2 * Math.PI * pieradius;
	var pielength = (pieend - piestart) * pietotallength;

	var pie = {
		pieradius: pieradius,
		piethickness: piethickness,
		piestart: piestart,
		pieend: pieend,
		pietotallength: pietotallength,
		pielength: pielength,
	}

	return pie;
}

function newPie(watch, offset, start, stop) {
	var pieValues = calcPie(watch, offset, start, stop);

	var pie = {
		pieradius: pieValues.pieradius,
		piestart: pieValues.piestart,
		pieend: pieValues.pieend,
		pietotallength: pieValues.pietotallength,
		pielength: pieValues.pielength,
		circle: watch.canvas.circle(watch.x, watch.y, pieValues.pieradius).attr({
			'stroke-dasharray': pieValues.pielength + ' ' + (pieValues.pietotallength - pieValues.pielength),
			'stroke-dashoffset': (.25 - pieValues.piestart) * pieValues.pietotallength,
			'stroke-width': pieValues.piethickness
		})
	}

	return pie;
}

function setPie(watch, pie, offset, start, stop) {
	var pieValues = calcPie(watch, offset, start, stop);

	pie.pieradius = pieValues.pieradius;
	pie.piestart = pieValues.piestart;
	pie.pieend = pieValues.pieend;
	pie.pietotallength = pieValues.pietotallength;
	pie.pielength = pieValues.pielength;

	$(pie.circle.node).css({
		'stroke-dasharray': pieValues.pielength + ' ' + (pieValues.pietotallength - pieValues.pielength),
		'stroke-dashoffset': (.25 - pieValues.piestart) * pieValues.pietotallength
	});
}

function newTimerDial(watch, offset) {
	var timerDial = watch.canvas.group(watch.canvas.text(watch.x, watch.y - (watch.width/2) + offset + 6, '0'));
	var text = ['0', '15', '30', '45'];
	for (var i=1; i<4; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-1) / 4);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-1) / 4) + 6;
		timerDial.add(watch.canvas.text(x, y, text[i]));
	}
	return timerDial;
}

function newTimerSubdial(watch, offset) {
	var timerSubdial = watch.canvas.group();
	var text = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
	for (var i=1; i<12; i++) {
		var x = watch.x + ((watch.width/2) - offset) * Math.cos(2 * Math.PI * (i-3) / 12);
		var y = watch.y + ((watch.width/2) - offset) * Math.sin(2 * Math.PI * (i-3) / 12) + 6;
		timerSubdial.add(watch.canvas.text(x, y, text[i]));
		if (i == 2 || i == 5 || i == 8) {i+=1};
	}
	return timerSubdial;
}

function updateWhenDots(watch) {
	$('.buttonlabel').animate({
		'opacity': '.25',
		'fill': '#999'
	}, 250).promise().done(function() {
		$(watch.buttonlabel1[when.mode-1].node).animate({
			'opacity': '1',
			'fill': '#00AEEF'
		}, 250);
	});
}

function updateWhenDots(watch) {
	$('.buttonlabel').removeClass('active');
	$('.buttonlabel').animate({'opacity': '.25'}, 250).promise().done(function() {
		watch.buttonlabel1[when.mode-1].addClass('active');
		$(watch.buttonlabel1[when.mode-1].node).animate({'opacity': '1'}, 250);
	});
}