<?php
/**
 * Represents the view for the administration dashboard.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end user.
 *
 * @package   cherry_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

global $monstroid_wizard;

// validate auth data (theme name, key and installation type) before show anything to user
/*$cherry_auth_data = $cherry_wizard->check_auth_data();
if ( !$cherry_auth_data ) {
	return;
}*/

$step_theme = add_query_arg(
	array(
		'step' => 'select-theme',
		'type' => 'premium'
	),
	menu_page_url( $monstroid_wizard->slug, false )
);

?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">
		<div class="box-default_ content-wrap_">
			<h2 class="main-title_">
				<?php _e( 'Please, select the installation process', $monstroid_wizard->slug ); ?>
			</h2>
			<p>
				<?php _e( 'Please, choose the theme you would like to install. You can install full Monstroid pack which includes all pages, plugins, sample content etc or install any other child theme included within the Monstroid template package.', $monstroid_wizard->slug ); ?>
			</p>
		</div>
		<div class="box-default_ alt-box_ content-wrap_ select-type_">
			<div class="wizard-row">
				<div class="wizard-col-2">
					<div class="wizard-theme-item">
						<h4 class="wizard-theme-item-title">
							<?php _e( 'Install Monstroid Main Theme', $monstroid_wizard->slug ); ?>
						</h4>
						<div class="wizard-theme-item-thumb">
							<img src="<?php echo MONSTROID_WIZARD_URI . 'assets/images/monstroid-screen.png'; ?>" alt="">
						</div>
						<div class="wizard-theme-item-actions">
							<a href="#" class="install-monstroid button-primary_">
								<span class="dashicons dashicons-download"></span>
								<?php _e( 'Install', $monstroid_wizard->slug ); ?>
							</a>
							<div class="wizard-advanced-install-box">
								<input type="checkbox" id="wizard-advanced-install">
								<label class="wizard-advanced-install" for="wizard-advanced-install">
									<?php _e( 'Advanced install', $monstroid_wizard->slug ); ?>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div class="wizard-col-2">
					<div class="wizard-theme-item">
						<h4 class="wizard-theme-item-title">
							<?php _e( 'Install One of Child Themes', $monstroid_wizard->slug ); ?>
						</h4>
						<div class="wizard-theme-item-thumb">
							<img src="<?php echo MONSTROID_WIZARD_URI . 'assets/images/child-screen.png'; ?>" alt="">
						</div>
						<div class="wizard-theme-item-actions">
							<a href="<?php echo $step_theme; ?>" class="install-child button-default_">
								<span class="dashicons dashicons-download"></span>
								<?php _e( 'Install', $monstroid_wizard->slug ); ?>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
