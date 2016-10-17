<?php
/**
 * Cherry Blog Layouts additional template hooks and service function
 *
 * @package   Cherry_Blog_Layouts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'Cherry_Blog_Layouts_Tools' ) ) {

	class Cherry_Blog_Layouts_Tools {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		function __construct() {
			add_filter( 'cherry_blog_layout_wrapper_class', array( $this, 'wrapper_classes' ), 10, 2 );
			add_filter( 'cherry_get_page_layout', array( $this, 'rewrite_layout' ) );
			add_filter( 'cherry_get_page_grid_type', array( $this, 'rewrite_grid_type' ) );
		}

		/**
		 * Get item CSS class
		 *
		 * @since  1.0.0
		 * @param  array|string $classes passed user classes
		 */
		public static function item_class( $classes = array(), $grid = 'grid-3' ) {

			if ( ! is_array( $classes ) ) {
				$classes = array( $classes );
			}

			switch ( $grid ) {
				case 'grid-2':
					$columns = 2;
					$classes[] = 'col-lg-' . 6;
					$classes[] = 'col-md-' . 6;
					$classes[] = 'col-sm-' . 6;
					$classes[] = 'col-xs-' . 12;
					break;
				case 'grid-3':
					$columns = 3;
					$classes[] = 'col-lg-' . 4;
					$classes[] = 'col-md-' . 4;
					$classes[] = 'col-sm-' . 6;
					$classes[] = 'col-xs-' . 12;
					break;
				case 'grid-4':
					$columns = 4;
					$classes[] = 'col-lg-' . 3;
					$classes[] = 'col-md-' . 3;
					$classes[] = 'col-sm-' . 6;
					$classes[] = 'col-xs-' . 12;
					break;
				case 'grid-6':
					$columns = 6;
					$classes[] = 'col-lg-' . 2;
					$classes[] = 'col-md-' . 3;
					$classes[] = 'col-sm-' . 6;
					$classes[] = 'col-xs-' . 12;
					break;
			}

			$class = implode( ' ', array_filter( $classes ) );

			return $class;
		}


		/**
		 * Get additional wrapper classes
		 *
		 * @since 1.0.0
		 *
		 * @param string $class default CSS class
		 * @param string $type  layout type
		 */
		public function wrapper_classes( $class, $type ) {

			if ( 'timeline' !== $type ) {
				$columns  = Cherry_Blog_Layouts::get_option( 'blog-layout-columns', 3 );
				$class   .= ' columns-' . $columns;
			}

			return $class;
		}

		/**
		 * Get additional wrapper attrs
		 *
		 * @since 1.0.0
		 *
		 * @return string $attrs result inline attrs string
		 */
		public static function wrapper_attrs() {
			$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();

			$columns = $parsed_options['columns'];
			$timeline_item_width = $parsed_options['timeline_item_width'];
			$columns_gutter = $parsed_options['columns_gutter'];
			$layout_type = $parsed_options['layout_type'];
			$grid_columns = $parsed_options['grid_column'];

			$attrs = '';
			switch ( $layout_type ) {
				case 'grid':
					switch ( $grid_columns ) {
						case 'grid-2':
							$columns = 2;
							break;
						case 'grid-3':
							$columns = 3;
							break;
						case 'grid-4':
							$columns = 4;
							break;
						case 'grid-6':
							$columns = 6;
							break;
					}
					$attrs .= 'data-columns="' . $columns . '"';
					break;
				case 'masonry':
					$attrs .= 'data-columns="' . $columns . '"';
					$attrs .= 'data-gutter="' . $columns_gutter . '"';
					break;
				case 'timeline':
					$attrs .= 'data-timeline-item-width="' . $timeline_item_width . '"';
					break;
			}
			return $attrs;
		}

		/**
		 * Rewrite page layout for pages with custom blog
		 *
		 * @since  1.0.0
		 *
		 * @param  string $layout default layout
		 * @return string         rewritten layout (if needed)
		 */
		public function rewrite_layout( $layout ) {

			if ( ! Cherry_Blog_Layouts::$is_custom_layout ) {
				return $layout;
			}

			$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();
			$custom_layout = $parsed_options['sidebar_position'];

			if ( ! $custom_layout || 'inherit' == $custom_layout ) {
				return $layout;
			}

			return $custom_layout;

		}

		/**
		 * Rewrite page grid type for custom blog pages
		 *
		 * @since  1.0.0
		 *
		 * @param  array  $grid_type  default page grid type
		 * @return array              rewritten grid type
		 */
		public function rewrite_grid_type( $grid_type ) {

			if ( ! Cherry_Blog_Layouts::$is_custom_layout ) {
				return $grid_type;
			}

			$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();

			$content_grid = $parsed_options['content_grid_type'];

			if ( ! $content_grid || 'inherit' == $content_grid ) {
				return $grid_type;
			}

			if ( ! is_array( $grid_type ) ) {
				return array( 'content' => $content_grid );
			}

			$grid_type['content'] = $content_grid;

			return $grid_type;

		}

		/**
		 * Returns the instance.
		 *
		 * @since  1.0.0
		 * @return object
		 */
		public static function get_instance() {

			// If the single instance hasn't been set, set it now.
			if ( null == self::$instance )
				self::$instance = new self;

			return self::$instance;

		}

	}

	Cherry_Blog_Layouts_Tools::get_instance();

}