/**
 * Blog Layouts
 */
(function($){
	"use strict";

	CHERRY_API.utilites.namespace('blog_layouts');
	CHERRY_API.blog_layouts = {
		init: function () {
			var self = this;
			if( CHERRY_API.status.document_ready ){
				self.render();
			}else{
				CHERRY_API.variable.$document.on('ready', self.render() );
			}
		},
		render: function () {
			var
				self = this
			,	page_url = window.location.href
			;
			self.grid_init();
			self.masonry_init();
			self.timeline_init();
			$('.taxonomy-filter > li').each(function(){
				if( $('a', this).attr('href') == page_url ){
					$('a', this).addClass('active');
				}
			})
		},
		grid_init: function(){
			var
				self = this
			,	$grid_layout = $('.grid-layout')
			,	$grid_layout_wrapper = $('.grid-layout .grid-wpapper')
			,	$grid_layout_list = $('.grid-layout .grid-layout-item')
			,	grid_columns = parseInt( $grid_layout.data('columns') )
			,	counter = 0
			,	resize_layout = self.resize_layout()
			,	resize_layout_tmp = ''
			;

			grid_layout_resize();
			CHERRY_API.variable.$window.on('resize.grid_layout_resize', grid_layout_resize );
			function grid_layout_resize(){
				var
					resize_layout_tmp = resize_layout
				,	counter = 0
				;

				resize_layout = self.resize_layout()

				if ( resize_layout !== resize_layout_tmp ) {
					resize_layout_tmp = resize_layout;
					switch ( resize_layout ) {
						case 'large':
							grid_columns = grid_columns;
							break
						case 'medium':
							grid_columns = grid_columns;
							break
						case 'small':
							grid_columns = 2;
							break
						case 'extra-small':
							grid_columns = 1;
							break
					}
					//$grid_layout_list.removeClass('clear-item').eq(grid_columns).addClass('clear-item');
					/*$grid_layout_list.each(function( index ){
						if( grid_columns == counter ){
							counter = 0;
							$(this).addClass('clear-item');
						}
						counter++;
					})*/
				};
			}
		},
		masonry_init: function(){
			var
				self = this
			,	$masonry_layout = $('.masonry-layout')
			;

			$masonry_layout.each(function(){
				var
					$this = $(this)
				,	$masonry_layout_wrapper = $('.masonry-wrapper', $this)
				,	$masonry_layout_list = $('.masonry-layout-item', $this)
				,	masonry_columns = parseInt( $this.data('columns') )
				,	masonry_gutter = parseInt( $this.data('gutter') )
				,	isotopeOptions = {
						itemSelector : '.masonry-layout-item',
						resizable: false,
						masonry: { columnWidth: Math.floor( $masonry_layout_wrapper.width() / masonry_columns ) }
					}
				;

				$masonry_layout_list.css({
					'width': Math.floor( $masonry_layout_wrapper.width() / masonry_columns ) - masonry_gutter
				,	'margin': Math.ceil( masonry_gutter / 2 )
				});
				$masonry_layout_wrapper.imagesLoaded( function() {
					$masonry_layout_wrapper.isotope( isotopeOptions )
				} )

				/*$masonry_layout_wrapper.css({
					'column-count': masonry_columns,
					'-webkit-column-count': masonry_columns,
					'-moz-column-count': masonry_columns,
					'-webkit-column-gap': masonry_gutter,
					'-moz-column-gap': masonry_gutter,
					'column-gap': masonry_gutter,
				});
				$masonry_layout_list.css({
					'margin-bottom' : masonry_gutter,
				});*/

				CHERRY_API.variable.$window.on('resize.masonry_layout_resize', masonry_layout_resize ).trigger('resize.masonry_layout_resize');
				function masonry_layout_resize( target ){
					var
						new_column = self.resize_column_layout( masonry_columns )
					,	new_width = Math.floor( $masonry_layout_wrapper.width() / new_column ) - masonry_gutter
					;

					$masonry_layout_list.css({
						'width': new_width
					});
					$masonry_layout_wrapper.isotope({
						masonry: { columnWidth: new_width + masonry_gutter }
					});
					/*$masonry_layout_wrapper.css({
						'column-count': new_column,
						'-webkit-column-count': new_column,
						'-moz-column-count': new_column,
					})*/
				}
			})
		},
		timeline_init: function(){
			var
				self = this
			,	$timeline_layout_wrapper = $('.timeline-layout')
			;

			$timeline_layout_wrapper.each(function(){
				var
					$this = $(this)
				,	$timeline_layout_list = $('.timeline-layout-item', $this)
				,	$timeline_item_width = parseInt( $this.data('timeline-item-width') )
				;

				$timeline_layout_list.css({
					'width' : $timeline_item_width + '%',
				});

				$timeline_layout_list.each(function(){
					if( $(this).hasClass('odd') ){
						$('.arrow', this).css({ 'left': $timeline_item_width + '%' });
					}else{
						$('.arrow', this).css({ 'right': $timeline_item_width + '%' });
					}
				})
			})
		},
		resize_layout: function (){
			var
				window_width = CHERRY_API.variable.$window.width()
			,	width_layout = 'large'
			;

			if ( window_width >= 1200 ) { width_layout = 'large'; }
			if ( window_width < 1200 && window_width >= 992 ) { width_layout = 'medium'; }
			if ( window_width < 992 && window_width >= 768 ) { width_layout = 'small'; }
			if ( window_width < 768 ) { width_layout = 'extra-small'; }

			return width_layout;
		},
		resize_column_layout: function ( column ){
			var
				window_width = CHERRY_API.variable.$window.width()
			,	column_per_view
			,	width_layout = 'large'
			;

			if ( window_width >= 1200 ) { width_layout = 'large'; }
			if ( window_width < 1200 && window_width >= 992 ) { width_layout = 'medium'; }
			if ( window_width < 992 && window_width >= 768 ) { width_layout = 'small'; }
			if ( window_width < 768 ) { width_layout = 'extra-small'; }
			switch ( width_layout ) {
				case 'large':
					column_per_view = column;
					break
				case 'medium':
					column_per_view = Math.ceil( column / 2 );
					break
				case 'small':
					column_per_view = Math.ceil( column / 4 );
					break
				case 'extra-small':
					column_per_view = 1;
					break
			}

			return column_per_view;
		}
	}
	CHERRY_API.blog_layouts.init();
}(jQuery));
