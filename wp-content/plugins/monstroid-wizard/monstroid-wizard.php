<?php
/**
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name:       Monstroid Wizard
 * Plugin URI:        http://www.templatemonster.com/
 * Description:       Installation wizard for Monstroid theme
 * Version:           1.2.0
 * Author:            TemplateMonster
 * Author URI:        http://www.templatemonster.com/
 * Text Domain:       cherry-wizard
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 *
 * Installation wizard for Monstroid theme
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// If class 'monstroid_wizard' not exists.
if ( ! class_exists('monstroid_wizard') ) {

	/**
	 * Sets up and initializes the Cherry Wizard plugin.
	 *
	 * @since 1.0.0
	 */
	class monstroid_wizard {

		/**
		 * Wizard plugin slug (for text domains and options pages)
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $slug = 'monstroid-wizard';

		/**
		 * Cherry license key
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $cherry_key = '';

		/**
		 * Cherry theme name
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $cherry_theme_name = 55555;

		/**
		 * Cherry cloud url
		 *
		 * @since 1.0.0
		 * @var string
		 */
		public $cherry_cloud_url = 'https://cloud.cherryframework.com/';

		/**
		 * Directory writing permissions holder
		 *
		 * @since 1.0.0
		 * @var   string
		 */
		public $dir_permissions = null;

		/**
		 * Define server settings
		 *
		 * @since 1.0.0
		 * @var   string
		 */
		public $server_settings = null;

		/**
		 * Sets up needed actions/filters for the plugin to initialize.
		 *
		 * @since 1.0.0
		 */
		public function __construct() {

			// Register activation and deactivation hooks.
			register_activation_hook( __FILE__, array( $this, 'activation' ) );
			register_deactivation_hook( __FILE__, array( $this, 'deactivation' ) );

			// this plugin nothing to do on frontend
			if ( ! is_admin() ) {
				return;
			}

			// setup theme name and keys from transient (for later steps)
			$this->cherry_key = get_transient( 'cherry_key' );

			// Set the constants needed by the plugin.
			add_action( 'plugins_loaded', array( $this, 'constants' ), 1 );
			// Internationalize the text strings used.
			add_action( 'plugins_loaded', array( $this, 'lang' ), 2 );
			// Load the functions files.
			add_action( 'plugins_loaded', array( $this, 'includes' ), 3 );
			// Load public-facing style sheet and JavaScript.
			add_action( 'admin_enqueue_scripts', array( $this, 'assets' ), 30 );
			// Start session
			add_action( 'init', array( $this, 'session_start' ) );
			// Allow files downloadin from TM hosts
			add_filter( 'http_request_host_is_external', array( $this, 'allow_tm_hosts' ), 10, 3 );
			// Clear installation data after installation was complete
			add_filter( 'cherry_data_manager_install_complete', array( $this, 'clear_import_data' ) );
			// Pass link to installation page
			add_filter( 'monstroid_dashboard_package_installation_link', array( $this, 'pass_installation_link' ) );

		}

		/**
		 * Start session
		 *
		 * @since 1.0.0
		 */
		function session_start() {

			if ( ! session_id() ) {
				session_start();
			}

		}

		/**
		 * Check if current WP version is compatible with Cherry
		 *
		 * @since  1.0.0
		 * @return boolean
		 */
		function is_compatible_wp_version() {
			global $wp_version;
			return version_compare( $wp_version, '4.2.2' ) >= 0;
		}

		/**
		 * Pass link to installation.
		 *
		 * @param  string $link default installation link.
		 * @return string
		 */
		function pass_installation_link( $link ) {
			$url = menu_page_url( $this->slug, false );
			return add_query_arg( array( 'step' => 'theme-install', 'type' => 'premium' ), $url );
		}

		/**
		 * Enqueue CSS and JS
		 *
		 * @since 1.0.0
		 */
		function assets() {

			// Include admin interface styles
			/*wp_enqueue_style(
				'monstroid-ui-elements',
				MONSTROID_WIZARD_URI . 'assets/css/cherry-ui.css', array(), '1.0.0'
			);*/
			wp_enqueue_style(
				$this->slug . '-style',
				MONSTROID_WIZARD_URI . 'assets/css/monstroid-wizard.css', array(), MONSTROID_WIZARD_VERSION
			);

			wp_enqueue_style( 'roboto', '//fonts.googleapis.com/css?family=Roboto:400,500', array(), '1.0.0' );

			// include next assets only for wizard-related pages
			if ( ! $this->is_wizard_page() ) {
				return;
			}

			$url  = menu_page_url( $this->slug, false );
			$type = 'premium';

			$wizard_steps = array(
				'select_type'      => add_query_arg( array( 'step' => 'select-type', 'type' => $type ), $url ),
				'advanced_install' => add_query_arg( array( 'step' => 'advanced-install', 'type' => $type ), $url ),
				'select_theme'     => add_query_arg( array( 'step' => 'select-theme', 'type' => $type ), $url ),
				'theme_install'    => add_query_arg( array( 'step' => 'theme-install', 'type' => $type ), $url ),
				'content_install'  => add_query_arg( array( 'step' => 'content-install', 'type' => $type ), $url ),
				'success'          => add_query_arg( array( 'step' => 'success', 'type' => $type ), $url ),
			);

			if ( isset($_GET['step']) && 'theme-install' == $_GET['step'] ) {

				// Theme installer scripts
				wp_enqueue_script(
					$this->slug . '-installer',
					MONSTROID_WIZARD_URI . 'assets/js/min/installer.min.js', array( 'jquery' ), MONSTROID_WIZARD_VERSION, true
				);

				wp_localize_script(
					$this->slug . '-installer',
					'monstroid_wizard_install_data',
					array(
						'dir_permissions' => $this->dir_permissions,
						'server_settings' => $this->server_settings,
						'redirect_message' => __( 'Theme installation complete. Redirecting to the next step...' )
					)
				);

				wp_localize_script(
					$this->slug . '-installer',
					'monstroid_wizard_steps',
					$wizard_steps
				);

			} elseif ( isset($_GET['step']) && 'content-install' == $_GET['step'] ) {

				$type = isset( $_GET['type'] ) ? $_GET['type'] : 'demo';

				// Content importer scripts
				wp_enqueue_script(
					$this->slug . '-importer',
					MONSTROID_WIZARD_URI . 'assets/js/min/importer.min.js',
					array( 'jquery', 'cherry-data-manager-importer' ),
					MONSTROID_WIZARD_VERSION,
					true
				);

				wp_localize_script(
					$this->slug . '-importer',
					'monstroid_wizard_steps',
					$wizard_steps
				);

			} else {

				wp_enqueue_script(
					$this->slug . '-validator',
					MONSTROID_WIZARD_URI . 'assets/js/min/helper.min.js',
					array( 'jquery' ),
					MONSTROID_WIZARD_VERSION,
					true
				);

				wp_localize_script(
					$this->slug . '-validator',
					'monstroid_wizard_steps',
					$wizard_steps
				);
			}

		}

		/**
		 * Allow files downloading from TM hosts
		 *
		 * @since  1.0.0
		 */
		function allow_tm_hosts( $res, $host, $url ) {

			$allowed_hosts = array( 'tm-head.sasha.php.dev' );

			if ( in_array( $host, $allowed_hosts ) ) {
				return true;
			}

			return $res;

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
			define( 'MONSTROID_WIZARD_VERSION', '1.2.0' );

			/**
			 * Set constant path to the plugin directory.
			 *
			 * @since 1.0.0
			 */
			define( 'MONSTROID_WIZARD_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			/**
			 * Set constant path to the plugin URI.
			 *
			 * @since 1.0.0
			 */
			define( 'MONSTROID_WIZARD_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

		}

		/**
		 * Loads files from the '/includes' folder.
		 *
		 * @since 1.0.0
		 */
		function includes() {

			require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-notices.php' );
			require_once( MONSTROID_WIZARD_DIR . 'includes/monstroid-wizard-service-hooks.php' );
			require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-interface.php' );

			// include next handlers only for wizard pages and AJAX handlers
			if ( $this->is_wizard_page() ) {

				$this->load_dependencies();

				require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-helper.php' );
				require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-install-handlers.php' );
				require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-importer.php' );
				require_once( MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-themes-list.php' );
			}

		}

		/**
		 * Load additional installaton dependencies
		 *
		 * @since  1.1.0
		 * @return void|null
		 */
		public function load_dependencies() {

			$depends = apply_filters( 'monstroid_wizard_installation_dependencies', array() );

			if ( empty( $depends ) ) {
				return;
			}

			foreach ( $depends as $file ) {
				if ( file_exists( $file ) ) {
					require_once $file;
				}
			}
		}

		/**
		 * Loads the translation files.
		 *
		 * @since 1.0.0
		 */
		function lang() {
			load_plugin_textdomain( $this->slug, false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		}

		/**
		 * On plugin activation.
		 *
		 * @since 1.0.0
		 */
		function activation() {
			flush_rewrite_rules();
			add_option( 'monstroid_wizard_need_install', 'yes' );
		}

		/**
		 * On plugin deactivation.
		 *
		 * @since 1.0.0
		 */
		function deactivation() {
			global $monstroid_wizard;
			flush_rewrite_rules();
			delete_option( 'monstroid_wizard_need_install' );
			delete_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name );
			delete_transient( 'monstroid_key' );
			delete_transient( 'monstroid_theme_name' );
		}

		/**
		 * Check if is Cherry Wizard related page
		 *
		 * @since 1.0.0
		 */
		public function is_wizard_page() {

			if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
				return true;
			}

			if ( isset( $_GET['page'] ) && $this->slug === $_GET['page'] ) {
				return true;
			}

			return false;
		}

		/**
		 * Check if content importer plugin are avaliable
		 *
		 * @since 1.0.0
		 */
		public function has_importer() {
			return ( is_plugin_active( 'cherry-data-manager/cherry-data-manager.php' ) );
		}

		public function check_auth_data() {

			return true;

			$cherry_license_key = $this->cherry_key;
			$cherry_theme_name  = $this->cherry_theme_name;

			if ( !isset( $_GET['type'] ) ) {
				echo '<div class="wrap"><div class="' . $this->ui_wrapper_class() . '">' . __( 'Please select installation type', $this->slug ) . '<br><a href="' . menu_page_url( $this->slug, false ) . '" class="button-primary_">' . __( 'Retry', $this->slug ) . '</a>' . '</div>';
				return false;
			}

			if ( ! $cherry_license_key || ! $cherry_theme_name ) {
				echo '<div class="wrap"><div class="' . $this->ui_wrapper_class() . '">' . __( 'Activate your license before installation', $this->slug ) . '<br><a href="' . menu_page_url( $this->slug, false ) . '" class="button-primary_">' . __( 'Retry', $this->slug ) . '</a>' . '</div></div>';
				return false;
			}

			return true;
		}

		/**
		 * Clear imorter sessions after import complete
		 *
		 * @since  1.0.0
		 */
		public function clear_import_data() {

			$session_vars = array(
				'processed_terms',
				'processed_menus',
				'url_remap',
				'featured_images',
				'attachment_posts',
				'processed_posts',
				'menu_items',
				'post_orphans',
				'meta_to_rewrite',
				'missing_menu_items',
				'posts'
			);

			foreach ( $session_vars as $var ) {
				if ( isset( $_SESSION[$var] ) ) {
					unset( $_SESSION[$var] );
				}
			}

		}

		/**
		 * Get specific step URL
		 *
		 * @since  1.0.0
		 * @param  string $step step slug
		 * @return string
		 */
		public function get_step_url( $step = null ) {

			$url = menu_page_url( $this->slug, false );

			if ( ! $step ) {
				return $url;
			}

			return add_query_arg( array( 'step' => $step, 'type' => 'premium' ), $url );
		}

		/**
		 * Get UI wrapper CSS class
		 *
		 * @since  1.0.0
		 */
		public function ui_wrapper_class( $classes = array(), $delimiter = ' ' ) {

			// prevent PHP errors
			if ( ! $classes || ! is_array( $classes ) ) {
				$classes = array();
			}
			if ( ! $delimiter || ! is_string( $delimiter ) ) {
				$delimiter = ' ';
			}

			$classes = array_merge( array( 'monstroid-ui-core' ), $classes );

			/**
			 * Filter UI wrapper CSS classes
			 *
			 * @since 1.0.0
			 *
			 * @param array $classes - default CSS classes array
			 */
			$classes = apply_filters( 'monstroid_ui_wrapper_class', $classes );

			$classes = array_unique( $classes );

			return join( $delimiter, $classes );

		}

		/**
		 * Check current filesystem connection method
		 *
		 * @since  1.0.3
		 * @return bool true - if avaliable direct access, else - access method
		 */
		public function check_filesystem_method() {

			require_once( ABSPATH . 'wp-admin/includes/file.php' );
			$method = get_filesystem_method( array(), false, false );

			if ( 'direct' == $method ) {
				return true;
			}

			return $method;

		}

	}

	// create class instance
	$GLOBALS['monstroid_wizard'] = new monstroid_wizard();

}