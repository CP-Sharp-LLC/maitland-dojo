/**
 * Flat_scripts
 */
(function($){
	"use strict";

	CHERRY_API.utilites.namespace('theme_scripts');
	CHERRY_API.theme_scripts = {
		init: function () {
			var self = this;
			if( CHERRY_API.status.document_ready ){
				self.render();
			}else{
				CHERRY_API.variable.$document.on('ready', self.render() );
			}
		},
		render: function () {
			this.flat_skin();
		},
		flat_skin: function () {
			var row = jQuery('.entry-content > .row');
			row.first().addClass('first'); // Add first row class
			row.last().addClass('last'); // Add last row class

			row.each(function() {
				var _this = jQuery(this),
					prevRow = _this.prev(),
					nextRow = _this.next(),
					parallaxThis = _this.find('.parallax-svg'),
					parallaxPrev = prevRow.find('.parallax-svg'),
					parallaxNext = nextRow.find('.parallax-svg'),
					boxThis = _this.find('.row-svg'),
					boxPrev = prevRow.find('.row-svg'),
					boxNext = nextRow.find('.row-svg');

				if (parallaxThis[0] || boxThis[0]) {
					var boxPreset = '',
						boxPresetPrev = '', 
						boxPresetNext = '';

					if (boxPrev[0]) { // If box prev, then add class to top polygon
						var boxPresetPrev = boxPrev.find('> .inner').attr('class').replace('inner','');
						_this.find('.top .depend').attr('class', 'triangle depend ' + boxPresetPrev);
					}
					if (boxNext[0]) { // If box next, then add class to bottom polygon
						var boxPresetNext = boxNext.find('> .inner').attr('class').replace('inner','');
						_this.find('.bottom .depend').attr('class', 'triangle depend ' + boxPresetNext);
					}

					if (boxThis[0]) { // Is this box block
						if (parallaxPrev[0]) { // If parallax prev, then hide top masks
							_this.find('.masks .top').attr('class','svgmask top hide');
						}
						if (parallaxNext[0]) { // If parallax next, then hide bottom masks
							_this.find('.masks .bottom').attr('class','svgmask bottom hide');
						}
					}
				}
			});
		}			
	}
	CHERRY_API.theme_scripts.init();

	// MotoSlider svg masks loads after window is loaded
	jQuery(window).load(function(){
		var motoSlider = jQuery('.motoslider_wrapper');
		if(motoSlider[0]) {
			var masksOdd = '<div class="masks">'
					+ '<svg preserveAspectRatio="none" viewBox="0 0 100 100" height="120" class="svgmask top" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
						+ '<polygon points="0,0 70,0 0,100 " opacity="0.88" fill="#fbb44c" class="triangle "/>'
					+ '</svg>'
					+ '<svg preserveAspectRatio="none" viewBox="0 0 100 100" height="390" class="svgmask bottom" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
						+ '<polygon points="0,46 0,100 35,100 " opacity="0.8" fill="#3a98d8" class="triangle"/>'
						+ '<polygon points="100,100 35,100 100,38 " opacity="0.2" fill="#000000" class="triangle "/>'
						+ '<polygon points="100,0 100,38 93,45" opacity="1" fill="#fc797a" class="triangle "/>'
					+ '</svg>'
				+ '</div>'
				, masksEven = '<div class="masks">'
					+ '<svg preserveAspectRatio="none" viewBox="0 0 100 100" height="690" class="svgmask top" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
						+ '<polygon points="0,0 11,0 0,100 " opacity="0.95" fill="#fbb44c" class="triangle "/>'
					+ '</svg>'
					+ '<svg preserveAspectRatio="none" viewBox="0 0 100 100" height="450" class="svgmask bottom" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
						+ '<polygon points="100,0 100,100 85,100 " opacity="0.95" fill="#3a98d8" class="triangle "/>'
						+ '<polygon points="100,70 30,100 100,100  " opacity="0.95" fill="#fc797a" class="triangle"/>'
					+ '</svg>'
				+ '</div>';

			motoSlider.each(function(){
				var _this_slider = jQuery(this), // sliders on page
					_this_slides = _this_slider.find('.ms_slide'); // slides in slider

				_this_slides.each(function(){
					var _this_slide = jQuery(this), // slide in slides
						_this_slide_number = _this_slide.attr('data-current-index');

					if (_this_slide_number % 2) {
						_this_slide.append(masksEven);
					} else {
						_this_slide.append(masksOdd);
					}
				})
				
			});
		}
	})
}(jQuery));