/**
 * Service functions for Wizard
 */

"use strict";

jQuery(document).ready(function($) {

	var _cw_button     = $('#start_install_btn'),
		_cw_form       = $('#cherry-wizard-premium-install'),
		_cw_theme_key  = $('input[name="theme_key"]', _cw_form),
		_cw_nonce      = $('input[name="_wpnonce"]', _cw_form);


	_cw_theme_key.focus(function(event) {
		if ( $(this).hasClass('error') ) {
			$(this).removeClass('error').parent().find('.wizard-popup-message').fadeOut('300');
		}
	});

	function get_spinner( type ) {
		return '<span class="wizard-spinner ' + type + '"><span class="wizard-spinner-circle"></span></span>';
	}

	function cw_js_validate() {

		_cw_theme_key.removeClass('error');

		$( '.wizard-popup-message.error', _cw_form ).remove();

		var result = true;

		if ( _cw_theme_key.val() == null || _cw_theme_key.val() == '' ) {
			_cw_theme_key.addClass('error');
			result = false;
		}

		return result;
	}

	function cw_ajax_validate() {

		var _btn = $('#start_install_btn');

		_btn.after('<span class="spinner install-spinner" style="visibility:visible;"></span>');

		$.ajax({
			url: ajaxurl,
			type: "post",
			dataType: "json",
			data: {
				action: 'monstroid_wizard_validate_key',
				nonce:  _cw_nonce.val(),
				key:    _cw_theme_key.val()
			}
		}).done(function(responce) {

			if ( 'object' != typeof(responce) ) {
				cw_result_message( 'Unknown error', 'error', 'success', 'success' );
			}

			if ( responce.type == undefined ) {
				_btn.next('.spinner').remove();
				return false;
			}

			if ( responce.type == 'error' ) {
				_cw_theme_key.addClass(responce.key_class);
				cw_result_message( responce.message, responce.type, responce.key_class );
				_btn.next('.spinner').remove();
				return false;
			}
			cw_result_message( responce.message, responce.type );
			// redirect to next step on success
			window.location = monstroid_wizard_steps.select_type;
		});

	}

	function cw_result_message( message, type, key_result ) {

		if ( key_result == 'error' ) {
			if ( _cw_theme_key.next('.wizard-popup-message').length ) {
				_cw_theme_key.next('.wizard-popup-message').remove();
			}
			_cw_theme_key.after('<div class="wizard-popup-message ' + type + '">' + message + '</div>');
			return;
		}

		_cw_form.append('<div class="wizard-message ' + type + '">' + message + '</div>');
	}

	/**
	 * Validate theme key
	 */
	$(document).on('click', '#start_install_btn', function(event) {

		event.preventDefault();

		_cw_form.find('.wizard-message').remove();

		var validate = cw_js_validate();

		if ( false == validate ) {
			return false;
		}

		cw_ajax_validate();

	});

	/**
	 * Try to get theme child links and start installation
	 */
	$(document).on('click', '.wizard-theme-item-actions .install', function(event) {

		event.preventDefault();

		var $this = $(this),
			template_id = $this.data('template');

		if ( $this.hasClass('in-progress') ) {
			return !1;
		}

		$this.addClass('in-progress').prepend( get_spinner('spinner-type-primary') );

		$.ajax({
			url: ajaxurl,
			type: "post",
			dataType: "json",
			data: {
				action:      'monstroid_wizard_get_child_link',
				template_id: template_id
			}
		}).done(function(response) {
			$this.removeClass('in-progress');

			if ( response.type == 'success' ) {
				// redirect to next step on success
				window.location = monstroid_wizard_steps.theme_install;
			}
		});

	});

	/**
	 * Prepare main monstroid theme installation
	 */
	$(document).on( 'click', '.install-monstroid', function( event ) {

		var $this = $(this),
			installPath = monstroid_wizard_steps.theme_install;

		event.preventDefault();

		if ( $this.hasClass('in-progress') ) {
			return !1;
		}

		if ( document.getElementById( 'wizard-advanced-install' ).checked ) {
			installPath = monstroid_wizard_steps.advanced_install;
		}

		$this.addClass('in-progress').prepend( get_spinner('spinner-type-primary') );;

		$.ajax({
			url: ajaxurl,
			type: "post",
			dataType: "json",
			data: {
				action: 'monstroid_wizard_start_main_install'
			}
		}).done(function( response ) {
			$this.removeClass( 'in-progress' );

			if ( response.status == 'success' ) {

				// Redirect to next step on success
				window.location = installPath;
			}
		});

	});

	/**
	 * Prepare advanced monstroid theme installation
	 */
	$(document).on( 'click', '#start_advanced_install', function( event ) {

		var $this       = $(this),
			installPath = monstroid_wizard_steps.theme_install,
			installType = $( 'input[name="advanced_install_type"]:checked' ).val();

		event.preventDefault();

		if ( $this.hasClass('in-progress') ) {
			return !1;
		}

		$this.addClass('in-progress').prepend( get_spinner('spinner-type-primary') );;

		$.ajax({
			url: ajaxurl,
			type: "post",
			dataType: "json",
			data: {
				action: 'monstroid_wizard_start_advanced_install',
				type: installType
			}
		}).done(function( response ) {
			$this.removeClass( 'in-progress' );

			if ( response.status == 'success' ) {

				// Redirect to next step on success
				window.location = installPath;
			}
		});

	});

	/**
	 * Process themes pager
	 */
	$(document).on('click', '.wizard-pager-item-link', function(event) {

		event.preventDefault();

		var $this   = $(this),
			$result = $('.themes-list'),
			page    = $this.data('page');

		if ( $this.hasClass( 'disabled' ) || $this.hasClass('current-page') || $this.hasClass('in-progress') ) {
			return !1;
		}

		$this.addClass('in-progress');

		$.ajax({
			url: ajaxurl,
			type: "post",
			dataType: "html",
			data: {
				action: 'monstroid_wizard_get_themes_page',
				page: page
			}
		}).done(function(response) {
			$this.removeClass('in-progress');
			$result.html(response)
		});


	});

})