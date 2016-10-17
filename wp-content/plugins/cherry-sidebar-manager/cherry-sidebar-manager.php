<?php
/**
 * Plugin Name: Cherry Sidebar Manager
 * Plugin URI:  http://www.cherryframework.com/
 * Description: Plugin for creating and managing sidebar in WordPress.
 * Version:     1.0.5.1
 * Author:      Cherry Team
 * Author URI:  http://www.cherryframework.com/
 * Text Domain: cherry-sidebar-manager
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path: /languages
 *
 * @package  Cherry Sidebar Manager
 * @category Core
 * @author   Cherry Team
 * @license  GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// If class 'Cherry_Custom_Sidebars' not exists.
if ( ! class_exists( 'Cherry_Custom_Sidebars' ) ) {

	/**
	 * Sets up and initializes the Cherry Custom Sidebars plugin.
	 *
	 * @since 1.0.0
	 */
	class Cherry_Custom_Sidebars {

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

			// Set the constants needed by the plugin.
			add_action( 'plugins_loaded', array( $this, 'constants' ), 1 );

			// Internationalize the text strings used.
			add_action( 'plugins_loaded', array( $this, 'lang' ), 2 );

			// Load the functions files.
			add_action( 'plugins_loaded', array( $this, 'includes' ), 3 );

			// Load the admin files.
			add_action( 'plugins_loaded', array( $this, 'admin' ), 4 );

			// Register activation and deactivation hook.
			register_activation_hook( __FILE__, array( $this, 'activation' ) );
			register_deactivation_hook( __FILE__, array( $this, 'deactivation' ) );
		}

		/**
		 * Defines constants for the plugin.
		 *
		 * @since 1.0.0
		 */
		function constants() {

			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$plugin_data = get_plugin_data( plugin_dir_path( __FILE__ ) . basename( __FILE__ ) );

			/**
			 * Set constant name for the post type name.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_CUSTOM_SIDEBARS_SLUG', basename( dirname( __FILE__ ) ) );

			/**
			 * Set the version number of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_CUSTOM_SIDEBARS_VERSION', $plugin_data['Version'] );

			/**
			 * Set constant path to the plugin directory.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_CUSTOM_SIDEBARS_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin URI.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_CUSTOM_SIDEBARS_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
		}

		/**
		 * Loads files from the '/includes' folder.
		 *
		 * @since 1.0.0
		 */
		function includes() {
			require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'admin/includes/class-cherry-sidebar-manager.php' );
			require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'public/includes/classes/class-cherry-include-sidebar.php' );
		}

		/**
		 * Loads the translation files.
		 *
		 * @since 1.0.0
		 */
		function lang() {
			load_plugin_textdomain( 'cherry-sidebar-manager', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		}

		/**
		 * Loads admin files.
		 *
		 * @since 1.0.0
		 */
		function admin() {
			if ( is_admin() ) {
				require_once( CHERRY_CUSTOM_SIDEBARS_DIR . 'admin/includes/class-cherry-sidebar-manager-admin.php' );
				require_once( CHERRY_CUSTOM_SIDEBARS_DIR . 'admin/includes/class-cherry-update/class-cherry-plugin-update.php' );

				$Cherry_Plugin_Update = new Cherry_Plugin_Update();
				$Cherry_Plugin_Update -> init( array(
						'version'			=> CHERRY_CUSTOM_SIDEBARS_VERSION,
						'slug'				=> CHERRY_CUSTOM_SIDEBARS_SLUG,
						'repository_name'	=> CHERRY_CUSTOM_SIDEBARS_SLUG,
				));
			}
		}

		/**
		 * On plugin activation.
		 *
		 * @since 1.0.0
		 */
		function activation() {
			flush_rewrite_rules();
		}

		/**
		 * On plugin deactivation.
		 *
		 * @since 1.0.0
		 */
		function deactivation() {
			flush_rewrite_rules();
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

	Cherry_Custom_Sidebars::get_instance();
}
