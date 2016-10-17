<?php
/**
 * Cherry PSlider
 *
 * @package   Cherry_Slider
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for register post types.
 *
 * @since 1.0.0
 */
class Cherry_Slider_Registration {

	/**
	 * A reference to an instance of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Sets up needed actions/filters.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		// Adds the testimonials post type.
		add_action( 'init', array( $this, 'register' ) );
		add_action( 'init', array( $this, 'register_taxonomy' ) );

		add_action( 'post.php', array( $this, 'add_post_formats_support' ) );
		add_action( 'load-post.php', array( $this, 'add_post_formats_support' ) );
		add_action( 'load-post-new.php', array( $this, 'add_post_formats_support' ) );
	}

	/**
	 * Register the custom post type.
	 *
	 * @since 1.0.0
	 * @link http://codex.wordpress.org/Function_Reference/register_post_type
	 */
	public function register() {

		$labels = array(
			'name'               => __( 'Slides list', 'cherry-slider' ),
			'singular_name'      => __( 'Slides list', 'cherry-slider' ),
			'add_new'            => __( 'Add new slide', 'cherry-slider' ),
			'add_new_item'       => __( 'Add new slide', 'cherry-slider' ),
			'edit_item'          => __( 'Edit Slider Item', 'cherry-slider' ),
			'new_item'           => __( 'New Slider Item', 'cherry-slider' ),
			'view_item'          => __( 'View Slider Item', 'cherry-slider' ),
			'search_items'       => __( 'Search Slider Items', 'cherry-slider' ),
			'not_found'          => __( 'No Slider Items found', 'cherry-slider' ),
			'not_found_in_trash' => __( 'No Slider Items found in trash', 'cherry-slider' ),
		);

		$supports = array(
			'title',
			'editor',
			'thumbnail',
			'revisions',
			'page-attributes',
			'post-formats',
			'comments',
		);

		$args = array(
			'labels'          => $labels,
			'supports'        => $supports,
			'public'          => true,
			'capability_type' => 'post',
			'rewrite'         => array( 'slug' => 'slider-archive' ),
			'menu_position'   => null,
			'menu_icon'       => ( version_compare( $GLOBALS['wp_version'], '3.8', '>=' ) ) ? 'dashicons-welcome-view-site' : '',
			'can_export'      => true,
			'has_archive'     => true,
		);

		$args = apply_filters( 'cherry_slider_post_type_args', $args );

		register_post_type( CHERRY_SLIDER_NAME, $args );
	}

	/**
	 * Post formats.
	 *
	 * @since 1.0.0
	 * @link http://codex.wordpress.org/Function_Reference/register_taxonomy
	 */
	public function add_post_formats_support() {
		global $typenow;

		if ( CHERRY_SLIDER_NAME != $typenow ) {
			return;
		}

		$args = apply_filters( 'cherry_slider_add_post_formats_support', array( 'image', 'video' ) );

		add_post_type_support( CHERRY_SLIDER_NAME, 'post-formats', $args );
		add_theme_support( 'post-formats', $args );
	}

	/**
	 * Register the custom taxonomy.
	 *
	 * @since 1.0.0
	 * @link http://codex.wordpress.org/Function_Reference/register_taxonomy
	 */
	public function register_taxonomy() {

		// Register the category taxonomy
		$category_taxonomy_labels = array(
			'label'				=> __( 'Sliders', 'cherry-slider' ),
			'singular_name'		=> __( 'Slider', 'cherry-slider' ),
			'menu_name'			=> __( 'All Sliders', 'cherry-slider' ),
			'add_new_item'		=> __( 'Add New Slider', 'cherry-slider' ),
			'all_items'			=> __( 'All Sliders', 'cherry-slider' ),
			'name'				=> __( 'Sliders', 'cherry-slider' ),
			'update_item'		=> __( 'Update Slider', 'cherry-slider' ),
			'new_item_name'		=> __( 'New Slider Name', 'cherry-slider' ),
			'search_items'		=> __( 'Search Sliders', 'cherry-slider' ),
			'parent_item'		=> __( 'Parent Slider', 'cherry-slider' ),
			'parent_item_colon' => __( 'Parent Slider:', 'cherry-slider' ),
			'edit_item'			=> __( 'Edit Slider:', 'cherry-slider' ),
		);

		$category_taxonomy_args = array(
			'labels'		=> $category_taxonomy_labels,
			'hierarchical'	=> true,
			'rewrite'		=> true,
			'query_var'		=> true,
		);

		register_taxonomy( CHERRY_SLIDER_NAME . '_sliders', CHERRY_SLIDER_NAME, $category_taxonomy_args );

	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 * @return object
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}
}

Cherry_Slider_Registration::get_instance();
