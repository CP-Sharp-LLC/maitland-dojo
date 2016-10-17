<?php
/**
 * Plugin Name: Cherry Grid
 * Plugin URI:  http://www.cherryframework.com/
 * Description: Adds shortcode with masonry based layout.
 * Version:     1.0.2
 * Author:      Cherry Team
 * Author URI:  http://www.cherryframework.com/
 * Text Domain: cherry-grid
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
	die;
}

// If class 'Cherry_Grid' not exists.
if ( !class_exists( 'Cherry_Grid' ) ) {

	/**
	 * Sets up and initializes the Cherry Team plugin.
	 *
	 * @since 1.0.0
	 */
	class Cherry_Grid {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Sets up needed actions/filters for the plugin to initialize.
		 *
		 * @since 1.0.0
		 */
		public function __construct() {

			$this->constants();
			$this->includes();

			// Internationalize the text strings used.
			add_action( 'plugins_loaded', array( $this, 'lang' ), 2 );

			// Load public-facing style sheet and JavaScript.
			add_action( 'wp_enqueue_scripts',         array( $this, 'assets' ), 20 );
			add_filter( 'cherry_compiler_static_css', array( $this, 'add_style_to_compiler' ) );

			add_filter( 'body_class', array( $this, 'add_noflex_classes' ) );

			if ( is_admin() ) {
				$this->admin();
			}

		}

		/**
		 * Defines constants for the plugin.
		 *
		 * @since 1.0.0
		 */
		function constants() {

			/**
			 * Set the version number of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_GRID_VERSION', '1.0.2' );

			/**
			 * Set the slug of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_GRID_SLUG', basename( dirname( __FILE__ ) ) );

			/**
			 * Set the name for the 'meta_key' value in the 'wp_postmeta' table.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_GRID_POSTMETA', '_cherry_grid' );

			/**
			 * Set constant path to the plugin directory.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_GRID_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin URI.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_GRID_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
		}

		/**
		 * Loads files from the '/inc' folder.
		 *
		 * @since 1.0.0
		 */
		function includes() {
			require_once ( CHERRY_GRID_DIR . 'includes/class-cherry-grid-shortcode.php' );
		}

		/**
		 * Loads the translation files.
		 *
		 * @since 1.0.0
		 */
		function lang() {
			load_plugin_textdomain( 'cherry-grid', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		}

		/**
		 * Loads admin files.
		 *
		 * @since 1.0.0
		 */
		function admin() {
			require_once( CHERRY_GRID_DIR . 'includes/admin/class-cherry-grid-metabox.php' );
			require_once( CHERRY_GRID_DIR . 'admin/includes/class-cherry-update/class-cherry-plugin-update.php' );

			$Cherry_Plugin_Update = new Cherry_Plugin_Update();
			$Cherry_Plugin_Update -> init( array(
					'version'			=> CHERRY_GRID_VERSION,
					'slug'				=> CHERRY_GRID_SLUG,
					'repository_name'	=> CHERRY_GRID_SLUG
			));
		}

		/**
		 * Register and enqueue public-facing style sheet.
		 *
		 * @since 1.0.0
		 */
		public function assets() {
			wp_enqueue_style(
				'cherry-grid',
				CHERRY_GRID_URI . 'assets/css/style.css', array(), CHERRY_GRID_VERSION
			);
			wp_register_script(
				'cherry-grid',
				CHERRY_GRID_URI . 'assets/js/min/script.min.js', array( 'jquery' ), CHERRY_GRID_VERSION, true
			);
		}

		/**
		 * Pass chart style handle to CSS compiler
		 *
		 * @since  1.0.0
		 *
		 * @param  array $handles CSS handles to compile
		 */
		function add_style_to_compiler( $handles ) {
			$handles = array_merge(
				array( 'cherry-grid' => plugins_url( 'assets/css/style.css', __FILE__ ) ),
				$handles
			);

			return $handles;
		}

		/**
		 * Add special class to body for browsers that not supports flex
		 * It's IE9 and lover (unexpected, yeh...)
		 *
		 * @since  1.0.0
		 *
		 * @param array $classes Array of existing body classes
		 */
		function add_noflex_classes( $classes ) {

			global $is_IE;

			if( ! $is_IE || ! preg_match( '/MSIE [56789]/', $_SERVER['HTTP_USER_AGENT'] ) ) {
				return $classes;
			}

			$classes[] = 'no-flex';
			$classes[] = 'no-columns';

			return $classes;

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

	Cherry_Grid::get_instance();
}