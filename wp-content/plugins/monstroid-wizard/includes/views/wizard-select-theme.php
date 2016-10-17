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

?>
<div class="wrap">
	<div class="<?php echo $monstroid_wizard->ui_wrapper_class( array( 'cherry-wizard_' ) ); ?>">
		<div class="box-default_ content-wrap_">
			<a href="<?php echo $monstroid_wizard->get_step_url( 'select-type' ); ?>" class="back-button_">
				<span class="dashicons dashicons-arrow-left-alt2"></span>
				<?php _e( 'Back', $monstroid_wizard->slug ); ?>
			</a>
			<h2 class="main-title_">
				<?php _e( 'Select theme to install', $monstroid_wizard->slug ); ?>
			</h2>
			<p>
				<?php
					_e( 'If you have installed the Monstroid theme or any other child theme fr om the Monstroid pack, please remove your posts, pages and uploads prior proceeding with new Monstroid/child theme installation to avoid issues and content duplication.', $monstroid_wizard->slug );
				?>
			</p>
			<?php
			/*
			<div class="themes-list-search">
				<input type="search" value="" placeholder="<?php _e( 'Search Topic', $monstroid_wizard->slug ); ?>">
				<a href="#"><?php _e( 'Search', $monstroid_wizard->slug ); ?></a>
			</div>
			*/
			?>
		</div>
		<div class="box-default_ alt-box_ content-wrap_">
			<div class="themes-list">
				<div class="wizard-row">
				<?php
					$themes_api = Monstroid_Wizard_Themes_List::get_instance();
					echo $themes_api->get_themes();
				?>
				</div>
				<?php
					echo $themes_api->get_pager();
				?>
			</div>
		</div>
	</div>
</div>
