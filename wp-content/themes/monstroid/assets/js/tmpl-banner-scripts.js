(function() {
	"use strict";
	jQuery('.row.flex-row').find('.cherry-banner').each(function(){
		var el = jQuery(this),
			bannerBackground = el.find('.cherry-banner_wrap').css(['background-color']);

		el.parent().css(bannerBackground);
	})
}());