/**
 * Make redirect on import end
 */
jQuery(document).ready(function($) {
	$(document).on('cherry_data_manager_import_end', function(event) {
		event.preventDefault();
		window.location = monstroid_wizard_steps.success;
	});

	$(document).on('cherry_data_manager_start_install', function(event) {

		var $button  = $('.back-button_'),
			back_alt = $button.data('alt-step');

		$button.attr( 'href', back_alt );
	});
})