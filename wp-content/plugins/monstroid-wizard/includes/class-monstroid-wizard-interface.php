<?php
/**
 * Add admin interface
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Monstroid_Wizard_Interface' ) ) {

	/**
	 * Add admin interface
	 *
	 * @since 1.0.0
	 */
	class Monstroid_Wizard_Interface {

		/**
		 * Specific controller files for different views
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		public $add_files = array();

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.1.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Constructor for the class
		 */
		function __construct() {

			$this->add_files = array(
				'theme-install'    => MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-install-handlers.php',
				'advanced-install' => MONSTROID_WIZARD_DIR . 'includes/class-monstroid-wizard-advanced-install.php',
			);

			// Add the wizard page and menu item.
			add_action( 'admin_menu', array( $this, 'add_wizard_admin_menu' ) );

			add_action( 'init', array( $this, 'redirect_after_install' ) );

		}

		/**
		 * Redirect to select install type select when key exists
		 *
		 * @since  1.0.0
		 */
		function redirect_after_install() {

			global $monstroid_wizard;

			if ( ! isset( $_GET['page'] ) || $monstroid_wizard->slug !== $_GET['page'] ) {
				return;
			}

			if ( isset( $_GET['step'] ) ) {
				return;
			}

			$key_exists = get_option( 'monstroid_key' );

			if ( false == $key_exists ) {
				return;
			}

			$url         = admin_url( 'tools.php' );
			$select_type = add_query_arg(
				array(
					'page' => $monstroid_wizard->slug,
					'step' => 'select-type',
					'type' => 'premium'
				),
				$url
			);

			wp_redirect( $select_type );
			die();

		}

		/**
		 * Register the administration menu for this plugin into the WordPress Dashboard menu.
		 *
		 * @since 1.0.0
		 */
		public function add_wizard_admin_menu() {
			global $monstroid_wizard;

			add_management_page(
				__( 'Monstroid Wizard', $monstroid_wizard->slug ),
				__( 'Monstroid Wizard', $monstroid_wizard->slug ),
				'manage_options',
				$monstroid_wizard->slug,
				array( $this, 'display_plugin_admin_page' )
			);
		}

		/**
		 * Set theme install prev step
		 *
		 * @param string $step current step name
		 */
		public function set_prev_step( $step ) {

			if ( ! $step ) {
				return;
			}

			if ( in_array( $step, array( 'select-type', 'select-theme' ) ) ) {
				$_SESSION['cherry_prev_step'] = $step;
			}
		}

		/**
		 * Get prev page link URL.
		 * @return void
		 */
		public function get_prev_link() {

			global $monstroid_wizard;

			$step = isset( $_SESSION['cherry_prev_step'] ) ? $_SESSION['cherry_prev_step'] : 'select-type';
			?>
			<a href="<?php echo $monstroid_wizard->get_step_url( $step ); ?>" class="back-button_">
				<span class="dashicons dashicons-arrow-left-alt2"></span>
				<?php _e( 'Back', $monstroid_wizard->slug ); ?>
			</a>
			<?php
		}

		/**
		 * show wizard management page
		 *
		 * @since 1.0.0
		 */
		public function display_plugin_admin_page() {

			$step = isset($_GET['step']) ? $_GET['step'] : '';

			if ( $step && isset( $this->add_files[$step] ) ) {
				require_once $this->add_files[$step];
			}

			if ( $step && file_exists( MONSTROID_WIZARD_DIR . 'includes/views/wizard-' . $step . '.php' ) ) {
				$this->set_prev_step( $step );
				include_once( MONSTROID_WIZARD_DIR . 'includes/views/wizard-' . $step . '.php' );
				return true;
			}

			include_once( MONSTROID_WIZARD_DIR . 'includes/views/wizard-start.php' );

		}

		/**
		 * Returns the instance.
		 *
		 * @since  1.1.0
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

	/**
	 * Return instanse of 'Monstroid_Wizard_Interface' class
	 */
	function monstroid_wizard_interface() {
		return Monstroid_Wizard_Interface::get_instance();
	}

	monstroid_wizard_interface();

}
