what = {
	mode: 1,
	modes: ['', 'activity', 'cumulative'],

	start: function(watch) {
		watch.mode = 2;
		$('.h1').fadeOut(250, function() {
			$(this).text('what');
			$(this).fadeIn(250);
		});
		$('.h2').fadeOut(250, function() {
			$(this).text(what.modes[what.mode]);
			$(this).fadeIn(250);
		});
		what[what.modes[what.mode]].start(watch);
	},

	end: function(watch, callback) {
		what[what.modes[what.mode]].end(watch, callback);
		what.activity.mode = 0;
	},

	activity: {
		start: function(watch) {
			setInstructions(watch, '● to view other past', 'activities today', '', '', true);
			updateWhatDots(watch);
			watch.activityDial = newCalendarDial(watch, 28, 5.5, what.activity.units[what.activity.modesettings[what.activity.mode][2]])
				.attr({'class': 'activitydial'});
			watch.activityLabel = watch.canvas.text(watch.x, watch.y + 46, what.activity.modesettings[what.activity.mode][0])
				.attr({'class': 'activitylabel'});
			watch.interface.add(
				watch.activityDial,
				watch.activityLabel
			);

			watch.pie = newActivityPie(watch, 4.5, 0, 0);
			watch.pie.circle.attr({'class': 'pie'});
			watch.pie.icon = watch.canvas.path(what.activity.modesettings[what.activity.mode][4])
				.transform('t' + (watch.x - 20) + ',' + (watch.y - (watch.width/5.5) - 20))
				.attr({'class': 'icon'});
			watch.interface.add(
				watch.pie.circle,
				watch.pie.icon
			);

			setTime(watch, what.activity.modesettings[what.activity.mode][1], what.activity.modesettings[what.activity.mode][1], 500);
			setActivityPie(watch, watch.pie, 4.5, 0, what.activity.modesettings[what.activity.mode][1], 500);
			$('.icon').animate({'opacity': '1'}, 500);
			$('.activitydial text, .activitylabel').each(function(i) {
				$(this).delay(i*25).animate({'opacity': '1'}, 250);
			});
		},

		end: function(watch, callback) {
			$('.activitydial text, .activitylabel, .icon, .pie').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.activityDial;
				delete watch.activityLabel;
				delete watch.pie;
				watch.interface.clear();
				callback(watch);
			});
		},

		mode: 0,

		modesettings: [
			['Cycling', 68, 'minutes', 24,
				'M0.136,24.55c0,4.278,3.48,7.758,7.759,7.758c3.744,0,6.878-2.667,7.601-6.201c0.029,0,0.057,0.001,0.086,0.001c6.108-0.243,1.85,1.698,13.2-10.274c0.195,0.606,0.376,1.173,0.545,1.704c-2.774,1.184-4.723,3.938-4.723,7.139c0,4.278,3.48,7.758,7.759,7.758c4.278,0,7.758-3.48,7.758-7.758s-3.48-7.759-7.758-7.759c-0.487,0-0.962,0.047-1.423,0.133c-3.016-9.7-2.039-9.066-7.671-9.12v1.55c4.091-0.007,3.577-0.238,4.486,2.936H14.263l-0.528-1.485c3.024-0.671,3.863-0.667,3.266-1.484h-6.828v1.517L11.987,11l0.528,1.451c-0.827,1.841-1.534,3.409-2.138,4.749c-0.78-0.264-1.613-0.409-2.481-0.409C3.617,16.791,0.136,20.272,0.136,24.55z M29.877,19.282c1.93,6.152,1.757,6.024,2.529,6.102c0.431-0.029,0.774-0.366,0.764-0.79c-0.012-0.503,0.216,0.176-1.678-5.794c0.284-0.042,0.574-0.064,0.87-0.064c3.277,0,5.943,2.666,5.943,5.943s-2.667,5.943-5.944,5.943s-5.943-2.666-5.943-5.943C26.419,22.287,27.838,20.224,29.877,19.282z M14.943,14.055l13.202,0.024l-9.387,10.23L14.943,14.055z M11.898,17.907l1.453-3.22l3.745,9.831l-1.443,0.004C15.643,21.72,14.139,19.262,11.898,17.907z M13.838,24.528l-4.935,0.014l2.241-4.965C12.759,20.636,13.83,22.458,13.838,24.528z M1.952,24.55c0-3.278,2.666-5.944,5.943-5.944c0.601,0,1.182,0.091,1.73,0.258c-2.693,5.958-2.809,6.173-2.817,6.485c0.086,1.073,0.638,0.756,6.824,0.75c-0.684,2.528-2.996,4.393-5.737,4.393C4.618,30.494,1.952,27.828,1.952,24.55z'],
			['Swimming', 243, 'minutes', 24,
				'M0,29.9c1.8-0.1,2.8-1.6,2.8-1.6C2.9,28.1,3.1,28,3.2,28l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0,1,1.6,2.8,1.6c1.8,0,2.8-1.6,2.8-1.6C9.5,28.1,9.7,28,9.9,28l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0,1,1.6,2.8,1.6c1.9,0,2.8-1.6,2.8-1.6c0.1-0.2,0.3-0.3,0.5-0.3l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0,1,1.6,2.8,1.6c1.9,0,2.8-1.6,2.8-1.6c0.1-0.2,0.3-0.3,0.5-0.3l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0.1,1,1.6,2.8,1.6c1.9,0,2.8-1.6,2.8-1.6c0.1-0.2,0.3-0.3,0.5-0.3l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0,1,1.6,2.8,1.6c1.9,0,2.8-1.6,2.8-1.6c0.1-0.2,0.3-0.3,0.5-0.3l0,0l0,0c0.2,0,0.4,0.1,0.5,0.3c0,0.1,1,1.6,2.8,1.6v1.7c-1.6,0-2.7-0.9-3.3-1.6c-0.6,0.7-1.7,1.6-3.3,1.6c-1.6,0-2.8-0.9-3.3-1.6c-0.6,0.7-1.7,1.6-3.3,1.6s-2.8-0.9-3.3-1.6c-0.6,0.7-1.7,1.6-3.3,1.6c-1.6,0-2.8-0.9-3.3-1.6c-0.6,0.7-1.7,1.6-3.3,1.6s-2.8-0.9-3.3-1.6c-0.6,0.7-1.7,1.6-3.3,1.6c-1.6,0-2.8-0.9-3.3-1.6c-0.6,0.6-1.7,1.5-3.3,1.6V29.9z M29.2,22.7c0.8,2.6,3.5,3.4,6.1,2.6c2.5-0.8,4-3.1,3.2-5.6c-0.8-2.5-3.6-3.9-6.1-3.1C29.8,17.4,28.4,20.2,29.2,22.7z M6.7,27.6c2.2,0,3.3-1.9,3.3-1.9s1.1,1.9,3.3,1.9c2.2,0,3.3-1.9,3.3-1.9s1.1,1.9,3.3,1.9s3.3-1.9,3.3-1.9s1.1,1.9,3.3,1.9c1.4,0,2.4-0.8,2.9-1.4c-0.3-0.7-1.8-4.2-2.2-4.9c-0.6-1.2-1.4-2.3-1.5-2.6c-0.3-0.7,0.1-1.4,0.5-2.3c0.4-0.9,1.5-3.1,1.5-3.1s7.7,0.4,8.2,0.3c0.9,0,1.4-0.5,1.8-1c0.7-1,0.4-2.5-0.7-3.2C36.7,9,36,9.1,34.9,9c0,0-7.6-0.5-9-0.6c-1.4-0.1-2.6,1.2-3.1,2.4c-0.5,1.2-4.1,9.2-4.1,9.2L3.9,26.3c0,0,0.5,0.9,1.9,1.2C6.1,27.6,6.4,27.6,6.7,27.6z'],
			['Sitting', 112, 'halfday', 2,
				'M25.3,39.9c-0.1,0-0.2,0-0.3,0c-0.4,0-0.8-0.3-1-0.7l-2.2-7.9c0-0.1,0-0.2,0-0.3c-1.8,0-4,0-4.8-0.1c-0.2,0-0.3-0.1-0.5-0.1c0,0,0,0,0,0l-4,8.5c-0.2,0.4-0.5,0.6-0.9,0.6c-0.1,0-0.3,0-0.4-0.1c-0.5-0.2-0.7-0.8-0.5-1.3l4-8.4c-1.1-0.6-2.3-1.5-3.1-2.8c-1.4-2.3-1.9-5.8-2.2-7.6c-0.3-1.8-0.8-4.1-0.8-5.1c0-1,1.1-1.4,1.1-1.4s1.2-0.2,1.6,0.3c0.4,0.5,0.7,1.8,0.9,3.2c0.2,1.4,0.9,4.6,1.2,5.9c0.3,1.3,0.5,2.3,1.2,3.1c0.7,0.8,1,1.3,2.1,1.6c1.1,0.3,3.4,0.3,4.5,0.3c1.1,0,2.9-0.1,3.4,0c0.5,0.1,1.3,0.7,1.3,1.6c0,0.8-0.4,1.7-1.2,1.9c-0.1,0-0.4,0.1-0.8,0.1l2.1,7.6C26.2,39.2,25.9,39.8,25.3,39.9z M15.5,22.6c0.3,1.5,1.5,2.9,3.5,2.9h8.3c0,0,0,6.5,0,9.2c0,2.9,4.1,2.9,4.1,0.1V22.9c0-1.4-1-2.9-2.9-2.9l-6.5,0l-1.8-8.7c-1-4.6-7.4-3.2-6.7,1.3L15.5,22.6z M16,7.7c2.1,0,3.9-1.7,3.9-3.8C19.9,1.8,18.1,0,16,0c-2.1,0-3.9,1.7-3.9,3.8C12.1,6,13.8,7.7,16,7.7z'],
			['Walking', 288, 'halfday', 4,
				'M31,21.8l-1.5,0.9c-0.1,0.1-0.4,0-0.4-0.1l-3.4-5.1c0,0,0,0,0-0.1l-0.4-1.2c0-0.1-0.2-0.1-0.3,0l-1.6,4.1c0,0.1,0,0.2,0,0.3l4.7,7.1c0,0,0,0,0,0.1l2.6,10.6c0,0.2,0,0.4-0.2,0.4l-2.1,0.6c-0.2,0-0.4,0-0.4-0.2l-3.6-10.2c0,0,0,0,0-0.1l-3.5-4.8c-0.1-0.2-0.5-0.1-0.6,0.1l-1.7,6.6c0,0,0,0.1,0,0.1l-7.3,8.8c-0.1,0.1-0.3,0.1-0.4,0l-1.8-1.3C9,38.5,8.9,38.3,9,38.1l5.8-8.6c0,0,0-0.1,0-0.1L17.9,13c0-0.3-0.2-0.5-0.5-0.4l-2,1c-0.1,0-0.2,0.1-0.2,0.2l-1,5.1c0,0.2-0.2,0.3-0.4,0.3l-1.7-0.3c-0.2,0-0.3-0.2-0.3-0.4l0.8-6.3c0-0.1,0-0.2,0.1-0.2l5.8-4.6c0.7-0.5,1.6-0.7,2.5-0.4l4.4,1.5c1,0.3,1.7,1.2,1.8,2.2l0.7,5.9c0,0,0,0.1,0,0.1l2.8,4.7C31.1,21.5,31,21.7,31,21.8z M21.6,3.3c0,1.8,1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3S26.7,0,24.9,0S21.6,1.5,21.6,3.3z'],
			['Sleeping', 248, 'halfday', 2,
				'M34.1,15.2L32.7,12c-0.2-0.5-0.7-1-1.2-1.2l-3.2-1.4l3.2-1.4c0.5-0.2,1-0.7,1.2-1.2l1.4-3.2l1.4,3.2c0.2,0.5,0.7,1,1.2,1.2l3.2,1.4l-3.2,1.4c-0.5,0.2-1,0.7-1.2,1.2L34.1,15.2z M24.4,5.5C24.5,5.2,24.7,5,25,4.9l1.4-0.6L25,3.7c-0.2-0.1-0.4-0.3-0.5-0.5l-0.6-1.4l-0.6,1.4c-0.1,0.2-0.3,0.4-0.5,0.5l-1.4,0.6l1.4,0.6c0.2,0.1,0.4,0.3,0.5,0.5l0.6,1.4L24.4,5.5z M27,30.6c-8.5,0-15.4-6.9-15.4-15.4c0-3.9,1.5-7.5,3.9-10.2C6.9,5.7,0.2,12.8,0.2,21.6c0,9.2,7.4,16.6,16.6,16.6c6.1,0,11.5-3.3,14.4-8.3C29.8,30.4,28.5,30.6,27,30.6'],
		],

		units: {
			minutes: ['0', '15', '30', '45'],
			halfday: ['0', '3', '6', '9']
		},

		tap: function(watch, event) {
			var oldmode = what.activity.mode;

			if (oldmode < what.activity.modesettings.length - 1) {
				what.activity.mode++;
			} else {
				what.activity.mode = 0;
			}

			if (what.activity.modesettings[oldmode][2] != what.activity.modesettings[what.activity.mode][2]) {
				$('.activitydial text').animate({'opacity': '0'}, 250).promise().done(function() {
					$('.activitydial').remove();
					delete watch.activityDial;
					watch.activityDial = newCalendarDial(watch, 28, 5.5, what.activity.units[what.activity.modesettings[what.activity.mode][2]])
						.attr({'class': 'activitydial'});
					watch.interface.add(watch.activityDial);
					$('.activitydial text').each(function(i) {
						$(this).delay(i*25).animate({'opacity': '1'}, 250);
					});
				});
			}

			$('.activitylabel, .icon').animate({'opacity': '0'}, 250, function() {
				watch.activityLabel.attr('text', what.activity.modesettings[what.activity.mode][0]);
				$('.icon').remove();
				delete watch.pie.icon;
				watch.pie.icon = watch.canvas.path(what.activity.modesettings[what.activity.mode][4])
					.attr({'class': 'icon'})
					.transform('t' + (watch.x - 20) + ',' + (watch.y - (watch.width/5.5) - 20));
				watch.interface.add(watch.pie.icon);
				$('.activitylabel, .icon').animate({'opacity': '1'}, 250);
			});

			setTime(watch, what.activity.modesettings[what.activity.mode][1], what.activity.modesettings[what.activity.mode][1], 500);
			setActivityPie(watch, watch.pie, 4.5, 0, what.activity.modesettings[what.activity.mode][1], 500);
		},

		doubletap: function(watch, event) {
			// console.log('doubletap!');
		},

		rotate: function(watch, event) {
			// console.log('rotate!');
			// if (event.type == 'rotatestart') {

			// } else if (event.type == 'rotateend') {

			// } else {

			// }
		}
	},

	cumulative: {
		start: function(watch) {
			setInstructions(watch, '', '', '', '', true);
			updateWhatDots(watch);
			watch.activityDial = newCalendarDial(watch, 28, 5.5, ['0', '6', '12', '18'])
				.attr({'class': 'activitydial'});
			watch.interface.add(watch.activityDial);

			what.activity.sortedmodes = what.activity.modesettings.slice(0);
			what.activity.sortedmodes.sort(function(a, b) {
				if (a[1] / a[3] < b[1] / b[3]) { return 1; }
				if (a[1] / a[3] > b[1] / b[3]) { return -1; }
				return 0;
  			});

			watch.pies = [0];
			for (var i=1; i<what.activity.sortedmodes.length+1; i++) {
				watch.pies[i] = newCumulativePie(
					watch,
					what.activity.sortedmodes[i-1],
					(what.activity.sortedmodes.length-i)*(50/what.activity.sortedmodes.length)+1,
					0,
					0
				);
				watch.pies[i].circle.attr({'class': 'cumulativepie'});
				watch.pies[i].rim.attr({'class': 'cumulativepierim'});
				watch.pies[i].leftedge.attr({'class': 'cumulativepierim'});
				watch.pies[i].rightedge.attr({'class': 'cumulativepierim'});
				watch.pies[i].icon.attr({'class': 'cumulativeicon'});
				watch.interface.add(
					watch.pies[i].circle,
					watch.pies[i].rim,
					watch.pies[i].leftedge,
					watch.pies[i].rightedge,
					watch.pies[i].icon
				);

				watch.pies[0] += what.activity.sortedmodes[i-1][1] / what.activity.sortedmodes[i-1][3];
			}

			setTime(watch, 0, watch.pies[0], 500);
			$('.activitydial text, .cumulativeicon').each(function(i) {
				$(this).delay(i*25).animate({'opacity': '1'}, 250);
			});

			watch.pies[0] = 0;
			for (var i=1; i<what.activity.sortedmodes.length+1; i++) {
				setCumulativePie(
					watch,
					watch.pies[i],
					(what.activity.sortedmodes.length-i)*(50/what.activity.sortedmodes.length)+1,
					watch.pies[0],
					watch.pies[0] + (what.activity.sortedmodes[i-1][1] / what.activity.sortedmodes[i-1][3]),
					500
				);

				watch.pies[0] += what.activity.sortedmodes[i-1][1] / what.activity.sortedmodes[i-1][3];
			}
		},

		end: function(watch, callback) {
			watch.pies[0] = 0;
			for (var i=1; i<what.activity.sortedmodes.length+1; i++) {
				setCumulativePie(
					watch,
					watch.pies[i],
					(what.activity.sortedmodes.length-i)*(50/what.activity.sortedmodes.length)+1,
					0,
					0,
					500
				);

				watch.pies[0] += what.activity.sortedmodes[i-1][1] / what.activity.sortedmodes[i-1][3];
			}
			$('.activitydial text, .cumulativeicon, .cumulativepie, .cumulativepierim').animate({'opacity': '0'}, 250).promise().done(function() {
				delete watch.activityDial;
				delete watch.activityLabel;
				delete watch.pies;
				watch.interface.clear();
				callback(watch);
			});
		},

		tap: function(watch, event) {
			// console.log('tap!');
		},

		doubletap: function(watch, event) {
			// console.log('doubletap!');
		},

		rotate: function(watch, event) {
			// console.log('rotate!');
			// if (event.type == 'rotatestart') {

			// } else if (event.type == 'rotateend') {

			// } else {

			// }
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
				$('.h2').fadeOut(250, function() {
					$(this).text(what.modes[what.mode]);
					$(this).fadeIn(250);
				});
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

function calcActivityPie(watch, offset, start, stop) {
	var pieradius = (watch.width / 2) - offset - 1;
	var piethickness = offset * 2;

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

function newActivityPie(watch, thickness, start, stop) {
	var pieValues = calcActivityPie(watch, thickness, start, stop);

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

function setActivityPie(watch, pie, thickness, start, stop) {
	var pieValues = calcActivityPie(watch, thickness, start, stop);

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

function newCumulativePie(watch, icon, offset, start, stop) {
	var pieValues = calcPie(watch, offset, start, stop);
	var rimValues = calcActivityPie(watch, offset / 2, start, stop);

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
		}),
		rim: watch.canvas.circle(watch.x, watch.y, rimValues.pieradius).attr({
			'stroke-dasharray': rimValues.pielength + ' ' + (rimValues.pietotallength - rimValues.pielength),
			'stroke-dashoffset': (.25 - rimValues.piestart) * rimValues.pietotallength,
			'stroke-width': 1
		}),
		leftedge: watch.canvas.line(
			watch.x,
			watch.y,
			watch.x,
			watch.y - rimValues.pieradius + 0.5
		),
		rightedge: watch.canvas.line(
			watch.x,
			watch.y,
			watch.x,
			watch.y - rimValues.pieradius + 0.5
		)
	}

	pie.leftedge.transform('r' + start + ',' + watch.x + ',' + watch.y);
	pie.rightedge.transform('r' + stop + ',' + watch.x + ',' + watch.y);

	pie.icon = watch.canvas.path(icon[4])
		.transform('t' + (watch.x - 20) + ',' + (watch.y - 20) + 's0');

	return pie;
}

function setCumulativePie(watch, pie, offset, start, stop, speed) {
	var pieValues = calcPie(watch, offset, start, stop);
	var rimValues = calcActivityPie(watch, offset / 2, start, stop);

	pie.pieradius = pieValues.pieradius;
	pie.piestart = pieValues.piestart;
	pie.pieend = pieValues.pieend;
	pie.pietotallength = pieValues.pietotallength;
	pie.pielength = pieValues.pielength;

	$(pie.circle.node).css({
		'stroke-dasharray': pieValues.pielength + ' ' + (pieValues.pietotallength - pieValues.pielength),
		'stroke-dashoffset': (.25 - pieValues.piestart) * pieValues.pietotallength
	});

	$(pie.rim.node).css({
		'stroke-dasharray': rimValues.pielength + ' ' + (rimValues.pietotallength - rimValues.pielength),
		'stroke-dashoffset': (.25 - rimValues.piestart) * rimValues.pietotallength
	});

	pie.leftedge.animate({transform: 'r' + start + ',' + watch.x + ',' + watch.y}, speed, mina.easeinout);
	pie.rightedge.animate({transform: 'r' + stop + ',' + watch.x + ',' + watch.y}, speed, mina.easeinout, function() {
		if (stop-start > 20) {
			pie.icon.animate({transform:
				't' +
				(watch.x - 20 + pieValues.pieradius * 1.1 * Math.cos((start+((stop-start)/2)-90) * (Math.PI / 180))) + ',' +
				(watch.y - 20 + pieValues.pieradius * 1.1 * Math.sin((start+((stop-start)/2)-90) * (Math.PI / 180))) + 's.5'
			}, speed/5, mina.easeinout);
		}
	});
}

function updateWhatDots(watch) {
	$('.buttonlabel').removeClass('active');
	$('.buttonlabel').animate({'opacity': '.25'}, 250).promise().done(function() {
		watch.buttonlabel2[what.mode-1].addClass('active');
		$(watch.buttonlabel2[what.mode-1].node).animate({'opacity': '1'}, 250);
	});
}