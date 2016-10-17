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

/**
 * Hook fires on installation last step
 *
 * @hooked monstroid_wizard_set_install_status - 10
 */
do_action( 'monstroid_wizard_all_done' );

?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">
		<div class="box-default_ box-default_ content-box install-finished_">
			<h3><?php _e( 'Congratulations', $monstroid_wizard->slug ); ?></h3>
			<div class="install-finished-text_">
				<?php _e( 'You have successfully installed your new theme with sample data.', $monstroid_wizard->slug ); ?>
			</div>
			<div class="install-finished-actions_">
				<a class="button-default_" href="<?php echo home_url(); ?>"><?php _e( 'View your site', $monstroid_wizard->slug ); ?></a>
				<a class="button-primary_" href="<?php echo menu_page_url( 'options', false ); ?>" target="_parent"><?php _e( 'Go to Cherry Options', $monstroid_wizard->slug ); ?></a>
			</div>
		</div>
	</div>
</div>