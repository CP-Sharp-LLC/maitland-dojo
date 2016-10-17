<?php
/**
 * Cherry Blog Layouts options
 *
 * @package   Cherry_Blog_Layouts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

if ( ! class_exists( 'Cherry_Blog_Layout_Options' ) ) {

	class Cherry_Blog_Layout_Options {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		public function __construct() {

			add_filter( 'cherry_defaults_settings', array( $this, 'add_options') );

		}

		/**
		 * Add Blog Layout options
		 *
		 * @since  1.0.0
		 *
		 * @param  array $sections  default sections array
		 * @return array            filtered sections array
		 */
		public function add_options( $sections ) {

			$layout_options = array(
				'blog-layout-enabled' => array(
					'type'			=> 'switcher',
					'title'			=> __( 'Enable custom blog layout', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'    => 'text',
						'content' => __( 'Enable/disable custom blog layout', 'cherry-blog-layouts' )
					),
					'value'			=> 'false',
				),
				'blog-layout-type' => array(
					'type'			=> 'select',
					'title'			=> __( 'Filter type', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'		=> 'text',
						'content' => __( 'Select if you want to filter posts by tag or by category', 'cherry-blog-layouts' )
					),
					'value'			=> 'grid',
					'class'			=> 'width-full',
					'options'		=> array(
						'grid'     => __( 'Grid', 'cherry-blog-layouts' ),
						'masonry'  => __( 'Masonry', 'cherry-blog-layouts' ),
						'timeline' => __( 'Timeline', 'cherry-blog-layouts' )
					)
				),
				'blog-layout-filter' => array(
					'type'			=> 'select',
					'title'			=> __( 'Custom blog filter type', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'		=> 'text',
						'content'	=> __( 'Select blog filter type', 'cherry-blog-layouts' )
					),
					'value'			=> 'categories',
					'class'			=> 'width-full',
					'options'		=> array(
						'none'			=> __( 'None', 'cherry-blog-layouts' ),
						'categories'	=> __( 'Categories', 'cherry-blog-layouts' ),
						'tags'			=> __( 'Tags', 'cherry-blog-layouts' ),
					)
				),
				'blog-layout-pages' => array(
					'type'			=> 'checkbox',
					'title'			=> __( 'Use on pages', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=>  array(
						'type'		=> 'text',
						'content'	=> __('Please specify pages that will use custom blog layout.', 'cherry-blog-layouts'),
					),
					'class'			=> '',
					'value'			=> array(
						'is_home',
						'is_post_type_archive',
						'is_category',
						'is_tag',
						'is_author',
						'is_date'
					),
					'options'		=> array(
						'is_home'              => __( 'Blog page', 'cherry-blog-layouts' ),
						'is_post_type_archive' => __( 'Custom Post type archive', 'cherry-blog-layouts' ),
						'is_category'          => __( 'Blog category archive', 'cherry-blog-layouts' ),
						'is_tag'               => __( 'Blog tags archive', 'cherry-blog-layouts' ),
						'is_author'            => __( 'Author archive', 'cherry-blog-layouts' ),
						'is_date'              => __( 'Date archive', 'cherry-blog-layouts' )
					)
				),
				'blog-layout-grid-column' => array(
					'type'			=> 'radio',
					'title'			=> __( 'Grid columns', 'cherry' ),
					'description'	=> __( 'Select grid layout pattern for pages with custom blog layout', 'cherry' ),
					'value'			=> 'grid-4',
					'display_input'	=> false,
					'options'		=> array(
						'grid-2' => array(
							'label'   => __( 'Grid 2', 'cherry' ),
							'img_src' => CHERRY_BLOG_URI . '/public/assets/images/blog-layout-grid-2.svg',
						),
						'grid-3' => array(
							'label'   => __( 'Grid 3', 'cherry' ),
							'img_src' => CHERRY_BLOG_URI . '/public/assets/images/blog-layout-grid-3.svg',
						),
						'grid-4' => array(
							'label'   => __( 'Grid 4', 'cherry' ),
							'img_src' => CHERRY_BLOG_URI . '/public/assets/images/blog-layout-grid-4.svg',
						),
						'grid-6' => array(
							'label'   => __( 'Grid 6', 'cherry' ),
							'img_src' => CHERRY_BLOG_URI . '/public/assets/images/blog-layout-grid-6.svg',
						),
					),
				),
				'blog-layout-columns' => array(
					'type'			=> 'slider',
					'title'			=> __( 'Masonry columns number', 'cherry' ),
					'description'	=> __( 'Specify custom masonry layout columns number', 'cherry' ),
					'max_value'		=> 12,
					'min_value'		=> 1,
					'value'			=> 3,
				),
				'blog-layout-columns-gutter' => array(
					'type'			=> 'slider',
					'title'			=> __( 'Masonry columns gutter', 'cherry' ),
					'description'	=> __( 'Specify custom masonry layout columns gutter(px)', 'cherry' ),
					'max_value'		=> 100,
					'min_value'		=> 0,
					'value'			=> 10,
				),
				'blog-layout-timeline-item-width' => array(
					'type'			=> 'slider',
					'title'			=> __( 'Timeline item width', 'cherry' ),
					'description'	=> __( 'Specify custom item width for Timeline blog layout(%)', 'cherry' ),
					'max_value'		=> 50,
					'min_value'		=> 10,
					'value'			=> 48,
				),
				'blog-layout-use-timeline-breakpoint' => array(
					'type'			=> 'switcher',
					'title'			=> __( 'Enable timeline breakpoints', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'		=> 'text',
						'content'	=> __( 'Enable/disable timeline breakpoints', 'cherry-blog-layouts' )
					),
					'value'			=> 'true',
				),
				'blog-layout-timeline-breakpoint' => array(
					'type'			=> 'select',
					'title'			=> __( 'Timeline breakpoint', 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'		=> 'text',
						'content'	=> __( 'Select timeline breakpoint type', 'cherry-blog-layouts' )
					),
					'value'			=> 'month',
					'class'			=> 'width-full',
					'options'		=> array(
						'year'		=> __( 'Year', 'cherry-blog-layouts' ),
						'month'		=> __( 'Month', 'cherry-blog-layouts' ),
						'day'		=> __( 'Day', 'cherry-blog-layouts' )
					)
				),
				'blog-layout-timeline-breakpoint-date-format' => array(
					'type'			=> 'text',
					'title'			=> __('Timeline breakpoint date format', 'cherry'),
					'label'			=> '',
					'description'	=> 'Specify the date format.',
					'hint'			=>  array(
						'type'		=> 'text',
						'content'	=> __('More info <a href="https://codex.wordpress.org/Formatting_Date_and_Time">here</a> ', 'cherry'),
					),
					'value'			=> 'F j, Y',
				),
				'blog-layout-show-marker-date' => array(
					'type'			=> 'switcher',
					'title'			=> __( "Enable marker's date label", 'cherry-blog-layouts' ),
					'label'			=> '',
					'description'	=> '',
					'hint'			=> array(
						'type'		=> 'text',
						'content'	=> __( "Enable/disable marker's date label", 'cherry-blog-layouts' )
					),
					'value'			=> 'false',
				),
				'blog-layout-timeline-marker-date-format' => array(
					'type'			=> 'text',
					'title'			=> __('Timeline marker date format', 'cherry'),
					'label'			=> '',
					'description'	=> 'Specify the date format.',
					'hint'			=>  array(
						'type'		=> 'text',
						'content'	=> __('More info <a href="https://codex.wordpress.org/Formatting_Date_and_Time">here</a> ', 'cherry'),
					),
					'value'			=> 'F j, Y',
				),
				'blog-layout-grid-type' => array(
					'type'			=> 'radio',
					'title'			=> __( 'Grid type', 'cherry' ),
					'description'	=> __( 'Select layout pattern for pages with custom blog layout. Wide layout will fit window width. Boxed layout will have fixed width.', 'cherry' ),
					'value'			=> 'inherit',
					'display_input'	=> false,
					'options'		=> array(
						'inherit' => array(
							'label'   => __( 'Inherit', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/inherit.svg',
						),
						'wide' => array(
							'label'   => __( 'Wide', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/grid-type-fullwidth.svg',
						),
						'boxed' => array(
							'label'   => __( 'Boxed', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/grid-type-container.svg',
						),
					),
				),
				'blog-layout-sidebar-position' => array(
					'type'        => 'radio',
					'title'       => __( 'Custom Blog sidebars', 'cherry-blog-layouts' ),
					'description' => '',
					'hint'        => array(
						'type'    => 'text',
						'content' => __( 'You can choose if you want to display sidebars and how you want to display them.', 'cherry' ),
					),
					'value'         => 'inherit',
					'display_input' => false,
					'options'       => array(
						'inherit' => array(
							'label'   => __( 'Inherit', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/inherit.svg',
						),
						'sidebar-content' => array(
							'label'   => __( 'Left sidebar', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-left-sidebar.svg',
						),
						'content-sidebar' => array(
							'label'   => __( 'Right sidebar', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-right-sidebar.svg',
						),
						'sidebar-content-sidebar' => array(
							'label'   => __( 'Left and right sidebar', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-both-sidebar.svg',
						),
						'sidebar-sidebar-content' => array(
							'label'   => __( 'Two sidebars on the left', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-sameside-left-sidebar.svg',
						),
						'content-sidebar-sidebar' => array(
							'label'   => __( 'Two sidebars on the right', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-sameside-right-sidebar.svg',
						),
						'no-sidebar' => array(
							'label'   => __( 'No sidebar', 'cherry' ),
							'img_src' => PARENT_URI . '/lib/admin/assets/images/svg/page-layout-fullwidth.svg',
						)
					)
				)
			);

			$menu_options = apply_filters( 'cherry_blog_layout_options', $layout_options );

			$sections['blog-layout-options-section'] = array(
				'name'			=> __( 'Blog layout', 'cherry-blog-layouts' ),
				'icon'			=> 'dashicons dashicons-arrow-right',
				'parent'		=> 'blog-section',
				'priority'		=> 41,
				'options-list'	=> apply_filters( 'cherry_blog_layout_options_list', $layout_options )
			);

			return $sections;
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

	Cherry_Blog_Layout_Options::get_instance();

}