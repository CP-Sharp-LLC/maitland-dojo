<?php
/**
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

/**
 * Footer Shop Sidebars static.
 */
class cherry_shop_footer_sidebars_static extends cherry_register_static {

	/**
	 * Callback-method for registered static.
	 * @since 1.0.0
	 */
	public function callback() {
		$classes   = array();
		$classes[] = 'col-xs-12';
		$classes[] = 'col-sm-3';
		$classes   = apply_filters( 'cherry_footer_sidebars_static_class', $classes );
		$classes   = array_map( 'esc_attr', $classes );
		$classes   = array_unique( $classes );

		for ( $i = 1; $i <= 4; $i++ ) {
			echo '<div class="' . join( ' ', $classes ) . '">';
				cherry_get_sidebar( "shop-sidebar-footer-{$i}" );
			echo '</div>';
		}
	}
}

/**
 * Registration for static.
 */
new cherry_shop_footer_sidebars_static(
	array(
		'name'    => __( 'Footer Shop Sidebars', 'monstroid' ),
		'id'      => 'footer_shop_sidebars',
		'options' => array(
			'position' => 1,
			'area'     => 'footer-shop-widgets-area',
		)
	)
);