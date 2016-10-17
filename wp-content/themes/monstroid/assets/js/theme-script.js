/**
 * Theme_scripts
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
			this.menu_items_height();

			if(!jQuery("#menu-primary-items").hasClass('mega-menu-direction-vertical')) {
				CHERRY_API.variable.$window.on('load resize', this.menu_hover );
			}

			this.totop_button();
			this.full_height_content();			
			this.mobile_submenu_triggers();
			this.woo_cart_widget();	

			if(jQuery('header.site-header .static-header-logo')[0]) {
				this.mobile_trigger();
			}
			
			jQuery(".cherry-btn").each(function() {
				jQuery(this).children().hasClass("cherry-btn-icon");
				var e = jQuery(this).text();
				jQuery(this).attr("data-text", e)
			})

		},// end render
		mobile_trigger: function () {
			var
				primaryMenu = jQuery('nav.menu-primary')
			,	trigger = jQuery('#trigger-menu-primary-items')
			,	logoStatic = jQuery('.static-header-logo')
			, 	simpleTrigger = jQuery('#menu-primary-items')
			;

			if ( jQuery( '.menu-items', primaryMenu ).hasClass( 'cherry-mega-menu' ) || jQuery( '.menu-items', primaryMenu ).hasClass( 'simple-menu' ) ) {
				// add trigger element to logo static
				jQuery( '.cherry-mega-menu-mobile-trigger' ).hide();
				jQuery( '.site-branding', logoStatic ).addClass('with-trigger');

				jQuery('button.hamburger').on('click', function(e){
					if (trigger[0]) {
						if ( trigger.is(':checked') ) {
							trigger.attr('checked', false);
							jQuery(this).removeClass('opened');
						} else {
							trigger.attr('checked', true);
							jQuery(this).addClass('opened');
						}
					} else {
						if ( simpleTrigger.attr('aria-expanded') === 'true' ) {
							simpleTrigger.attr('aria-expanded', false);
							primaryMenu.removeClass('toggled');
							primaryMenu.find('.menu-items').attr('aria-expanded', false);
							jQuery(this).removeClass('opened');
						} else {
							simpleTrigger.attr('aria-expanded', true);
							primaryMenu.addClass('toggled');
							primaryMenu.find('.menu-items').attr('aria-expanded', true);
							jQuery(this).addClass('opened');
						}
					}
					e.preventDefault();
				})
			}

			jQuery('.cherry-mega-menu-mobile-close').on('click', function(){
				jQuery('button.hamburger').removeClass('opened');
			})
		} // end mobile trigger
		, mobile_submenu_triggers: function () {
			var	primaryMenu = jQuery('nav.menu-primary');

			jQuery( 'li.menu-item-has-children, li.cherry-mega-menu-has-children', primaryMenu ).addClass('closed-menu-item');
			jQuery( 'li.menu-item-has-children', primaryMenu ).each(function(){
				var
					parentItem = jQuery(this)
					/* This is for mega menu button, for ordinary menu need to change to > .menu-line */
				,	link = parentItem.find('> a > i, > .menu-line')
				,	menuItem = parentItem.children('.cherry-mega-menu-sub, .sub-menu')
				;

				link.on('click',function(e){
					e.preventDefault();
					if( parentItem.hasClass('closed-menu-item') ) {
						parentItem.removeClass('closed-menu-item');
					} else {
						parentItem.addClass('closed-menu-item');
					}
				})
			});
		} // end mobile menu triggers
		, totop_button: function () {
			// totop functions
			var totop_btn = jQuery("#totop");
			if( totop_btn[0] ){
				jQuery("a#totopLink", totop_btn).on("click", function(event){
					if( ( !!CHERRY_API.shortcode ) && ( !!CHERRY_API.shortcode.row ) ){
						CHERRY_API.shortcode.row.page_anchor.do_animation = false;
					}
					jQuery('html, body').animate({scrollTop : 0}, 800, function(){
						if( ( !!CHERRY_API.shortcode ) && ( !!CHERRY_API.shortcode.row ) ){
							CHERRY_API.shortcode.row.page_anchor.do_animation = true;
						}
					});
					return false;
				});
				jQuery(window).scroll(function() {
					var windowHalfHeight = jQuery(window).height()/2;
					if(jQuery(window).scrollTop() > windowHalfHeight && !totop_btn.is(":visible") ) {
						totop_btn.fadeIn(300);
					} else if (jQuery(window).scrollTop() < windowHalfHeight && totop_btn.is(":visible")) {
						totop_btn.fadeOut(300);
					}
				});
			}
		}// end totop button
		, menu_hover: function () {
			var mainNav = jQuery("#menu-primary-items")

			if(mainNav[0]) {
				var activeMenu = jQuery('> li.current_page_item, > li.current-menu-item', mainNav),
					magicLineLeft = jQuery("#magic-line-left"),
					magicLineRight = jQuery("#magic-line-right"),

					beforeMenu = jQuery(".before-menu"),
					afterMenu = jQuery(".after-menu"),
					headerContainer = jQuery('.header-top'),
					headerContainerWidth = headerContainer.width(),
					headerContainerLeftOffset = headerContainer.offset().left,
					mainNavLeftOffset = mainNav.offset().left,
					mainNavWidth = mainNav.width(),
					beforeMenuLineWidth = Math.round(mainNavLeftOffset - headerContainerLeftOffset),
					afterMenuLineWidth = Math.round(headerContainerWidth - (beforeMenuLineWidth + mainNavWidth) );

				beforeMenu.css({
					'width': beforeMenuLineWidth,
					'left': beforeMenuLineWidth * -1
				});
				afterMenu.css('width', afterMenuLineWidth);

				if (activeMenu['0']) {
					set_line_position( activeMenu )
				}

				jQuery('#magic-line-left, #magic-line-right, .before-menu, .after-menu').css('height', '4px');

				jQuery("> li", mainNav)
					.not('#magic-line-left, #magic-line-right, .before-menu, .after-menu')
					.on('mouseover', function(){
						set_line_position( jQuery( this ) );
					})
					.on('mouseout', function(){
						set_line_position( activeMenu );
					});
			}
			function set_line_position( target ){
				var position_left = (target[0]) ? Math.round( target.position().left ) : '50%',
					position_right = (target[0]) ? Math.round( position_left + target.innerWidth() ) : '50%',
					position_right_width = (target[0]) ? Math.round( mainNavWidth - position_right ) : '50%';

				magicLineLeft.css({
					width: position_left
				});

				magicLineRight.css({
					left: position_right,
					width: position_right_width
				});
			}
		} // end menu hover
		, menu_items_height: function() {
			var logoWrap = jQuery('.static-header-logo'),
				menuWrap = jQuery('.static-header-menu, .static-header-shop-main-menu');

			jQuery(window).on('load resize', function(){
				var logoWrapHeight = logoWrap.height(),
					menuDefaultHeight = 97;	

				if ( menuWrap.prev().hasClass('static-header-logo') && jQuery(window).width() > 768 ) {
					menuWrap.find('#menu-primary-items > .menu-item').each(function(){
						var el = jQuery(this).find('> a'),
							elHeight = parseInt(el.outerHeight());

						if (logoWrapHeight >= menuDefaultHeight) { 
							var paddingHeight = logoWrapHeight / 2;
						} else {
							var paddingHeight = 40;
						}

						el.css({
							"padding-top": paddingHeight,
							"padding-bottom": paddingHeight
						})
					})
				}
			})
			
		} // end menu items height
		, full_height_content: function() {
			var height = jQuery(window).height(),
				menuHeight = jQuery('header').height();

			jQuery('.row.full').each(function(){
				var el = jQuery('> .cherry-box > .inner', this),
					elPadding;

				if (height > el.outerHeight( true )) {
					elPadding = (height - el.outerHeight( true ) )/2;
				} else {
					elPadding = '20px';
				}
				el.css({'padding-top': elPadding, 'padding-bottom': elPadding});
			});
		} // end full height content
		, woo_cart_widget: function() {
			var wooCart = jQuery('.widget_shopping_cart');
			
			if (wooCart['0']) {
				wooCart.each(function(){
					var _this = jQuery(this),
					wooCartTitle = _this.find('h5');

					wooCartTitle.on('click', function() {
						_this.children().toggleClass('opened');
					});
				});
			};

			//Disable cart selection
			(function (jQuery) {
				jQuery.fn.disableSelection = function () {
					return this
						.attr('unselectable', 'on')
						.css('user-select', 'none')
						.on('selectstart', false);
				};
				jQuery('.widget_shopping_cart h5').disableSelection();
			})(jQuery);

			// Make cart content disappear. If an event gets to the body
			jQuery("html").on('click', function() {
				jQuery(".widget_shopping_cart_content, .widget_shopping_cart h5").removeClass("opened");
			});

			// Prevent events from getting pass h3 and cart content
			wooCart.on('click', function(e) {
				e.stopPropagation();
			});
		} // end woo cart widget
	}
	CHERRY_API.theme_scripts.init();
}(jQuery));
