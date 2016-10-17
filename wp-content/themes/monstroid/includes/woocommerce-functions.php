<?php
/**
 * WooCommerce functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

include 'class-cherry-wc-product-video-tab.php';

/**
 * Register js scripts.
 */
add_action( 'wp_enqueue_scripts', 'cherry_woocommerce_custom_scripts' );
function cherry_woocommerce_custom_scripts() {
	if( cherry_woocommerce_is_really_woocommerce_page() || is_page('home-shop') || is_page('about-shop') ) {
		wp_enqueue_script( 'jqeury-spinner', CHILD_URI . '/assets/js/min/jquery-ui-1.9.2.spinner.min.js', array('jquery'), MOSTROID_VERSION, true );
		wp_enqueue_script( 'fancyform', CHILD_URI . '/assets/js/min/jquery.fancyform.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
		wp_enqueue_script( 'magnific-popup' );

		wp_register_script( 'monstroid-woocommerce-script', CHILD_URI . '/assets/js/min/woocommerce-script.min.js', array('jquery'), MOSTROID_VERSION, true );

		$translation_array = array(
		    'compare' => __( 'Compare', 'monstroid' ),
		    'quick_view'   => __( 'Quick View', 'monstroid' ),
		    'wishlist'   => __( 'Wishlist', 'monstroid' )
		);

		wp_localize_script( 'monstroid-woocommerce-script', 'woo_translate_vars', $translation_array );

		wp_enqueue_script( 'monstroid-woocommerce-script' );
	}
}

/**
 * cherry_woocommerce_is_really_woocommerce_page - Returns true if on a page which uses WooCommerce templates (cart and checkout are standard pages with shortcodes and which are also included)
 *
 * @access public
 * @return bool
 */
function cherry_woocommerce_is_really_woocommerce_page () {
	if(  function_exists ( "is_woocommerce" ) && is_woocommerce()){
		return true;
	}
	if (is_checkout() || is_cart() || is_account_page()) {
		return true;
	}
	$woocommerce_keys   =   array ( "woocommerce_shop_page_id" ,
		"woocommerce_terms_page_id" ,
		"woocommerce_cart_page_id" ,
		"woocommerce_checkout_page_id" ,
		"woocommerce_pay_page_id" ,
		"woocommerce_thanks_page_id" ,
		"woocommerce_myaccount_page_id" ,
		"woocommerce_edit_address_page_id" ,
		"woocommerce_view_order_page_id" ,
		"woocommerce_change_password_page_id" ,
		"woocommerce_logout_page_id" ,
		"yith_wcwl_wishlist_page_id" ,
		"woocommerce_lost_password_page_id" ) ;
	foreach ( $woocommerce_keys as $wc_page_id ) {
		if ( get_the_ID () === get_option ( $wc_page_id , 0 ) ) {
			return true;
		}
	}
	return false;
}

/**
 * Add to wishlist button for product in products list
 */
add_action( 'woocommerce_after_shop_loop_item', 'cherry_woocommerce_add_to_wishlist', 25 );
function cherry_woocommerce_add_to_wishlist() {
	if ( !defined( 'YITH_WCWL' ) ) {
		return;
	}
	echo do_shortcode( '[yith_wcwl_add_to_wishlist]' );
}

/**
 * Add product short description for products list
 */
add_action( 'woocommerce_after_shop_loop_item', 'cherry_woocommerce_catalog_product_description', 5 );
function cherry_woocommerce_catalog_product_description() {
	if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
	global $post; ?>

	<div class="product_hidden-content">

	<?php if ( ! $post->post_excerpt ) return; ?>
		<div class="short_desc small">
			<?php echo wp_trim_words($post->post_excerpt, 20); ?>
		</div>
	<?php
}

/**
 * Move rating to the bottom of the product in the products list
 */
remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_rating', 50 );

/**
 * Wrap buttons in product in products list in one div
 */
add_action( 'woocommerce_after_shop_loop_item','cherry_woocommerce_product_open_wrap_buttons', 9);
function cherry_woocommerce_product_open_wrap_buttons() {
	echo "<div class='product_buttons'>";
}
add_action( 'woocommerce_after_shop_loop_item','cherry_woocommerce_product_close_wrap_buttons', 30);
function cherry_woocommerce_product_close_wrap_buttons() {
	echo "</div>";
}

/**
 * Catalog details button
 */
add_action( 'woocommerce_after_shop_loop_item', 'cherry_woocommerce_catalog_product_details', 15 );
function cherry_woocommerce_catalog_product_details() {
	if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
	global $post, $product;
	if ( ('variable' != $product->product_type) && ('external' != $product->product_type) ) {
		echo "<a href='" . get_permalink() . "' class='btn button product_details_button' title=" . __( "Details",
				'monstroid' ) . ">" . __( "Details",
				'monstroid' ) . "</a>";
	}
}

/**
 * Change products per page for product list
 */
add_filter( 'loop_shop_per_page', create_function( '$cols', 'return 18;' ), 20 );

/**
 * Add shop sidebar
 */
function cherry_woocommerce_widgets_init() {
	// Sidebar Widget
	// Location: the sidebar
	register_sidebar(array(
		'name'          =>  __('Shop sidebar', 'monstroid'),
		'id'            => 'shop-sidebar',
		'description'   =>  __('Sidebar for shop page', 'monstroid'),
		'before_widget' => '<div id="%1$s" class="widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5>',
		'after_title'   => '</h5>'
	));
}
add_action( 'widgets_init', 'cherry_woocommerce_widgets_init', 20 );


function cherry_woocommerce_fix_shop_page_object( $object_id ) {

	if ( ! function_exists( 'is_shop' ) || ! function_exists( 'wc_get_page_id' ) ) {
		return $object_id;
	}

	if ( ! is_shop() && ! is_tax( 'product_cat' ) && ! is_tax( 'product_tag' ) ) {
		return $object_id;
	}

	$page_id = wc_get_page_id( 'shop' );

	return $page_id;

}
add_filter( 'cherry_sidebar_manager_object_id', 'cherry_woocommerce_fix_shop_page_object' );

/**
 * Show share buttons for product
 */
function cherry_woocommerce_share_buttons() {

	$sharedata = array(
		'facebook'    => 'https://www.facebook.com/sharer/sharer.php?u=%1$s',
		'twitter'     => 'https://twitter.com/intent/tweet?url=%1$s&status=%2$s',
		'pinterest'   => 'https://pinterest.com/pin/create/bookmarklet/?media=%3$s&url=%1$s&is_video=false&description=%2$s',
		'google-plus' => 'https://plus.google.com/share?url=%1$s'
	);

	$format = apply_filters( 'cherry_woocommerce_share_buttons', '<div class="share-buttons_item"><a href="%2$s" target="_blank" class="share-buttons_link link-%1$s"><i class="fa fa-%1$s"></i></a></div>' );

	$url   = urlencode( get_permalink() );
	$text  = urlencode( get_the_title() . ' - ' . get_permalink() );
	$media = false;
	if ( has_post_thumbnail() ) {
		$media = wp_get_attachment_url( get_post_thumbnail_id() );
		$media = urlencode( $media );
	}

	echo '<div class="share-buttons">';
	foreach ( $sharedata as $net => $link ) {
		$link = sprintf( $link, $url, $text, $media );
		printf( $format, $net, $link );
	}
	echo '</div>';

}
add_action('woocommerce_before_single_product_summary', 'cherry_woocommerce_share_buttons', 30);

/**
 * Wrap single product images and share buttons in one div
 */
add_action( 'woocommerce_before_single_product_summary','cherry_woocommerce_product_open_wrap_images', 15);
function cherry_woocommerce_product_open_wrap_images() {
	echo "<div class='product-images-and-social_wrapper'>";
}
add_action( 'woocommerce_before_single_product_summary','cherry_woocommerce_product_close_wrap_images', 35);
function cherry_woocommerce_product_close_wrap_images() {
	echo "</div>";
}
add_action( 'woocommerce_single_product_summary','cherry_woocommerce_product_clear_element', 35);
function cherry_woocommerce_product_clear_element() {
	echo "<div class='clear'></div>";
}

/**
 * Change number of related products on product page
 */
add_filter( 'woocommerce_output_related_products_args', 'jk_related_products_args' );
function jk_related_products_args( $args ) {
	$args['posts_per_page'] = 4; // 4 related products
	$args['columns'] = 4; // arranged in 4 columns
	return $args;
}

/**
 * Add theme styles to compare box
 */
add_action( 'wp_head', 'cherry_woocommerce_add_compare_style' );
function cherry_woocommerce_add_compare_style() {
	if ( !isset($_GET['action']) || 'yith-woocompare-view-table' != $_GET['action'] ) {
		return;
	}
	?>
	<link type="text/css" href="<?php echo get_stylesheet_directory_uri() . '/assets/css/main.css'; ?>" rel="stylesheet">
	<?php
}

/**
 * Add 'Post sidebars' option to product page
 */
add_filter('cherry_sidebar_post_type', 'cherry_woocommerce_add_sidebar_to_product');
function cherry_woocommerce_add_sidebar_to_product( $post_types ) {
	$post_types[] = 'product';
	return $post_types;
}

/**
 * Add cart items counter
 */
add_filter( 'woocommerce_add_to_cart_fragments', 'cherry_woocommerce_header_add_to_cart_fragment' );

function cherry_woocommerce_header_add_to_cart_fragment( $fragments ) {
	ob_start(); ?>
	<span class="cart-items"><?php echo WC()->cart->cart_contents_count ?></span>
	<?php
	$fragments['span.cart-items'] = ob_get_clean();
	return $fragments;
}
add_filter( 'widget_title', 'cherry_woocommerce_get_cart', 10 );
function cherry_woocommerce_get_cart( $title ) {

	if ( false === strpos( $title, '%items_num%' ) ) {
		return $title;
	}

	$items_str = '<span class="cart-items">' . WC()->cart->cart_contents_count . '</span>';
	$title = str_replace( '%items_num%', $items_str, $title );
	return $title;
}

/**
 * Register shop menu
 */
add_action( 'init', 'cherry_woocommerce_register_shop_menu' );
function cherry_woocommerce_register_shop_menu() {
	register_nav_menu( 'shop',   __( 'Shop', 'monstroid' ) );
}

/**
 * Print theme dynamic CSS at compare popup
 */
add_action( 'wp_head', 'cherry_woocommerce_compare_css', 40 );
function cherry_woocommerce_compare_css() {
	if ( !isset($_GET['action']) || 'yith-woocompare-view-table' != $_GET['action'] ) {
		return;
	}
	$css_compiler = cherry_css_compiler::get_instance();
	$dynamic_css  = $css_compiler->prepare_dynamic_css();

	?>
	<style type="text/css">
		<?php echo $dynamic_css; ?>
	</style>
	<?php
}

/**
 * Add class to compare window body element
 */
add_filter('body_class', 'cherry_woocommerce_compare_body_class');

function cherry_woocommerce_compare_body_class($classes) {
	if ( !isset($_GET['action']) || 'yith-woocompare-view-table' != $_GET['action'] ) {
		return $classes;
	}
	$classes[] = 'compare-window';
	return $classes;
}

/*
* Add body class depending on woocommerce products lightbox
**/
add_filter('body_class', 'cherry_woocommerce_add_lightbox_class');

function cherry_woocommerce_add_lightbox_class($classes) {
	if (get_option('woocommerce_enable_lightbox') == 'yes') {
		$classes[] = 'woocommerce-product-lightbox-enabled';
		return $classes;
	}
	$classes[] = 'woocommerce-product-lightbox-disabled';
	return $classes;
}

/*
* Change number of upsells products columns and products
**/
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
add_action( 'woocommerce_after_single_product_summary', 'cherry_woocommerce_output_upsells', 15 );

if ( ! function_exists( 'cherry_woocommerce_output_upsells' ) ) {
	function cherry_woocommerce_output_upsells() {
		woocommerce_upsell_display( 4,4 ); // Display 4 products in rows of 4
	}
}

/*
* Change number of cross sells products columns
**/
add_filter( 'woocommerce_cross_sells_columns', 'cherry_woocommerce_cross_sells_columns' );
function cherry_woocommerce_cross_sells_columns( $columns ) {
	return 4;
}

/*
* Print category title in category archive pages
**/
add_action( 'woocommerce_before_main_content', 'monstroid_category_title', 12);
function monstroid_category_title () {
	if ( is_product_category() ) {
		global $wp_query;
	    $cat = $wp_query->get_queried_object();
		echo '<h2 class="category-title">'.$cat->name."</h2>";
	}
}

// Yith Quick view default options
add_action ('yith_wcqv_panel_settings_options', 'monstroid_quick_view_options', 999);
function monstroid_quick_view_options($settings) {

	unset($settings['settings']['enable-lightbox']);

	return $settings;
}

// Yith Zoom magnifier
add_action ('yith_wcmg_tab_options', 'monstroid_magnifier_general_options', 999);
function monstroid_magnifier_general_options($settings) {

	if ($settings['general'][7]['id'] == 'yith_wcmg_zoom_mobile_position') {
		$settings['general'][7]['std'] = 'disable';
		$settings['general'][7]['default'] = 'disable';
	}

	if ($settings['general'][8]['id'] == 'zoom_box_position') {
		$settings['general'][8]['std'] = 'inside';
		$settings['general'][8]['default'] = 'inside';
	}

	if ($settings['general'][14]['id'] == 'yith_wcmg_slider_responsive') {
		unset($settings['general'][14]);
	}

	if ($settings['general'][15]['id'] == 'yith_wcmg_slider_items') {
		$settings['general'][15]['std'] = 5;
		$settings['general'][15]['default'] = 5;
	}

	return $settings;
}

add_action ('yith_ywzm_magnifier_settings', 'monstroid_magnifier_options', 999);
function monstroid_magnifier_options($settings) {

	if ($settings[2]['id'] == 'woocommerce_magnifier_image') {
		unset($settings[2]);
	}

	return $settings;
}

// Disable default woo lightbox
add_filter('woocommerce_product_settings', 'monstroid_woo_disable_settings', 999);
function monstroid_woo_disable_settings($settings) {
	if($settings[12]['id'] == 'woocommerce_enable_lightbox') {
		$settings[12]['default'] = 'no';
		unset($settings[12]);
	}
	return $settings;
}

add_filter('wp_enqueue_scripts', 'monstroid_woo_dequeue_style', 999);
function monstroid_woo_dequeue_style() {
	wp_dequeue_style( 'woocommerce_prettyPhoto_css' );
	wp_dequeue_script( 'prettyPhoto' );
	wp_dequeue_script( 'prettyPhoto-init' );
}

// Fix woo bug with var products vars (didn't display price if price for all vars are the same)
add_filter('woocommerce_available_variation', 'monstroid_variable_same_price', 10, 3);
function monstroid_variable_same_price ($value, $object = null, $variation = null) {
	if ($value['price_html'] == '') {
		$value['price_html'] = '<span class="price">' . $variation->get_price_html() . '</span>';
	}
	return $value;
}

/**
 * Add plugin options to Cherry options page.
 *
 * @since  1.1.0
 * @param  array $sections existing section array.
 * @return array
 */
function monstroid_shop_options( $sections ) {

	if ( ! defined( 'PARENT_URI' ) ) {
		return $sections;
	}

	$sidebars        = monstroid_get_sidebars_list();
	$default_sidebar = 'shop-sidebar';

	unset($sidebars['sidebar-secondary']);

	$shop_layout = array(
		'shop-loop-sidebar' => array(
			'type'    => 'select',
			'title'   => __( 'Main sidebar for shop page', 'monstroid' ),
			'label'   => '',
			'hint'    => array(
				'type'    => 'text',
				'content' => __( 'Select main sidebar to show on shop page', 'monstroid' ),
			),
			'value'   => $default_sidebar,
			'options' => $sidebars,
		),
		'shop-category-sidebar' => array(
			'type'    => 'select',
			'title'   => __( 'Main sidebar for shop category and tags pages', 'monstroid' ),
			'label'   => '',
			'hint'    => array(
				'type'    => 'text',
				'content' => __( 'Select main sidebar to show it on category and tags pages', 'monstroid' ),
			),
			'value'   => $default_sidebar,
			'options' => $sidebars,
		),
		'shop-single-sidebar' => array(
			'type'    => 'select',
			'title'   => __( 'Main sidebar for single product page', 'monstroid' ),
			'label'   => '',
			'hint'    => array(
				'type'    => 'text',
				'content' => __( 'Select main sidebar to show it on single product page', 'monstroid' ),
			),
			'value'   => $default_sidebar,
			'options' => $sidebars,
		),
	);

	$sections['shop-section'] = array(
		'name'         => __( 'Shop', 'monstroid' ),
		'icon'         => 'dashicons dashicons-cart',
		'priority'     => 105,
		'options-list' => apply_filters( 'monstroid_shop_options_list', $shop_layout ),
	);

	return $sections;

}

add_filter( 'cherry_defaults_settings', 'monstroid_shop_options' );

/**
 * Get registerd sidebars list for options
 *
 * @since  1.1.0
 * @return array
 */
function monstroid_get_sidebars_list() {

	global $wp_registered_sidebars;

	$sidebars = array();

	if ( ! $wp_registered_sidebars ) {
		return $sidebars;
	}

	foreach ( $wp_registered_sidebars as $sidebar ) {
		$sidebars[ $sidebar['id'] ] = $sidebar['name'];
	}

	unset($sidebars['cherry-mega-menu']);

	return $sidebars;

}

/**
 * Set sidebars for shop pages by values from options.
 *
 * @since  1.1.0
 * @param  string $sidebar default main sidebar name.
 * @return string
 */
function monstroid_set_shop_sidebars( $sidebar ) {

	if ( ! function_exists( 'is_woocommerce' ) || ! is_woocommerce() ) {
		return $sidebar;
	}

	$sidebar = 'shop-sidebar';

	if ( is_shop() ) {
		$sidebar = monstroid_get_page_specific_sidebar( $sidebar, 'loop' );
	}

	if ( is_product_taxonomy() ) {
		$sidebar = monstroid_get_page_specific_sidebar( $sidebar, 'category' );
	}

	if ( is_product() ) {
		$sidebar = monstroid_get_page_specific_sidebar( $sidebar, 'single' );
	}

	return $sidebar;

}

add_filter( 'cherry_get_main_sidebar', 'monstroid_set_shop_sidebars', 20 );

/**
 * Get page specific sidebar from options by page group name
 *
 * @since  1.0.0
 * @param  string $default default sidebar name if value from options is not provided.
 * @param  string $page    page group to get for. only 'loop', 'category' and 'single' allowed.
 * @return string
 */
function monstroid_get_page_specific_sidebar( $default = null, $page = 'loop' ) {

	$sidebar = cherry_get_option( 'shop-' . $page . '-sidebar', $default );

	if ( ! $sidebar ) {
		return $default;
	}

	return $sidebar;

}

/**
 * Fix statics conditional behavior for WooCommerce shop page
 *
 * @param  bool  $result current static visibility schecking result.
 * @param  array $static current static data.
 * @return bool
 */
function monstroid_statics_visibility( $result, $static ) {

	if ( empty( $static['conditions'] ) || empty( $static['conditions']['rules'] ) ) {
		return $result;
	}

	if ( ! function_exists( 'wc_get_page_id' ) ) {
		return $result;
	}

	$shop_page = wc_get_page_id( 'shop' );

	if ( -1 == $shop_page ) {
		return $result;
	}

	$page_obj = get_post( $shop_page );
	$slug     = $page_obj->post_name;

	foreach ( $static['conditions']['rules'] as $rule ) {

		if ( 'page' !== $rule['major'] || $slug !== $rule['minor'] ) {
			continue;
		}

		$condition_result = is_shop();

		if ( ! $condition_result ) {
			continue;
		}

		if ( 'hide' == $static['conditions']['action'] ) {
			$result = false;
		}

		if ( 'show' == $static['conditions']['action'] ) {
			$result = true;
		}

		return $result;

	}



	return $result;

}

add_filter( 'cherry_is_visible_static', 'monstroid_statics_visibility', 10, 2 );
