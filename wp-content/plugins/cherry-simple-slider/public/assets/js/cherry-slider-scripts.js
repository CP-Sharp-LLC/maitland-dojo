/**
 * Switcher
 */
(function( $ ) {
	'use strict';

	$.simpleSlider = $.simpleSlider || {};

	$.simpleSlider.init = function( target ) {
		$('.slider-container').each(
			function(){
				var
					slider = $(this)
				,	sliderId = slider.data('id')
				,	sliderWidth = slider.data('width')
				,	sliderHeight = slider.data('height')
				,	slider992Height = slider.data('992-breakpoint-height')
				,	slider768Height = slider.data('768-breakpoint-height')
				,	sliderVisibleSize = slider.data('visible-size')
				,	sliderForceSize = slider.data('force-size')
				,	sliderOrientation = slider.data('orientation')
				,	slideDistance = slider.data('slide-distance')
				,	slideDuration = slider.data('slide-duration')
				,	sliderFade = slider.data('slide-fade')
				,	sliderNavigation = slider.data('navigation')
				,	sliderFadeNavigation = slider.data('fade-navigation')
				,	sliderPagination = slider.data('pagination')
				,	sliderAutoplay = slider.data('autoplay')
				,	sliderFullScreen = slider.data('fullscreen')
				,	sliderShuffle = slider.data('shuffle')
				,	sliderLoop = slider.data('loop')
				,	sliderThumbnailsArrows = slider.data('thumbnails-arrows')
				,	sliderThumbnailsPosition = slider.data('thumbnails-position')
				,	sliderThumbnailsWidth = slider.data('thumbnails-width')
				,	sliderThumbnailsHeight = slider.data('thumbnails-height')
				,	sliderReachVideoAction = slider.data('reach-video-action')
				;

				if( $('.sp-slide', '#'+sliderId ).length > 0 ){
					$( '#'+sliderId ).sliderPro({
						width: sliderWidth,
						height: sliderHeight,
						visibleSize: sliderVisibleSize,
						forceSize: sliderForceSize,
						orientation: sliderOrientation,
						slideDistance: slideDistance,
						slideAnimationDuration: slideDuration,
						fade: sliderFade,
						arrows: sliderNavigation,
						fadeArrows: sliderFadeNavigation,
						buttons: sliderPagination,
						autoplay: sliderAutoplay,
						fullScreen: sliderFullScreen,
						shuffle: sliderShuffle,
						loop: sliderLoop,
						waitForLayers: true,
						thumbnailArrows: sliderThumbnailsArrows,
						thumbnailsPosition: sliderThumbnailsPosition,
						thumbnailWidth: sliderThumbnailsWidth,
						thumbnailHeight: sliderThumbnailsHeight,
						reachVideoAction: sliderReachVideoAction,
						init: function(){
							$( this ).resize();
							slider.fadeTo(500, 1);
						},
						breakpoints: {
							992: {
								height: slider992Height
							},
							768: {
								height: slider768Height
							}
						}
					});
				}
			}
		)//each end
	}

	$(document).ready(function() {
		$.simpleSlider.init();
	})
})( jQuery );