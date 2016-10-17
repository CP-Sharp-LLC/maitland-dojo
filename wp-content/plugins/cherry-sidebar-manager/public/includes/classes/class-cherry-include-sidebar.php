<?php
/**
 * Cherry Include Custom Sidebar.
 *
 * @package   Cherry Sidebar Manager
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 **/

if ( ! class_exists( 'Cherry_Include_Custom_Sidebar' ) ) {

	/**
	 * Class for Include Custom Sidebar.
	 *
	 * @since 1.0.0
	 */
	class Cherry_Include_Custom_Sidebar {

		/**
		 * Holds the instances of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Post sidebar list.
		 *
		 * @var null
		 */
		private $post_sidebars = null;

		/**
		 * Sets up our actions/filters.
		 *
		 * @since 1.0.0
		 */
		public function __construct() {
			add_action( 'cherry_content', array( $this, 'set_custom_sidebar' ) );
		}

		/**
		 * Set custom sidebar in global array $wp_registered_sidebars.
		 *
		 * @since 1.0.0
		 */
		public function set_custom_sidebar() {
			global $wp_registered_sidebars;

			$object_id = get_queried_object_id();
			$this->post_sidebars = get_post_meta( apply_filters( 'cherry_sidebar_manager_object_id', $object_id ), 'post_sidebar', true );

			if ( is_array( $this->post_sidebars ) ) {

				$Cherry_Custom_Sidebars_Methods = new Cherry_Custom_Sidebars_Methods();
				$custom_sidebar_array = $Cherry_Custom_Sidebars_Methods->get_custom_sidebar_array();
				unset( $custom_sidebar_array['cherry-sidebar-manager-counter'] );

				$wp_registered_sidebars = array_merge( $wp_registered_sidebars, $custom_sidebar_array );

				add_filter( 'cherry_get_main_sidebar', array( $this, 'set_main_sidebar' ), 1, 1 );
				add_filter( 'cherry_get_secondary_sidebar', array( $this, 'set_secondary_sidebar' ), 1, 1 );
			}
		}

		/**
		 * Set main sidebar in variable cherry_get_main_sidebar.
		 *
		 * @since 1.0.0
		 * @param  string $sidebar  Current sidebar id.
		 * @return string $sidebar  main sidebar id.
		 */
		public function set_main_sidebar( $sidebar ) {

			if ( empty( $this->post_sidebars['cherry-post-main-sidebar'] ) ) {
				return $sidebar;
			}

			$new_sidebar = $this->post_sidebars['cherry-post-main-sidebar'];

			if ( $new_sidebar ) {
				$sidebar = $new_sidebar;
			}

			return $sidebar;
		}

		/**
		 * Set main sidebar in variable cherry_get_secondary_sidebar.
		 *
		 * @since 1.0.0
		 * @param  string $sidebar  Current sidebar id.
		 * @return string $sidebar  Secondary sidebar id.
		 */
		public function set_secondary_sidebar( $sidebar ) {

			if ( empty( $this->post_sidebars['cherry-post-secondary-sidebar'] ) ) {
				return $sidebar;
			}

			$new_sidebar = $this->post_sidebars['cherry-post-secondary-sidebar'];

			if ( $new_sidebar ) {
				$sidebar = $new_sidebar;
			}

			return $sidebar;
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

	Cherry_Include_Custom_Sidebar::get_instance();
}
?>
