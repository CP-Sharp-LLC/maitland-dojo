<?php
/**
 * Advanced install page template
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

global $monstroid_wizard;
?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">

		<div id="cherry-wizard-start-install-form" class="box-default_ content-wrap_">

			<?php monstroid_wizard_interface()->get_prev_link(); ?>

			<h2 class="main-title_">
				<?php _e( 'Advanced Theme & Plugins Installation', $monstroid_wizard->slug ); ?>
			</h2>

			<p><b>Warning:</b> Please note, if you will not install all required plugins, your website may look different besides theme demo. So we are strongly recommend to install all required plugins.</p>

			<?php
				monstroid_wizard_advanced_install()->get_required_plugins();
			?>

			<div class="monstroid-wizard-adv-switcher">
				<div class="monstroid-wizard-adv-switcher_label">
					<label>
						<input type="radio" name="advanced_install_type" value="full" checked>
						<?php _e( 'Install full package', $monstroid_wizard->slug ); ?>
					</label>
				</div>
				<div class="monstroid-wizard-adv-switcher_label">
					<label>
						<input type="radio" name="advanced_install_type" value="advanced">
						<?php _e( 'Install lite package (without shop)', $monstroid_wizard->slug ); ?>
					</label>
				</div>
			</div>

			<a href="#" class="button-primary_ button-small" id="start_advanced_install">
				<?php _e( 'Start', $monstroid_wizard->slug ); ?>
			</a>

		</div>

	</div>
</div>