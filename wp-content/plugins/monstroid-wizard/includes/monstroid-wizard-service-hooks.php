<?php
/**
 * Add some service actions and filters
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Assign necessary function to hooks
 */

// Remove WooCommerce notice
add_action( 'monstroid_wizard_required_plugin_active', 'monstroid_wizard_skip_install_woocommerce_pages' );
// Save theme installation progress
add_action( 'monstroid_wizard_theme_install_complete', 'monstroid_wizard_theme_install_complete' );
// Save content installation progress
add_action( 'cherry_data_manager_install_complete', 'monstroid_wizard_content_import_complete' );
// Show instllation progress HTML markup
add_action( 'monstroid_wizard_progress_bar', 'monstroid_wizard_install_progress' );
// Set import status on installation step #3
add_action( 'monstroid_wizard_all_done', 'monstroid_wizard_set_install_status' );
// Set skip sample data import URL
add_filter( 'cherry_data_manager_cancel_import_url', 'monstroid_wizard_skip_sample_data_url' );
// Set monstroid UI class for data-manger related pages
add_filter( 'cherry_ui_wrapper_class', 'monstroid_wizard_add_ui_wrapper', 10, 2 );
// Show DM screen
add_filter( 'cherry_data_manager_import_type_before', 'monstroid_wizard_add_sample_screen' );
// Show back to previous step button on content install pages
add_action( 'cherry_data_manager_before_title', 'monstroid_wizard_content_install_back' );
// Set package-specific installation type
add_action( 'admin_init', 'monstroid_wizard_set_package_type' );

/**
 * Set package-specific installation type
 *
 * @return void|null
 */
function monstroid_wizard_set_package_type() {

	if ( empty( $_REQUEST['package'] ) ) {
		return null;
	}

	if ( ! session_id() ) {
		session_start();
	}

	$_SESSION['monstroid_install_type'] = esc_attr( $_REQUEST['package'] );

}

/**
 * Prevent woocommerce install pages notice appearing. Remove it right away after woocommerce installation
 *
 * @since  1.0.0
 * @param  string  $plugin  installed plugin slug
 */
function monstroid_wizard_skip_install_woocommerce_pages( $plugin = null ) {

	// Do nothing if is not WooCommerce
	if ( ! $plugin || 'woocommerce' != $plugin ) {
		return;
	}

	$notices = array_diff( get_option( 'woocommerce_admin_notices', array() ), array( 'install', 'tracking' ) );
	update_option( 'woocommerce_admin_notices', $notices );
	delete_transient( '_wc_activation_redirect' );

}

/**
 * Set wizard installation step. Save theme install progress
 *
 * @since 1.0.0
 */
function monstroid_wizard_theme_install_complete() {

	global $monstroid_wizard;

	if ( !$monstroid_wizard->cherry_theme_name ) {
		return;
	}

	$current_progress = get_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name );

	$current_progress['theme_installed'] = 'complete';

	update_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name, $current_progress );

}

/**
 * Set wizard installation step. Save content install progress
 *
 * @since 1.0.0
 */
function monstroid_wizard_content_import_complete() {

	global $monstroid_wizard;

	if ( !$monstroid_wizard->cherry_theme_name ) {
		return;
	}

	$current_progress = get_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name );

	$current_progress['content_installed'] = 'complete';

	update_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name, $current_progress );

}

/**
 * Set install stataus on wizard lats step
 *
 * @since 1.0.0
 */
function monstroid_wizard_set_install_status() {

	global $monstroid_wizard;
	$current_progress = get_option( 'monstroid_wizard_install_log_' . $monstroid_wizard->cherry_theme_name );
	$skip_sample_data = isset( $_GET['skip_sample_data_install'] ) ? $_GET['skip_sample_data_install'] : false;

	if ( !isset( $current_progress['theme_installed'] ) || 'complete' != $current_progress['theme_installed'] ) {
		return;
	}

	if ( ( !isset( $current_progress['content_installed'] ) || 'complete' != $current_progress['theme_installed'] ) && !$skip_sample_data ) {
		return;
	}

	delete_option( 'monstroid_wizard_need_install' );

}

/**
 * Show installation progress HTML markup
 *
 * @since 1.0.0
 *
 * @param boolean $is_plugins        is markup only for plugins section or not
 * @param array   $required_plugins  requierd plugins array
 */
function monstroid_wizard_install_progress( $is_plugins = false, $required_plugins = array() ) {

	global $monstroid_wizard;

	if ( $is_plugins ) {
		$result = '';

		if ( is_array( $required_plugins ) && !empty( $required_plugins ) ) {
			foreach ( $required_plugins as $plugin_name => $plugin_data ) {
				$result .= '<div class="wizard-install-progress-step empty" data-step="' . $plugin_name . '"></div>';
			}
		}

		return $result;
	}

	if ( !isset( $monstroid_wizard->install_handler ) ) {
		return;
	}

	$install_groups = $monstroid_wizard->install_handler->get_install_groups();

	if ( ! isset( $install_groups ) || ! is_array( $install_groups ) ) {
		return;
	}

	echo '<div class="progress-bar-counter_" id="theme-install-progress" data-progress="0"><span>0</span>% ' . __( 'complete', $monstroid_wizard->slug ) . '</div>';

	echo '<div class="wizard-install-progress progress-bar_">';

	foreach ( $install_groups as $install_group_name => $install_group ) {

		if ( !is_array( $install_group ) ) {
			continue;
		}

		echo '<div class="wizard-install-progress-group" data-group="' . $install_group_name . '" data-group-count="' . count( $install_group ) . '">';
			foreach ( $install_group as $step ) {
				echo '<div class="wizard-install-progress-step empty" data-step="' . $step . '"></div>';
			}
		echo '</div>';
	}

	echo '</div>';

}

/**
 * Set skip sample data button url for Data Manager plugin
 *
 * @since  1.0.0
 *
 * @param  string $url default URL
 * @return string      new URL
 */
function monstroid_wizard_skip_sample_data_url( $url ) {
	global $monstroid_wizard;
	$type = isset( $_GET['type'] ) ? $_GET['type'] : 'demo';
	return add_query_arg(
		array(
			'step' => 'success',
			'type' => $type,
			'skip_sample_data_install' => true
		),
		menu_page_url( $monstroid_wizard->slug, false )
	);
}

/**
 * Add to monstroid UI wrap for data manager
 *
 * @since  1.0.0
 *
 * @param  array  $classes default UI classes array
 * @param  string $slug    plugin specific class
 * @return array
 */
function monstroid_wizard_add_ui_wrapper( $classes, $slug = null ) {

	if ( ! $slug || 'data-manager' !== $slug ) {
		return $classes;
	}

	if ( ( $key = array_search( 'cherry-ui-core', $classes ) ) !== false ) {
		unset( $classes[$key] );
	}

	$classes[] = 'monstroid-ui-core';

	return $classes;

}

/**
 * Add sample data installation screen to install type selector page
 *
 * @since  1.0.0
 * @return void
 */
function monstroid_wizard_add_sample_screen() {

	$url = MONSTROID_WIZARD_URI . 'assets/images/install-sample-data-screen.png';

	$is_full_install = true;

	if ( isset( $_SESSION['monstroid_install_type'] ) && 'full' !== $_SESSION['monstroid_install_type'] ) {
		$is_full_install = false;
	}

	if ( $is_full_install && isset( $_SESSION['cherry_screens'] ) ) {
		foreach ( $_SESSION['cherry_screens'] as $id => $screen ) {
			$url = $screen;
			break;
		}
	}
	?>
	<div class="sample-screen">
		<img src="<?php echo $url; ?>" alt="">
	</div>
	<?php
}

/**
 * Show back to previous step button on content install pages
 *
 * @since  1.0.0
 * @return void
 */
function monstroid_wizard_content_install_back() {
	global $monstroid_wizard;

	$back     = $monstroid_wizard->get_step_url( 'theme-install' );
	$back_alt = $monstroid_wizard->get_step_url( 'content-install' );;
	?>
	<a href="<?php echo $back; ?>" data-alt-step="<?php echo $back_alt; ?>" class="back-button_">
		<span class="dashicons dashicons-arrow-left-alt2"></span>
		<?php _e( 'Back', $monstroid_wizard->slug ); ?>
	</a>
	<?php
}