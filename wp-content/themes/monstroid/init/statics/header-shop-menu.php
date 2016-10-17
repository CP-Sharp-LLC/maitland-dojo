<?php
/**
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

/**
 * Header Shop Menu Sidebar.
 */
class cherry_shop_menu_sidebar_static extends cherry_register_static {

	/**
	 * Callback-method for registered static.
	 *
	 * @since 1.0.0
	 */
	public function callback() {
		$classes   = array();
		$classes   = apply_filters( 'cherry_shop_menu_sidebar_static_class', $classes );
		$classes   = array_map( 'esc_attr', $classes );
		$classes   = array_unique( $classes );

		echo '<div class="' . join( ' ', $classes ) . '">';
			cherry_get_sidebar( "shop-sidebar-header-1" );
		echo '</div>';
	}
}

/**
 * Registration for static.
 */
new cherry_shop_menu_sidebar_static(
	array(
		'id'      => 'header_shop_menu_sidebar',
		'name'    => __( 'Header Shop Menu Sidebar', 'monstroid' ),
		'options' => array(
			'col-lg'   => 'col-lg-7',
			'col-md'   => 'col-md-7',
			'col-sm'   => 'col-sm-7',
			'col-xs'   => 'col-xs-12',
			'area'     => 'header-top-line-shop'
		)
	)
);