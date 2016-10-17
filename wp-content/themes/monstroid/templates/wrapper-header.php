<?php
	if ( class_exists( 'WooCommerce' ) ) {
		cherry_static_area( 'header-top-line-shop' );
	}

	cherry_static_area( 'header-top' );

	cherry_static_area( 'header-bottom' );

	$id = get_queried_object_id();
	$type = get_post_meta( $id, 'cherry_grid_type', true );

	if( isset( $type['header'] ) && $type['header'] === 'boxed' ){
		echo '<div class="boxed-background"></div>';
	}

	cherry_static_area( 'showcase-area' );
?>