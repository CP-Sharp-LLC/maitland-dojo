jQuery(document).ready(function() {
    'use strict';

    jQuery('.shop-sidebar .product-categories .cat-parent').each(function(){
        var _this = jQuery(this);
        _this.children('a').prepend('<div class="icon"><i class="fa fa-angle-right"></i></div>');
    });
    jQuery('.shop-sidebar .product-categories .cat-parent > a div.icon').on('click', function(event) {
        event.preventDefault();
        var parent = jQuery(this).parent();
        console.log(jQuery(this));
        parent.toggleClass('opened');
    });

    jQuery(document).ajaxSuccess(function() {
        jQuery('input[type="number"]').spinner({
          stop: function( event, ui ) {
            jQuery(event.target).trigger('change');
          }
        });
    });
    jQuery('input[type="number"]').spinner({
      stop: function( event, ui ) {
        jQuery(event.target).trigger('change');
      }
    });

    jQuery(".woocommerce-ordering select").transformSelect({dropDownClass: "transformSelect wooSelect"});

    function closeNoticeInit() {
        jQuery('.close-notice').on('click', function(event){
            event.preventDefault();
            var el = jQuery(this);
            el.parent('.woocommerce-message, .woocommerce-info').hide('fast');
        });
    }
    closeNoticeInit();

    jQuery(document).on( 'updated_cart_totals', function() {
        closeNoticeInit();
    } );

    jQuery('.cart_totals .shipping td').attr('colspan', '2');


    function checkSrcs() {
        var mainImageTitle = jQuery('.yith_magnifier_zoom.woocommerce-main-image img').attr('src');

        jQuery('.yith_magnifier_gallery').find('li').each(function(){
            var el = jQuery(this),
                elSrc = el.find('a').attr('data-small');

            if(elSrc === mainImageTitle) {
                el.addClass('active');
            } else {
                el.removeClass('active');
            }
        })
    }

    if (jQuery('body.single-product').length) {
        checkSrcs();
    }
    jQuery('a.yith_magnifier_thumbnail').live('click', checkSrcs);

    // Change product review widget layout
    jQuery('[id*="woocommerce_recent_reviews"].widget .product_list_widget li').each(function() {
        var self = jQuery(this);

        self.wrapInner('<div class="product-content_wrapper"></div>');
        self.find('img').insertBefore(self.find('.product-content_wrapper'));
    });

    if (jQuery('.product_buttons')[0]) {
        addTitlesOnProductsButtons();
    }

    function addTitlesOnProductsButtons () {
        var product_buttons = jQuery('.product_buttons'),
            quick_view_button = product_buttons.find('a.yith-wcqv-button'),
            compare_button = product_buttons.find('a.compare'),
            wishlist_button = product_buttons.find('a.add_to_wishlist, .yith-wcwl-wishlistexistsbrowse a');

        quick_view_button.attr('title', woo_translate_vars.quick_view);
        compare_button.attr('title', woo_translate_vars.compare);
        wishlist_button.attr('title', woo_translate_vars.wishlist);
    }
});