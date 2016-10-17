/**
 * Flat_scripts
 */
(function($){
	"use strict";

	CHERRY_API.utilites.namespace('theme_scripts');
	CHERRY_API.theme_scripts = {
		init: function () {
			var self = this;
			if( CHERRY_API.status.document_ready ){
				self.render();
			}else{
				CHERRY_API.variable.$document.on('ready', self.render() );
			}
		},
		render: function () {
			this.minimal_skin();
		},
		minimal_skin: function () { 
			// Check title on body bg
			var title = jQuery('div.title-box');

			title.each(function(){
				var _this = jQuery(this);

				if(! _this.closest('.cherry-box, .parallax-box')[0]) {
					_this.addClass('changed-color');
				}
			})
		}
	}
	CHERRY_API.theme_scripts.init();
}(jQuery));