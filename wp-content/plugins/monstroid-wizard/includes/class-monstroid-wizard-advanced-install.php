<?php
/**
 * Define advanced install related
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Monstroid_Wizard_Advanced_Install' ) ) {

	/**
	 * Advanced installation management class
	 */
	class Monstroid_Wizard_Advanced_Install {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.1.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Registered plugins array
		 *
		 * @since 1.1.0
		 * @var   null
		 */
		public $registered_plugins = null;

		/**
		 * Optional plugins
		 *
		 * @since 1.1.0
		 * @var   null
		 */
		public $optional_plugins = null;

		/**
		 * required plugins
		 *
		 * @since 1.1.0
		 * @var   null
		 */
		public $required_plugins = null;

		/**
		 * Constructor for the class
		 */
		function __construct() {

		}

		/**
		 * Get registered plugin array
		 *
		 * @since  1.1.0
		 * @return array
		 */
		public function get_registered_plugins() {

			if ( null !== $this->registered_plugins ) {
				return $this->registered_plugins;
			}

			$this->registered_plugins = apply_filters( 'cherry_theme_required_plugins', array() );

			return $this->registered_plugins;
		}

		/**
		 * Get plugins array for optional installation
		 *
		 * @since  1.1.0
		 * @return array
		 */
		public function get_optional_plugins() {

			if ( null !== $this->optional_plugins ) {
				return $this->optional_plugins;
			}

			$this->optional_plugins = array_filter(
				$this->get_registered_plugins(),
				array( $this, '__check_optional' )
			);

			return $this->optional_plugins;

		}

		/**
		 * Get plugins array for required installation
		 *
		 * @since  1.1.0
		 * @return array
		 */
		public function get_required_plugins() {

			if ( null !== $this->required_plugins ) {
				return $this->required_plugins;
			}

			$this->required_plugins = array_filter(
				$this->get_registered_plugins(),
				array( $this, '__check_required' )
			);

			return $this->required_plugins;
		}

		/**
		 * Check if is required plugin
		 *
		 * @since  1.1.0
		 * @param  array $value registered plugins array item.
		 * @return bool
		 */
		public function __check_required( $value ) {
			return ! $this->is_optional( $value );
		}

		/**
		 * Check if is optional plugin
		 *
		 * @since  1.1.0
		 * @param  array $value registered plugins array item.
		 * @return bool
		 */
		public function __check_optional() {
			return $this->is_optional( $value );
		}

		/**
		 * Check if current polugin is optional or required for installation
		 *
		 * @since  1.1.0
		 * @param  array $plugin current plugin data.
		 * @return boolean
		 */
		public function is_optional( $plugin ) {

			if ( isset( $plugin['optional'] ) && true === $plugin['optional'] ) {
				return true;
			}

			return false;
		}

		/**
		 * Get advanced installation plugins set by installation type
		 *
		 * @since 1.1.0
		 * @return array
		 */
		public function get_plugins_to_install() {

			$type = ! empty( $_SESSION['monstroid_install_type'] ) ? esc_attr( $_SESSION['monstroid_install_type'] ) : 'default';

			switch ( $type ) {
				case 'advanced':
					return $this->get_required_plugins();

				default:
					$plugins = apply_filters(
						'monstroid_wizard_set_' . $type . '_plugins',
						false, $this->get_registered_plugins()
					);

					if ( false !== $plugins ) {
						return $plugins;
					}
					break;
			}

			return $this->get_registered_plugins();
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

}

/**
 * Return instanse of 'Monstroid_Wizard_Advanced_Install' class
 */
function monstroid_wizard_advanced_install() {
	return Monstroid_Wizard_Advanced_Install::get_instance();
}

monstroid_wizard_advanced_install();
