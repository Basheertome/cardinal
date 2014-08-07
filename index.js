$(document).ready(function(){

	if ('ontouchstart' in document.documentElement) {
		$('html').addClass('touch');
	}

	$('.watches').click(function(event) {
		$('.watches img:visible:last').fadeOut();
	});

});