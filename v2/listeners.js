function buttonListeners(watch) {

	$('.button').on('mouseenter', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't3'}, 50);
	});
	$('.button').on('mouseleave', function(){
		Snap($(this).find('.core')[0]).animate({transform: 't0'}, 50);
	});
	$('.button').on('mousedown touchstart', function(){
		Snap($(this).find('.core')[0])
			.animate({transform: 't-4'}, 50)
			.toggleClass('touched');
	});
	$('.button').on('mouseup touchend', function(){
		Snap($(this).find('.core')[0])
			.animate({transform: 't3'}, 50)
			.toggleClass('touched');
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

function touchListeners(watch) {
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');

		var tap = new Hammer($('.screen')[0]);
		var rotate = [
			new Hammer($('.strap')[0]),
			new Hammer($('.ring')[0]),
			new Hammer($('.ring')[1])
		];

		var singleTap = new Hammer.Tap({ event: 'tap' });
		var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });

		tap.add([doubleTap, singleTap]);
		doubleTap.recognizeWith(singleTap);
		singleTap.requireFailure(doubleTap);

		tap.on('tap', function(event) {
		    switch (watch.mode) {
		    	case 1:
		    		when.tap(watch, event);
		    		break;
		    	case 2:
		    		what.tap(watch, event);
		    		break;
		    	case 3:
		    		where.tap(watch, event);
		    		break;
		    }
		});

		tap.on('doubletap', function(event) {
			switch (watch.mode) {
				case 1:
					when.doubletap(watch, event);
					break;
				case 2:
					what.doubletap(watch, event);
					break;
				case 3:
					where.doubletap(watch, event);
					break;
			}
		});

		for (var i=0; i<rotate.length; i++) {
			rotate[i].get('rotate').set({enable: true});

			rotate[i].on('rotatestart rotateend rotate', function(event) {
			    switch (watch.mode) {
			    	case 1:
			    		when.rotate(watch, event);
			    		break;
			    	case 2:
			    		what.rotate(watch, event);
			    		break;
			    	case 3:
			    		where.rotate(watch, event);
			    		break;
			    }
			});
		}
	} else {
		clicks = 0, timer = null;
	    $('.screen').on('click', function(e){
			clicks++;
			if(clicks === 1) {
				timer = setTimeout(function() {
					switch (watch.mode) {
						case 1:
							when.tap(watch);
							break;
						case 2:
							what.tap(watch);
							break;
						case 3:
							where.tap(watch);
							break;
					}
					clicks = 0;
				}, 300);
			} else {
				clearTimeout(timer);
				switch (watch.mode) {
					case 1:
						when.doubletap(watch);
						break;
					case 2:
						what.doubletap(watch);
						break;
					case 3:
						where.doubletap(watch);
						break;
				}
				clicks = 0;
			}
		}).on('dblclick', function(e){
			e.preventDefault();
		});
	}

	FastClick.attach(document.body);

	$(window).bind('touchmove', function(e) {
		e.preventDefault();
	});
}