<?php
/**
 * Cherry Blog Layouts data
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

if ( ! class_exists( 'Cherry_Blog_Layouts_Data' ) ) {

	class Cherry_Blog_Layouts_Data {

		/**
		 * Holder for the main query object, while team query processing
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $temp_query = null;

		public static $default_options = array();

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		function __construct() {}

		public static function get_parsed_options( $options = '' ){
			if( empty( self::$default_options ) ){
				self::$default_options = array(
					'enabled'							=> Cherry_Blog_Layouts::get_option( 'blog-layout-enabled', 'false' ),
					'layout_type'						=> Cherry_Blog_Layouts::get_option( 'blog-layout-type', 'masonry' ),
					'filter_type'						=> Cherry_Blog_Layouts::get_option( 'blog-layout-filter', 'categories' ),
					'pages'								=> Cherry_Blog_Layouts::get_option( 'blog-layout-pages', array('is_home', 'is_post_type_archive', 'is_category', 'is_tag', 'is_author', 'is_date') ),
					'grid_column'						=> Cherry_Blog_Layouts::get_option( 'blog-layout-grid-column', 'grid-4' ),
					'columns'							=> Cherry_Blog_Layouts::get_option( 'blog-layout-columns', 3 ),
					'columns_gutter'					=> Cherry_Blog_Layouts::get_option( 'blog-layout-columns-gutter', 10 ),
					'timeline_item_width'				=> Cherry_Blog_Layouts::get_option( 'blog-layout-timeline-item-width', 45 ),
					'use_timeline_breakpoint'			=> Cherry_Blog_Layouts::get_option( 'blog-layout-use-timeline-breakpoint', 'true' ),
					'timeline_breakpoint'				=> Cherry_Blog_Layouts::get_option( 'blog-layout-timeline-breakpoint', 'month' ),
					'timeline_breakpoint_date_format'	=> Cherry_Blog_Layouts::get_option( 'blog-layout-timeline-breakpoint-date-format', 'F j, Y' ),
					'show_marker_date'					=> Cherry_Blog_Layouts::get_option( 'blog-layout-show-marker-date', 'false' ),
					'timeline_marker_date_format'		=> Cherry_Blog_Layouts::get_option( 'blog-layout-timeline-marker-date-format', 'F j, Y' ),
					'content_grid_type'					=> Cherry_Blog_Layouts::get_option( 'blog-layout-grid-type', 'inherit' ),
					'sidebar_position'					=> Cherry_Blog_Layouts::get_option( 'blog-layout-sidebar-position', 'inherit' ),
					'pagination_previous_label'			=> Cherry_Blog_Layouts::get_option( 'pagination-previous-page', '&laquo;' ),
					'pagination_next_label'				=> Cherry_Blog_Layouts::get_option( 'pagination-next-page', '&raquo;' ),
					'posts_per_page'					=> 9,
					'orderby'							=> 'date',
					'order'								=> 'DESC',
					'category'							=> '',
					'paged'								=> 'true',
					'template_type'						=> Cherry_Blog_Layouts::get_option( 'blog-layout-template-type', 'default' ),
					'class'								=> '',
				);
			}

			$options = wp_parse_args( $options, self::$default_options );
			if( is_array( $options ) && !empty( $options ) ){
				return $options;
			}
		}

		public static function filter_render( $filter_type = 'categories', $custom_class = '' ) {
			$html = '';

			switch ( $filter_type ) {
				case 'none':
					$terms = null;
					break;
				case 'categories':
					$terms = get_categories();
					break;
				case 'tags':
					$terms = get_tags();
					break;
			}
			if( isset( $terms ) ){
				$html .= '<ul class="taxonomy-filter ' . $custom_class . '">';
					if( get_option( 'show_on_front' ) == 'page' ){
						$all_terms = get_permalink( get_option('page_for_posts') );
					}else{
						$all_terms =get_bloginfo('url', 'display');
					}
					$html .= '<li><a href="' . $all_terms . '/">' . apply_filters( 'cherry_blog_layout_all_terms_text', __('All', 'cherry-blog') ) .'</a></li>';
						foreach( $terms as $term ){
							switch ( $filter_type ) {
								case 'categories':
									$term_permalink = get_category_link( $term->term_taxonomy_id );
									break;
								case 'tags':
									$term_permalink = get_tag_link( $term->term_taxonomy_id );
									break;
							}
							$html .= '<li><a href="' . $term_permalink . '">' . $term->name . '</a></li>';
						}
				$html .= '</ul>';
			}

			return $html;
		}

		public static function setup_main_query( $posts_query = null ){
			global $wp_query;

			self::$temp_query = $wp_query;
			$wp_query = NULL;
			$wp_query = $posts_query;
		}

		public static function reset_main_query(){
			global $wp_query;

			$wp_query = NULL;
			$wp_query = self::$temp_query;
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

	Cherry_Blog_Layouts_Data::get_instance();
}