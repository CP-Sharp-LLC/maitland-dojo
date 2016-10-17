<?php
/**
 * Plugin Name: Cherry White Label
 * Plugin URI:	http://www.cherryframework.com/
 * Description: Cherry White Label plugin for WordPress.
 * Version:     1.0.2
 * Author:      Cherry Team
 * Author URI:  http://www.cherryframework.com/
 * Text Domain: cherry-white-label
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path: /languages
 */

// Include tools for debug mode
if (file_exists(plugin_dir_path( __FILE__ ) . 'tools.php') && WP_DEBUG !== FALSE)
{
	require_once(plugin_dir_path( __FILE__ ) . 'tools.php');
}

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( ! class_exists( 'CherryWhiteLabel' ) ) {
	/**
	 * Main plugin class
	 */
	final class CherryWhiteLabel {

		/**
		 * @var   string
		 * @since 1.0.0
		 */
		public $version = '1.0.2';

		/**
		 * Constructor
		 */
		public function __construct() {
			// Set the constants needed by the plugin.
			$this->constants();

			// Internationalize the text strings used.
			add_action( 'plugins_loaded', array( $this, 'lang' ), 2 );

			// Include necessary files
			add_action( 'plugins_loaded', array( $this, 'includes' ), 3 );

			// Deactivation plugin
			register_deactivation_hook( __FILE__, array($this, 'deactivation') );
		}

		/**
		 * Deactivate plugin
		 * Clears some options
		 */
		public function deactivation()
		{
			$options = get_option('cherry-white-label-settings');

			if (isset($options['admin-panel-slug']))
			{
				unset($options['admin-panel-slug']);
			}

			// Deletes an option that is no longer supported
			$options = $this->_clear_old_options($options);

			update_option('cherry-white-label-settings', $options);

			delete_option('is_admin_slug');
			delete_option('custom_wp_admin_slug');
			delete_option('is_forgot_password_slug');
			delete_option('custom_wp_forgot_password_slug');
			// TODO: Удалить правило в .htaccess после деактивации плагина
		}

		/**
		 *  Deletes an option that is no longer supported
		 */
		private function _clear_old_options($options)
		{
			if (isset($options['admin-panel-slug']))
			{
				unset($options['admin-panel-slug']);
			}

			if (isset($options['wp-logo-dashboard']))
			{
				unset( $options['wp-logo-dashboard'] );
			}

			if (isset($options['dashboard-heading']))
			{
				unset($options['dashboard-heading']);
			}

			return $options;
		}

		/**
		 * Initialise translations
		 *
		 * @since 1.0.0
		 */
		public function lang() {
			load_plugin_textdomain( 'cherry-white-label', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
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
			define( 'CHERRY_WHITE_LABEL_VERSION', $this->version );

			/**
			 * Set the slug of the plugin.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_WHITE_LABEL_SLUG', basename( dirname( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin directory.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_WHITE_LABEL_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin URI.
			 *
			 * @since 1.0.0
			 */
			define( 'CHERRY_WHITE_LABEL_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

		}

		/**
		 * Include core files for both: admin and public
		 *
		 * @since 1.0.0
		 */
		public function includes() {
			require_once( 'includes/cherry-white-label-init.php' );

			if ( is_admin() ) {
				require_once( CHERRY_WHITE_LABEL_DIR . 'admin/includes/class-cherry-update/class-cherry-plugin-update.php' );

				$Cherry_Plugin_Update = new Cherry_Plugin_Update();
				$Cherry_Plugin_Update -> init( array(
						'version'			=> CHERRY_WHITE_LABEL_VERSION,
						'slug'				=> CHERRY_WHITE_LABEL_SLUG,
						'repository_name'	=> CHERRY_WHITE_LABEL_SLUG
				));
			}
		}
	}

	new CherryWhiteLabel();
}