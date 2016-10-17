<?php
/**
 * Sets up the admin functionality for the plugin.
 *
 * @package   Cherry_Slider_Admin
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for Cherry Simple Slider admin functionality.
 *
 * @since 1.0.0
 */
class Cherry_Slider_Admin {

	/**
	 * Holds the instances of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Sets up needed actions/filters for the admin to initialize.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function __construct() {

		// Load post meta boxes on the post editing screen.
		add_action( 'load-post.php', array( $this, 'load_post_meta_boxes' ) );
		add_action( 'load-post-new.php', array( $this, 'load_post_meta_boxes' ) );

		add_action( 'wp_ajax_get_slider_format_metabox', array( $this, 'load_post_meta_boxes' ), 10 );

		// Only run our customization on the 'edit.php' page in the admin.
		add_action( 'load-edit.php', array( $this, 'load_edit' ) );

		// Modify the columns on the "Slides" screen.
		add_filter( 'manage_edit-cherry_slider_columns', array( $this, 'edit_cherry_slider_columns' ) );

		add_action( 'manage_cherry_slider_posts_custom_column', array( $this, 'manage_cherry_slider_columns' ), 10, 2 );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );

		add_action( 'wp_ajax_get_slider_format_metabox', array( $this, 'get_slider_format_metabox' ), 20 );
	}

	/**
	 * Load post meta boxes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_post_meta_boxes() {
		$screen = get_current_screen();

		if ( ( ! empty( $screen->post_type ) && CHERRY_SLIDER_NAME === $screen->post_type ) || ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
			require_once( trailingslashit( CHERRY_SLIDER_DIR ) . 'admin/includes/class-cherry-slider-meta-boxes.php' );
			$this->slider_meta_boxes = new Cherry_Simple_Slider_Meta_Boxes;
		}

	}

	/**
	 * Adds a custom filter on 'request' when viewing the "Slider" screen in the admin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_edit() {
		$screen = get_current_screen();

		if ( ! empty( $screen->post_type ) && CHERRY_SLIDER_NAME === $screen->post_type ) {
			add_action( 'admin_head', array( $this, 'print_styles' ) );
		}
	}

	/**
	 * Style adjustments for the manage menu items screen.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function print_styles() {
		?><style type="text/css">
		.edit-php .wp-list-table td.thumbnail.column-thumbnail,
		.edit-php .wp-list-table th.manage-column.column-thumbnail { text-align: center; }
		</style><?php
	}

	/**
	 * Filters the columns on the "Slider list" screen.
	 *
	 * @since  1.0.0
	 * @param  array $post_columns default columns array.
	 * @return array $post_columns updated columns array.
	 */
	public function edit_cherry_slider_columns( $post_columns ) {

		unset(
			$post_columns['author'],
			$post_columns['date'],
			$post_columns['comments']
		);

		// Add custom columns.
		$post_columns[ CHERRY_SLIDER_NAME . '_sliders' ] = __( 'Slider', 'cherry-slider' );
		$post_columns['date']                            = __( 'Date', 'cherry-slider' );
		$post_columns['thumbnail']                       = __( 'Preview', 'cherry-slider' );

		// Return the columns.
		return $post_columns;
	}

	/**
	 * Add output for custom columns on the "menu items" screen.
	 *
	 * @since  1.0.0
	 * @param  string $column  Column oblect.
	 * @param  int    $post_id Post id.
	 * @return void
	 */
	public function manage_cherry_slider_columns( $column, $post_id ) {

		switch ( $column ) {

			case CHERRY_SLIDER_NAME . '_sliders' :

				$post_categories = is_wp_error( get_the_terms( $post_id, CHERRY_SLIDER_NAME . '_sliders' ) ) ? '' : get_the_terms( $post_id, CHERRY_SLIDER_NAME . '_sliders' );

				if ( $post_categories ) {
					$category_name_list = '';
					$count = 1;

						foreach ( $post_categories as $category => $category_value ) {
							$category_name_list .= $category_value->name;
							( $count < count( $post_categories ) ) ? $category_name_list .= ', ' : '' ;
							$count++;
						}

					echo $category_name_list;
				} else {
					echo __( 'This slide is not related to any slider', 'cherry-slider' );
				}

			break;

			case 'thumbnail' :

				$thumb = get_the_post_thumbnail( $post_id, array( 75, 75 ) );
				echo ! empty( $thumb ) ? $thumb : '&mdash;' ;

			break;
		}
	}

	/**
	 * Add scripts in the queue to include.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function enqueue_scripts() {
		$screen = get_current_screen();

		if ( ! empty( $screen->post_type ) && CHERRY_SLIDER_NAME === $screen->post_type ) {
			wp_enqueue_script( 'cherry-simple-slider-admin-scripts', trailingslashit( CHERRY_SLIDER_URI ) . 'admin/assets/js/admin-scripts.js', array( 'jquery' ), CHERRY_SLIDER_VERSION );
		}

	}

	/**
	 * Add styles in the queue to include.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function enqueue_styles() {
		$screen = get_current_screen();

		if ( ! empty( $screen->post_type ) && CHERRY_SLIDER_NAME === $screen->post_type ) {
			wp_enqueue_style( 'cherry-simple-slider-admin-style', trailingslashit( CHERRY_SLIDER_URI ) . 'admin/assets/css/admin-style.css', array(), CHERRY_SLIDER_VERSION );
		}
	}

	/**
	 * Ajax hook for gerring post format.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function get_slider_format_metabox() {

		if ( ! empty( $_POST ) && array_key_exists( 'post_format', $_POST ) && array_key_exists( 'post_id', $_POST ) ) {
			$post_format = $_POST['post_format'];
			$post_id = $_POST['post_id'];
			$output = $this->slider_meta_boxes->format_metabox_builder( $post_id, $post_format );

			echo $output;
			exit;
		}
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

Cherry_Slider_Admin::get_instance();

