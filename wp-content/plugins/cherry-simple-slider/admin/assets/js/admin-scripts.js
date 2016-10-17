jQuery(document).ready(function() {
	var
		postFormat
	,	ajaxRequest = null
	,	ajaxRequestSuccess = true
	,	ajaxRequestFunction = null
	,	settingsContainer = jQuery('#cherry-slider-post-format-options')
	;

	settingsContainer.append('<div class="ajax-loader"><div class="cherry-spinner cherry-spinner-wave"><div class="cherry-rect1"></div><div class="cherry-rect2"></div><div class="cherry-rect3"></div><div class="cherry-rect4"></div><div class="cherry-rect5"></div></div></div>');

	jQuery('#formatdiv #post-formats-select input').on('click', function(){
		var formatClass
		postFormat = jQuery(this).val();
		if(postFormat == '0'){ postFormat = 'standart'; }

		if( jQuery('.'+postFormat+'-post-format-settings', settingsContainer).length != 0 ){
			jQuery('.inside .settings-item', settingsContainer).hide();
			jQuery('.'+postFormat+'-post-format-settings', settingsContainer).fadeIn();
		}else{
			ajaxRequestFunction();
		}

	})

	ajaxRequestFunction = function(){
		var
			data = {
				action: 'get_slider_format_metabox',
				post_format: postFormat,
				post_id : jQuery('#post_ID').val()
			};

			if( ajaxRequest != null && ajaxRequestSuccess){
				ajaxRequest.abort();
			}

			ajaxRequest = jQuery.ajax({
				type: 'POST',
				url: ajaxurl,
				data: data,
				cache: false,
				beforeSend: function(){
					ajaxRequestSuccess = false;
					jQuery('.ajax-loader', settingsContainer).fadeIn();
				},
				success: function(response){
					ajaxRequestSuccess = true;
					jQuery('.ajax-loader', settingsContainer).hide();
					jQuery('.inside .settings-item', settingsContainer).hide();
					jQuery('.inside', settingsContainer).prepend( response );

					CHERRY_API.interface_builder.init( jQuery('.inside .settings-item', settingsContainer).eq(0) );
				},
				dataType: 'html'
			});
	}
});