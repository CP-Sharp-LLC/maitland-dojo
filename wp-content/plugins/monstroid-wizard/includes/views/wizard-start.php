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
$nonce = wp_create_nonce( 'monstroid_wizard' );
?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">

		<div id="cherry-wizard-start-install-form" class="box-default_ content-wrap_">

			<h2 class="main-title_"><?php _e( 'Welcome to Monstroid Installation!', $monstroid_wizard->slug ); ?></h2>

			<?php
				if ( ! $monstroid_wizard->is_compatible_wp_version() ) :
			?>
			<div class="warning-box_">
				<p>
					<?php _e( 'Please make sure your WordPress is upgraded to version <b>4.2.2</b> or later. This version contains vital security and stability updates required for the correct work of Cherry Framework.', $monstroid_wizard->slug ); ?>
				</p>
			</div>
			<?php endif; ?>
			<?php
				if ( true !== $monstroid_wizard->check_filesystem_method() ) :
			?>
			<div class="warning-box_">
				<p>
					<?php _e( 'Direct write access not allowed on your server. Please, contact our support team to continue installation.', $monstroid_wizard->slug ); ?>
				</p>
			</div>
			<?php endif; ?>
			<p>
				<?php _e( 'Please input license key to begin theme installation. Please note: you can use a single license key for no more than <b><a href="http://info.template-help.com/help/quick-start-guide/wordpress-themes/monstroid/index.php?lang=en&section=extras#license-faqs">1 domain</a></b>.', $monstroid_wizard->slug ); ?>
			</p>

			<!-- Premium installation form -->
			<form action="" method="post" id="cherry-wizard-premium-install">
				<input type="hidden" name="_wpnonce" value="<?php echo $nonce; ?>">
				<div class="wizard-form-row_">
					<div class="wizard-form-col-label_">
						<label for="cherry-theme-key"><?php _e( 'Activation Key', $monstroid_wizard->slug ); ?></label>
					</div>
					<div class="wizard-form-col-control_">
						<input type="text" name="theme_key" id="cherry-theme-key" value="" placeholder="<?php _e( 'Enter theme activation key', $monstroid_wizard->slug ); ?>">
					</div>
				</div>
				<div class="wizard-form-row_ submit-row_">
					<?php if ( $monstroid_wizard->is_compatible_wp_version() && true === $monstroid_wizard->check_filesystem_method() ) : ?>
					<a href="#" class="button-primary_ button-small" id="start_install_btn"><?php _e( 'Start', $monstroid_wizard->slug ); ?></a>
					<?php endif; ?>
				</div>
			</form>
			<!-- Premium installation form end -->

			<!-- Request sample data by Oreder ID -->
			<div class="wizard-restore-key hidden_" id="cherry-wizrd-restore-key">
				<?php _e( 'Get theme key', $monstroid_wizard->slug ); ?>
				<input type="text" class="wizard-user-order" value="" placeholder="<?php _e( 'Order ID', $monstroid_wizard->slug ); ?>">
				<a href="#" class="button-primary_" id="start_demo_install_btn"><?php _e( 'Request', $monstroid_wizard->slug ); ?></a>
			</div>
			<!-- Request sample data by Oreder ID end -->
		</div>

	</div>
</div>