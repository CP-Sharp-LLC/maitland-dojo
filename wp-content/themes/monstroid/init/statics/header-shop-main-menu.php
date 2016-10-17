<?php
/**
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

/**
 * Header Shop Main Menu static.
 */
class cherry_shop_main_menu_static extends cherry_register_static {

	/**
	 * Callback-method for registered static.
	 *
	 * @since 1.0.0
	 */
	public function callback() {
		$classes   = array();
		$classes   = apply_filters( 'cherry_shop_main_menu_static_class', $classes );
		$classes   = array_map( 'esc_attr', $classes );
		$classes   = array_unique( $classes );

		echo '<nav ';
		cherry_attr( 'menu', 'primary' );
		echo '>';
		wp_nav_menu( array(
			'theme_location' => 'shop',
			'container'      => '',
			'menu_id'        => 'menu-primary-items',
			'menu_class'     => 'menu-items simple-menu',
			'after'          => '<div class="menu-line"></div>',
			'fallback_cb'    => '',
			'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
		) );
		echo '</nav>';
	}
}

/**
 * Registration for static.
 */
new cherry_shop_main_menu_static(
	array(
		'id'      => 'header_shop_main_menu',
		'name'    => __( 'Header Shop Main Menu', 'monstroid' ),
		'options' => array(
			'col-lg'   => 'col-lg-8',
			'col-md'   => 'col-md-8',
			'col-sm'   => 'col-sm-12',
			'col-xs'   => 'col-xs-12',
			'area'     => 'header-top'
		)
	)
);