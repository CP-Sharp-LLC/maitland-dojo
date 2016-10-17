<?php
/**
 * Sets up the admin functionality for the plugin.
 *
 * @package   Cherry Sidebar Manager
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

/**
 * Class for admin functionally.
 *
 * @since 1.0.0
 */
class Cherry_Custom_Sidebars_Admin {

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

		// Load admin javascript and stylesheet.
		add_action( 'admin_enqueue_scripts', array( $this, 'add_admin_assets' ), 1 );

		add_action( 'admin_init', array( $this, 'widgets_ajax_page' ) );
		add_action( 'sidebar_admin_setup', array( $this, 'registrates_custom_sidebar' ) );
		add_action( 'widgets_admin_page', array( $this, 'edit_wp_registered_sidebars' ) );
		add_action( 'sidebar_admin_page', array( $this, 'widgets_page' ) );
	}

	/**
	 * Register and Enqueue admin-specific stylesheet and javascript.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_assets( $hook_suffix ) {

		if ( 'widgets.php' === $hook_suffix ) {
			wp_register_script( 'cherry_admin_custom_sidebars_js', trailingslashit( CHERRY_CUSTOM_SIDEBARS_URI ) . 'admin/assets/js/min/cherry-admin-sidebar-manager.min.js', array( 'jquery' ), CHERRY_CUSTOM_SIDEBARS_VERSION, true );
			wp_register_style( 'cherry_admin_custom_sidebars_css', trailingslashit( CHERRY_CUSTOM_SIDEBARS_URI ) . 'admin/assets/css/cherry-admin-sidebar-manager.css', array(), CHERRY_CUSTOM_SIDEBARS_VERSION, 'all' );

			wp_register_style( 'interface-builder', trailingslashit( CHERRY_CUSTOM_SIDEBARS_URI ) . 'admin/assets/css/interface-builder.css', array(), CHERRY_CUSTOM_SIDEBARS_VERSION, 'all' );

			$cherry_framework_objact = array( 'ajax_nonce_new_sidebar' => wp_create_nonce( 'new_custom_sidebar' ) , 'ajax_nonce_remove_sidebar' => wp_create_nonce( 'remove_custom_sidebar' ) );
			wp_localize_script( 'cherry_admin_custom_sidebars_js', 'cherryFramework', $cherry_framework_objact );

			wp_enqueue_script( 'cherry_admin_custom_sidebars_js' );
			wp_enqueue_style( 'cherry_admin_custom_sidebars_css' );
			wp_enqueue_style( 'interface-builder' );

		} elseif ( false !== strpos( $hook_suffix, 'post' ) ) {
			wp_register_style( 'cherry-sidebar-manager-post-page', trailingslashit( CHERRY_CUSTOM_SIDEBARS_URI ) . 'admin/assets/css/cherry-sidebar-manager-post-page.css', array(), CHERRY_CUSTOM_SIDEBARS_VERSION, 'all' );
			wp_enqueue_style( 'cherry-sidebar-manager-post-page' );
		}
	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 */
	public function widgets_page() {
		require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'admin/views/cherry-widgets-page.php' );
	}

	/**
	 * Registration new custom sidebars.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function registrates_custom_sidebar() {
		global $wp_registered_sidebars;

		$Cherry_Custom_Sidebars_Methods = new Cherry_Custom_Sidebars_Methods();
		$cusotm_sidebar_array = $Cherry_Custom_Sidebars_Methods -> get_custom_sidebar_array();
		unset( $cusotm_sidebar_array['cherry-sidebar-manager-counter'] );

		$wp_registered_sidebars = array_merge( $wp_registered_sidebars, $cusotm_sidebar_array );
	}

	/**
	 * Editing registered sidebars.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function edit_wp_registered_sidebars() {
		global $wp_registered_sidebars;

		$Cherry_Custom_Sidebars_Methods = new Cherry_Custom_Sidebars_Methods();
		$cusotm_sidebar_array = $Cherry_Custom_Sidebars_Methods->get_custom_sidebar_array();
		unset( $cusotm_sidebar_array['cherry-sidebar-manager-counter'] );
		$sidebar_array_lengh = count( $cusotm_sidebar_array );

		foreach ( $cusotm_sidebar_array as $sidebar => $cusotm_sidebar ) {
			unset( $wp_registered_sidebars[ $sidebar ] );
		}
	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 */
	public function widgets_ajax_page() {
		require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'admin/views/cherry-sidebare-to-page.php' );
		require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'admin/views/cherry-new-sidebar-manager.php' );
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

Cherry_Custom_Sidebars_Admin::get_instance();
