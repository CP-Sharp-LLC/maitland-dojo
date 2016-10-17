(function($) {

	$(function(){

		if ( $.isFunction( jQuery.fn.masonry ) ) {
			var $container = $('.cherry-grid.type-masonry .cherry-grid_list');
			$container.masonry( $container.data( 'masonry-atts' ) );
		}

	});

})(jQuery);