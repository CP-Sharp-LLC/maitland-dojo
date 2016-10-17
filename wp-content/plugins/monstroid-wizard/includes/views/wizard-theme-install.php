<?php
/**
 * Represents the view for the administration dashboard.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end user.
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

global $monstroid_wizard;

// validate auth data (theme name, key and installation type) before show anything to user
$cherry_auth_data = $monstroid_wizard->check_auth_data();
if ( !$cherry_auth_data ) {
	return;
}

if ( isset( $monstroid_wizard->install_handler->install_type ) ) {
	$install_type = $monstroid_wizard->install_handler->install_type;
} else {
	$install_type = 'demo';
}

switch ( $install_type ) {
	case 'premium':
		$theme_type = __( 'Premium', $monstroid_wizard->slug );
		break;

	case 'demo':
		$theme_type = __( 'Demo', $monstroid_wizard->slug );
		break;

	default:
		$theme_type = __( 'Undefined', $monstroid_wizard->slug );
		break;
}

?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">

		<?php
			if ( isset( $monstroid_wizard->install_handler ) ) :
		?>

		<?php

			$install_class = 'allowed';

			if ( 'warning' == $monstroid_wizard->server_settings ) {
				$install_class = 'manually-allow';
			}

			if ( 'error' == $monstroid_wizard->server_settings ) {
				$install_class = 'denied';
			}

			if ( 'error' == $monstroid_wizard->dir_permissions ) {
				$install_class = 'denied';
			}

		?>
		<div class="box-default_ content-wrap_">

			<?php monstroid_wizard_interface()->get_prev_link(); ?>

			<h2 class="main-title_">
				<?php _e( 'Theme &amp; Plugins Installation', $monstroid_wizard->slug ); ?>
			</h2>
			<?php
				_e( 'Installing Cherry Framework, child theme and plugins.', $monstroid_wizard->slug );
				do_action( 'monstroid_wizard_install_notices' );
			?>
		</div>
		<div class="box-default_ alt-box_ content-wrap_">

			<?php
				/**
				 * Hook monstroid_wizard_progress_bar
				 * Fires insed install box
				 *
				 * hooked:
				 * @monstroid_wizard_install_progress - 10
				 */
				do_action( 'monstroid_wizard_progress_bar' );

				// prepare next step URL
				$next_step = add_query_arg(
					array(
						'step' => 'content-install',
						'type' => $install_type
					),
					menu_page_url( $monstroid_wizard->slug, false )
				);
			?>
			<div class="wizard-installation box-inner_ <?php echo $install_class; ?>" data-install-type="<?php echo esc_attr( $install_type ); ?>">
				<div id="cherry-wizard-retry-trigger" class="hidden_ wizard-retry">
					<a href="<?php echo $_SERVER['REQUEST_URI']; ?>">
						<?php _e( 'Retry', $monstroid_wizard->slug ); ?>
					</a>
				</div>
				<?php

				$first_step = apply_filters(
					'monstroid_wizard_first_step',
					array(
						'step'      => 'install-framework',
						'last_step' => 'no',
						'label'     => __( 'Installing Cherry framework', $monstroid_wizard->slug ),
						'plugin'    => '',
					)
				);

				// Show first step
				echo $monstroid_wizard->install_handler->step(
					$first_step['step'], $first_step['last_step'], $first_step['label'], $first_step['plugin']
				);

				?>
			</div>
		</div>
		<?php
			// do anything if installation type not provided
			else :
		?>
		<div class="box-default_ content-wrap_">
			<p>Select installation type - premium theme or demo</p>
		</div>
		<?php endif; ?>
	</div>
</div>
