<?php
/**
 * Plugin Name: Cherry Blog Layouts
 * Plugin URI:  http://www.cherryframework.com/
 * Description: Additional blog layouts.
 * Version:     1.0.5
 * Author:      Cherry Team
 * Author URI:  http://www.cherryframework.com/
 * Text Domain: cherry-blog-layouts
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( ! class_exists( 'Cherry_Blog_Layouts' ) ) {
	/**
	 * Main plugin class
	 */
	class Cherry_Blog_Layouts {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Static property to save Custom blog layout staus during page request
		 *
		 * @since 1.0.0
		 * @var   boolean
		 */
		public static $is_custom_layout = false;

		/**
		 * Sataic property to determine if showing custom page template
		 *
		 * @since 1.0.0
		 * @var   boolean
		 */
		public static $is_custom_page = false;

		/**
		 * Constructor
		 */
		public function __construct() {
			// Set the constants needed by the plugin.
			$this->constants();
			// Internationalize the text strings used.
			add_action( 'plugins_loaded', array( $this, 'lang' ), 2 );
			// Include necessary files
			add_action( 'plugins_loaded', array( $this, '_public' ), 5 );
			add_action( 'plugins_loaded', array( $this, '_admin' ),  5 );

			add_action( 'wp_enqueue_scripts',         array( $this, 'public_assets' ) );
			add_filter( 'cherry_compiler_static_css', array( $this, 'add_style_to_compiler' ) );
		}

		/**
		 * Enqueue public assets
		 */
		public function public_assets() {
			// css assets
			wp_enqueue_style( 'cherry-blog-style', CHERRY_BLOG_URI . 'public/assets/css/style.css', array(), CHERRY_BLOG_VERSION );
			// js assets
			//wp_enqueue_script( 'imagesloaded', CHERRY_BLOG_URI . 'public/assets/js/imagesloaded.pkgd.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			//wp_enqueue_script( 'isotope', CHERRY_BLOG_URI . 'public/assets/js/isotope.pkgd.min.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			//wp_enqueue_script( 'cherry-api', CHERRY_BLOG_URI . 'public/assets/js/cherry-api.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			//wp_enqueue_script( 'cherry-blog-scripts', CHERRY_BLOG_URI . 'public/assets/js/init.js', array('jquery'), CHERRY_BLOG_VERSION, true );
		}

		/**
		 * Register and enqueue public-facing script sheet.
		 *
		 * @since 1.0.0
		 */
		public static function enqueue_scripts() {
			// js assets
			wp_enqueue_script( 'imagesloaded', CHERRY_BLOG_URI . 'public/assets/js/imagesloaded.pkgd.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			wp_enqueue_script( 'isotope', CHERRY_BLOG_URI . 'public/assets/js/isotope.pkgd.min.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			wp_enqueue_script( 'cherry-api', CHERRY_BLOG_URI . 'public/assets/js/cherry-api.js', array('jquery'), CHERRY_BLOG_VERSION, true );
			wp_enqueue_script( 'cherry-blog-scripts', CHERRY_BLOG_URI . 'public/assets/js/init.js', array('jquery'), CHERRY_BLOG_VERSION, true );
		}
		/**
		 * Pass style handle to CSS compiler.
		 *
		 * @since 1.0.4
		 *
		 * @param array $handles CSS handles to compile.
		 */
		public function add_style_to_compiler( $handles ) {
			$handles = array_merge(
				array( 'cherry-blog-style' => CHERRY_BLOG_URI . 'public/assets/css/style.css' ),
				$handles
			);

			return $handles;
		}

		/**
		 * Initialise translations
		 *
		 * @since 1.0.0
		 */
		public function lang() {
			load_plugin_textdomain( 'cherry-blog', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		}

		/**
		 * Defines constants for the plugin.
		 *
		 * @since 1.0.0
		 */
		public function constants() {

			/**
			 * Set the version number of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_BLOG_VERSION', '1.0.5' );

			/**
			 * Set the slug of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_BLOG_SLUG', basename( dirname( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin directory.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_BLOG_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin URI.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_BLOG_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

		}

		/**
		 * Get custom blog Layout conditionals array
		 *
		 * @since  1.0.0
		 *
		 * @return array conditionals list
		 */
		public static function conditionals() {

			return array(
				'is_home',
				'is_post_type_archive',
				'is_category',
				'is_tag',
				'is_author',
				'is_date'
			);

		}

		/**
		 * Include public-related files
		 *
		 * @since 1.0.0
		 */
		public function _public() {
			require CHERRY_BLOG_DIR . 'public/includes/class-cherry-blog-data.php';
			require CHERRY_BLOG_DIR . 'public/includes/class-cherry-blog-template-loader.php';
			require CHERRY_BLOG_DIR . 'public/includes/class-cherry-blog-tools.php';
			require CHERRY_BLOG_DIR . 'public/includes/class-cherry-blog-shortcode.php';
		}

		/**
		 * Include admin-related files
		 *
		 * @since 1.0.0
		 */
		public function _admin() {
			if ( is_admin() ) {
				require CHERRY_BLOG_DIR . 'admin/includes/class-cherry-blog-options.php';
				require_once( CHERRY_BLOG_DIR . 'admin/includes/class-cherry-update/class-cherry-plugin-update.php' );

				$Cherry_Plugin_Update = new Cherry_Plugin_Update();
				$Cherry_Plugin_Update -> init( array(
						'version'			=> CHERRY_BLOG_VERSION,
						'slug'				=> CHERRY_BLOG_SLUG,
						'repository_name'	=> CHERRY_BLOG_SLUG
				));
			}
		}

		/**
		 * Get option from database by name
		 *
		 * @since  1.0.0
		 *
		 * @param  string $name    option name to get
		 * @param  mixed  $default default option value
		 */
		public static function get_option( $name, $default = false ) {

			if ( function_exists( 'cherry_get_option' ) ) {
				$value = cherry_get_option( $name, $default );
				return $value;
			}

			return $default;
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

	Cherry_Blog_Layouts::get_instance();
}