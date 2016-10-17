<?php
if (class_exists( 'WooCommerce' )) {
	if (is_page('home-shop')) {
		cherry_static_area( 'footer-shop-widgets-area' );
	} else {
		if (!is_page('about-shop') && !cherry_woocommerce_is_really_woocommerce_page()) {
			cherry_static_area( 'footer-top' );
		}		
	}
} else {
	cherry_static_area( 'footer-top' );
}
	
cherry_static_area( 'footer-bottom' );
?>