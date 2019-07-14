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

	$('#top').on('click', function(e) {
		return;
	});

	$('#middle').on('click', function() {
		switch (watch.mode) {
			case 1:
				when.button(watch);
				break;
			case 2:
				what.button(watch);
				break;
			case 3:
				where.button(watch);
				break;
		}
	});

}

function touchListeners(watch) {
	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
		$('html').bind('click', function(e) {
			DeviceOrientationEvent.requestPermission();
			$('html').unbind('click');
		});

		var tap = new Hammer($('.screen')[0]);

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

		tap.get('rotate').set({enable: true});

		tap.on('rotatestart rotateend rotate', function(event) {
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

		tap.on('swipeleft', function(event) {
			var new_mode = watch.mode - 1;
			if (new_mode<1) {new_mode = 3};

			switch (new_mode) {
				case 1:
					when.button(watch);
					break;
				case 2:
					what.button(watch);
					break;
				case 3:
					where.button(watch);
					break;
			}
		});

		tap.on('swiperight', function(event) {
			var new_mode = watch.mode + 1;
			if (new_mode>3) {new_mode = 1};

			switch (new_mode) {
				case 1:
					when.button(watch);
					break;
				case 2:
					what.button(watch);
					break;
				case 3:
					where.button(watch);
					break;
			}
		});

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

	window.addEventListener('touchmove', function(e) {
		e.preventDefault();
	},{passive: false});
}