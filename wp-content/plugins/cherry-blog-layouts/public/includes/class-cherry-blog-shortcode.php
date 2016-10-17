<?php
/**
 * Cherry Blog Shortcode.
 *
 * @package   Cherry_Blog_Layouts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for Blog shortcode.
 *
 * @since 1.0.0
 */
if ( ! class_exists( 'Cherry_Blog_Layout_Shortcode' ) ) {

	class Cherry_Blog_Layout_Shortcode {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Shortcode name.
		 *
		 * @since 1.0.0
		 * @var   string
		 */
		public $name = 'blog';

		function __construct() {

			// Register shortcode on 'init'.
			add_action( 'init', array( $this, 'register_shortcode' ) );

			// Add shortcode to editor
			add_filter( 'cherry_shortcodes/data/shortcodes', array( $this, 'add_to_editor' ) );

		}

		/**
		 * Registers the [$this->name] shortcode.
		 *
		 * @since 1.0.0
		 */
		public function register_shortcode() {

			/**
			 * Filters a shortcode name.
			 *
			 * @since 1.0.0
			 * @param string $this->name Shortcode name.
			 */
			$tag = apply_filters( $this->name . '_shortcode_name', $this->name );

			add_shortcode( $tag, array( $this, 'do_shortcode' ) );
		}

		/**
		 * Add blog layout shortcode to Cherry Shortcodes editor
		 *
		 * @since  1.0.0
		 * @param  array  $shortcodes  already added shortcodes
		 * @return array
		 */
		public function add_to_editor( $shortcodes ) {
			$terms_list = array();

			if ( did_action( 'wp_ajax_cherry_shortcodes_generator_settings' ) ) {
				$terms = get_terms( 'category' );

				if ( ! is_wp_error( $terms ) ) {
					$terms_list = wp_list_pluck( $terms, 'name', 'slug' );
				}
			}

			$shortcodes[ $this->name ] = apply_filters( 'cherry_blog_layout_shortcode_settings',
				array(
					'name'  => __( 'Blog Layout', 'cherry-blog-layouts' ), // Shortcode name.
					'desc'  => __( 'Cherry blog layout shortcode', 'cherry-blog-layouts' ),
					'type'  => 'single', // Can be 'wrap' or 'single'. Example: [b]this is wrapped[/b], [this_is_single]
					'group' => 'content', // Can be 'content', 'box', 'media' or 'other'. Groups can be mixed
					'atts'  => array( // List of shortcode params (attributes).
						'posts_per_page' => array(
							'type'    => 'slider',
							'min'     => -1,
							'max'     => 100,
							'step'    => 1,
							'default' => 3,
							'name'    => __( 'Limit', 'cherry-blog-layouts' ),
							'desc'    => __( 'Maximum number of posts.', 'cherry-blog-layouts' )
						),
						'order' => array(
							'type' => 'select',
							'values' => array(
								'desc' => __( 'Descending', 'cherry-blog-layouts' ),
								'asc'  => __( 'Ascending', 'cherry-blog-layout' )
							),
							'default' => 'DESC',
							'name' => __( 'Order', 'cherry-blog-layouts' ),
							'desc' => __( 'Posts order', 'cherry-blog-layouts' )
						),
						'orderby' => array(
							'type' => 'select',
							'values' => array(
								'none'          => __( 'None', 'cherry-blog-layouts' ),
								'id'            => __( 'Post ID', 'cherry-blog-layouts' ),
								'author'        => __( 'Post author', 'cherry-blog-layouts' ),
								'title'         => __( 'Post title', 'cherry-blog-layouts' ),
								'name'          => __( 'Post slug', 'cherry-blog-layouts' ),
								'date'          => __( 'Date', 'cherry-blog-layouts' ),
								'modified'      => __( 'Last modified date', 'cherry-blog-layouts' ),
								'rand'          => __( 'Random', 'cherry-blog-layouts' ),
								'comment_count' => __( 'Comments number', 'cherry-blog-layouts' ),
							),
							'default' => 'date',
							'name'    => __( 'Order by', 'cherry-blog-layouts' ),
							'desc'    => __( 'Order posts by', 'cherry-blog-layouts' )
						),
						'category' => array(
							'type'     => 'select',
							'multiple' => true,
							'values'   => $terms_list,
							'default'  => '',
							'name'     => __( 'Category', 'cherry-blog-layouts' ),
							'desc'     => __( 'Select categories to show posts from', 'cherry-blog-layouts' ),
						),
						'paged' => array(
							'type'    => 'bool',
							'default' => 'no',
							'name'    => __( 'Show pages', 'cherry-blog-layouts' ),
							'desc'    => __( 'Show page navigation or not', 'cherry-blog-layouts' ),
						),
						'layout_type' => array(
							'type' => 'select',
							'values' => array(
								'grid'     => __( 'Grid', 'cherry-blog-layouts' ),
								'masonry'  => __( 'Masonry', 'cherry-blog-layouts' ),
								'timeline' => __( 'Timeline', 'cherry-blog-layouts' )
							),
							'default' => 'date',
							'name'    => __( 'Layout', 'cherry-blog-layouts' ),
							'desc'    => __( 'Select output layout format', 'cherry-blog-layouts' )
						),
						'filter_type' => array(
							'type' => 'select',
							'values' => array(
								'none'        => __( 'None', 'cherry-blog-layouts' ),
								'categories'  => __( 'Categories', 'cherry-blog-layouts' ),
								'tags'        => __( 'Tags', 'cherry-blog-layouts' )
							),
							'default' => 'categories',
							'name'    => __( 'Filter type', 'cherry-blog-layouts' ),
							'desc'    => __( 'Select blog filter type', 'cherry-blog-layouts' )
						),
						'grid_column' => array(
							'type' => 'select',
							'values' => array(
								'grid-2'        => __( 'Grid 2', 'cherry-blog-layouts' ),
								'grid-3'        => __( 'Grid 3', 'cherry-blog-layouts' ),
								'grid-4'        => __( 'Grid 4', 'cherry-blog-layouts' ),
								'grid-6'        => __( 'Grid 6', 'cherry-blog-layouts' ),
							),
							'default' => 'grid-4',
							'name'    => __( 'Grid columns', 'cherry-blog-layouts' ),
							'desc'    => __( 'Select grid layout pattern for pages with custom blog layout', 'cherry-blog-layouts' )
						),
						'columns' => array(
							'type'    => 'slider',
							'min'     => 2,
							'max'     => 10,
							'step'    => 1,
							'default' => 3,
							'name'    => __( 'Masonry columns number', 'cherry-blog-layouts' ),
							'desc'    => __( 'Specify custom masonry layout columns number', 'cherry-blog-layouts' )
						),
						'columns_gutter' => array(
							'type'    => 'slider',
							'min'     => 0,
							'max'     => 100,
							'step'    => 1,
							'default' => 10,
							'name'    => __( 'Masonry columns gutter', 'cherry-blog-layouts' ),
							'desc'    => __( 'Specify custom masonry layout columns gutter(px)', 'cherry-blog-layouts' )
						),
						'timeline_item_width' => array(
							'type'    => 'slider',
							'min'     => 0,
							'max'     => 50,
							'step'    => 1,
							'default' => 48,
							'name'    => __( 'Timeline item width', 'cherry-blog-layouts' ),
							'desc'    => __( 'Specify custom item width for Timeline blog layout(%)', 'cherry-blog-layouts' )
						),
						'use_timeline_breakpoint' => array(
							'type'    => 'bool',
							'default' => 'yes',
							'name'    => __( 'Enable timeline breakpoints', 'cherry-blog-layouts' ),
							'desc'    => __( 'Enable/disable timeline breakpoints', 'cherry-blog-layouts' ),
						),
						'timeline_breakpoint' => array(
							'type' => 'select',
							'values' => array(
								'year'		=> __( 'Year', 'cherry-blog-layouts' ),
								'month'		=> __( 'Month', 'cherry-blog-layouts' ),
								'day'		=> __( 'Day', 'cherry-blog-layouts' )
							),
							'default' => 'month',
							'name'    => __( 'Timeline breakpoint', 'cherry-blog-layouts' ),
							'desc'    => __( 'Select timeline breakpoint type', 'cherry-blog-layouts' )
						),
						'timeline_breakpoint_date_format'   => array(
							'default' => 'F j, Y',
							'name'    => __( 'Timeline breakpoint date format', 'cherry-blog-layouts' ),
							'desc'    => __( 'Specify date format', 'cherry-blog-layouts' )
						),
						'show_marker_date' => array(
							'type'    => 'bool',
							'default' => 'no',
							'name'    => __( "Enable marker's date label", 'cherry-blog-layouts' ),
							'desc'    => __( "Enable/disable marker's date label", 'cherry-blog-layouts' ),
						),
						'timeline_marker_date_format'   => array(
							'default' => 'F j, Y',
							'name'    => __( 'Timeline marker date format', 'cherry-blog-layouts' ),
							'desc'    => __( 'Specify date format', 'cherry-blog-layouts' )
						),
						'pagination_previous_label'   => array(
							'default' => 'Prev',
							'name'    => __( 'Prev button label', 'cherry-blog-layouts' ),
							'desc'    => __( 'Previous button label text. Text or HTML can be used.', 'cherry-blog-layouts' )
						),
						'pagination_next_label'   => array(
							'default' => 'Next',
							'name'    => __( 'Next button label', 'cherry-blog-layouts' ),
							'desc'    => __( 'Next button label text. Text or HTML can be used.', 'cherry-blog-layouts' )
						),
						'class'   => array(
							'default' => '',
							'name'    => __( 'Class', 'cherry-blog-layouts' ),
							'desc'    => __( 'Extra CSS class', 'cherry-blog-layouts' )
						),
					),
					'icon'     => 'th', // Custom icon (font-awesome).
					'function' => array( $this, 'do_shortcode' ) // Name of shortcode function.
				)
			);

			return $shortcodes;
		}

		/*
		public static function get_blog_template(){
				$template_list = array();

				$theme_path = get_stylesheet_directory() . '/blog-layouts/tmpl/';

				if ( file_exists( $theme_path ) && is_dir( $theme_path ) ) {
					$template_list = scandir( $theme_path );
					$template_list = array_diff( $template_list, array( '.', '..', 'index.php' ) );
				}

				foreach ( $template_list as $key => $value) {
					$result_array[ str_replace( '.tmpl', '', $value ) ] = $value;
				}

				return $result_array;
			}
		 */
		/**
		 * Callback function for blog shortcode
		 *
		 * @since  1.0.0
		 * @param  array  $atts    shortcode attributes array
		 * @param  string $content shortcode inner content
		 * @return string
		 */
		public function do_shortcode( $atts, $content = null ) {

			// Set up the default arguments.
			$defaults = array(
				'posts_per_page'					=> 3,
				'orderby'							=> 'date',
				'order'								=> 'DESC',
				'category'							=> '',
				'paged'								=> 'yes',
				'layout_type'						=> 'masonry',
				'template_type'						=> '',
				'filter_type'						=> 'categories',
				'grid_column'						=> 'grid-4',
				'columns'							=> 3,
				'columns_gutter'					=> 10,
				'timeline_item_width'				=> 48,
				'use_timeline_breakpoint'			=> 'yes',
				'timeline_breakpoint'				=> 'month',
				'timeline_breakpoint_date_format'	=> 'F j, Y',
				'show_marker_date'					=> 'no',
				'pagination_previous_label'			=> 'Prev',
				'pagination_next_label'				=> 'Next',
				'timeline_marker_date_format'		=> 'F j, Y',
				'class'								=> '',
			);

			/**
			 * Parse the arguments.
			 *
			 * @link http://codex.wordpress.org/Function_Reference/shortcode_atts
			 */

			$atts = shortcode_atts( $defaults, $atts, $this->name );

			$atts['use_timeline_breakpoint'] = ( bool ) ( $atts['use_timeline_breakpoint'] === 'yes' ) ? 'true' : 'false';
			$atts['show_marker_date'] = ( bool ) ( $atts['show_marker_date'] === 'yes' ) ? 'true' : 'false';
			$atts['paged'] = ( bool ) ( $atts['paged'] === 'yes' ) ? 'true' : 'false';

			Cherry_Blog_Layouts::enqueue_scripts();

			$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options( $atts );

			$query_args = array();
			$query_args['posts_per_page']   = $parsed_options['posts_per_page'];
			$query_args['orderby']          = $parsed_options['orderby'];
			$query_args['order']            = $parsed_options['order'];
			$query_args['suppress_filters'] = false;

			if ( ! empty( $atts['category'] ) ) {
				$cat = str_replace( ' ', ',', $atts['category'] );
				$cat = explode( ',', $cat );
				if ( is_array( $cat ) ) {
					$query_args['tax_query'] = array(
						array(
							'taxonomy' => 'category',
							'field'    => 'slug',
							'terms'    => $cat
						)
					);
				}
			} else {
				$query_args['tax_query'] = false;
			}

			if ( $atts['paged'] ) {
				if ( get_query_var('paged') ) {
					$query_args['paged'] = get_query_var('paged');
				} elseif ( get_query_var('page') ) {
					$query_args['paged'] = get_query_var('page');
				} else {
					$query_args['paged'] = 1;
				}
			}

			$posts_query = new WP_Query( $query_args );

			Cherry_Blog_Layouts_Data::setup_main_query( $posts_query );

			$args = array(
				'prev_text'	=> ( isset( $parsed_options['pagination_previous_label'] ) ) ? $parsed_options['pagination_previous_label'] : '&laquo;',
				'next_text'	=> ( isset( $parsed_options['pagination_next_label'] ) ) ? $parsed_options['pagination_next_label'] : '&raquo;',
			);

			$pagination_html = get_the_posts_pagination( $args );

			if ( ! $posts_query->have_posts() ) {
				return __( 'No posts found', 'cherry-blog-layouts' );
			}

			$allowed_layouts = array( 'grid', 'masonry', 'timeline' );
			$layout = ( in_array( $parsed_options['layout_type'], $allowed_layouts ) ) ? $parsed_options['layout_type'] : 'grid';

			ob_start();

			$post_counter = 0;
			$index_counter = 1;
			$break_point_date = '';

			while ( $posts_query->have_posts() ) {
				$posts_query->the_post();
				$template_file = Cherry_Blog_Template_Loader::get_template( 'layout-' . $layout, 'content' );
				include $template_file;
			}
			$posts = ob_get_clean();
			Cherry_Blog_Layouts_Data::reset_main_query();

			switch ( $layout ) {
				case 'grid':
					switch ( $parsed_options['grid_column'] ) {
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
					$attrs = 'data-columns="' . $columns . '"';

					$html = sprintf( '<div class="%2$s-layout %6$s" %3$s>%4$s<div class="grid-wrapper">%1$s<div class="clear"></div></div>%5$s</div>', $posts, $layout, $attrs, Cherry_Blog_Layouts_Data::filter_render( $parsed_options['filter_type'] ), $pagination_html, $parsed_options['class'] );
					break;
				case 'masonry':
					$attrs = 'data-columns="' . $parsed_options['columns'] . '"';
					$attrs .= 'data-gutter="' . $parsed_options['columns_gutter'] . '"';
					$html = sprintf( '<div class="%2$s-layout %6$s" %3$s>%4$s<div class="masonry-wrapper">%1$s<div class="clear"></div></div>%5$s</div>', $posts, $layout, $attrs, Cherry_Blog_Layouts_Data::filter_render( $parsed_options['filter_type'] ), $pagination_html, $parsed_options['class'] );
					break;
				case 'timeline':
					$attrs = 'data-timeline-item-width="' . $parsed_options['timeline_item_width'] . '"';
					$html = sprintf( '<div class="%2$s-layout %6$s" %3$s>%4$s<div class="timeline-wrapper"><span class="timeline-line"></span>%1$s<div class="clear"></div></div>%5$s</div>', $posts, $layout, $attrs, Cherry_Blog_Layouts_Data::filter_render( $parsed_options['filter_type'] ), $pagination_html, $parsed_options['class'] );
					break;
			}

			/**
			* Filters $html before return.
			*
			* @since 1.0.0
			* @param string $html
			* @param array  $atts
			* @param string $shortcode
			*/
			$html = apply_filters( 'cherry_shortcodes_output', $html, $atts, 'blog' );

			return $html;
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

	Cherry_Blog_Layout_Shortcode::get_instance();
}

/*add_filter('cherry_blog_layout_shortcode_settings', 'blog_layout_shortcode_settings');

function blog_layout_shortcode_settings( $settings ){
	$settings['atts']['template_type'] = array(
		'type'     => 'select',
		'values'   => array(
			'default'  => __( 'Default', 'cherry-blog-layouts' ),
			'type-1'  => __( 'Type 1', 'cherry-blog-layouts' ),
			'type-2'  => __( 'Type 2', 'cherry-blog-layouts' ),
			'type-3'  => __( 'Type 3', 'cherry-blog-layouts' )
		),
		'default'  => '',
		'name'     => __( 'Template', 'cherry-blog-layouts' ),
		'desc'     => __( 'Select template to show posts from', 'cherry-blog-layouts' ),
	);
	return $settings;
}*/
/*add_filter('cherry_blog_layout_options_list', 'blog_layout_options_list');

function blog_layout_options_list( $settings ){
	$settings['blog-layout-template-type'] = array(
		'type'			=> 'select',
		'title'			=> __('Template type', 'cherry'),
		'label'			=> '',
		'description'	=> __('Select template type for blog posts', 'cherry'),
		'value'			=> 'default',
		'class'			=> '',
		'options'		=> array(
			'default'	=> __( 'Default', 'cherry-blog-layouts' ),
			'type-1'	=> __( 'Type 1', 'cherry-blog-layouts' ),
			'type-2'	=> __( 'Type 2', 'cherry-blog-layouts' ),
		)
	);
	return $settings;
}*/
