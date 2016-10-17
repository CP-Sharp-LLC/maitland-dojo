<?php
/**
 * Monstroid themes should do their setup on the 'after_setup_theme' hook with a priority of 11 if they want to
 * override parent theme features. Use a priority of 9 if wanting to run before the parent theme.
 */

/* Get version number */
$monstroidTheme = wp_get_theme();
define( 'MOSTROID_VERSION', $monstroidTheme -> get( 'Version' ) );

require_once get_stylesheet_directory() . '/includes/required-plugins.php';
require_once get_stylesheet_directory() . '/includes/shortcodes-functions.php';
require_once get_stylesheet_directory() . '/includes/blog-functions.php';
require_once get_stylesheet_directory() . '/includes/portfolio-functions.php';
require_once get_stylesheet_directory() . '/includes/olark-live-chat.php';

if ( class_exists( 'WooCommerce' ) ) {
	require_once get_stylesheet_directory() . '/includes/woocommerce-functions.php';
}

// Enqueue scripts and styles.
add_action( 'wp_enqueue_scripts',       		  'monstroid_first_css', 1 );

add_action( 'wp_enqueue_scripts',        		  'monstroid_scripts', 11 );

add_action( 'wp_head',                   		  'monstroid_wp_head', 7 );

// Enqueue custom styles for `MotoPress Slider`.
add_action( 'mpsl_slider_enqueue_style', 		  'monstroid_mpsl_slider_dequeue_style' );

// Move `breadcrumbs` under content.
add_action( 'init',                     		  'monstroid_move_breadcrumbs' );

// Register a new post type `Clients`.
add_action( 'init',                     		  'monstroid_post_type_clients' );

// Adds a shadow in header.
add_action( 'cherry_header',             		  'monstroid_add_header_shadow', 11 );

// Add simple menu responsive endpoint.
add_filter( 'cherry_menu_toogle_endpoint', 		  'monstroid_simple_menu_endpoint' );

// Adds a WPML buttons.
add_action( 'cherry_header',           			  'monstroid_wpml_add_button', 11 );

// Adds menu hover elements
add_filter( 'wp_nav_menu_items',				  'monstroid_primary_menu_hover', 10, 2 );

if ( is_admin() ) {
	add_action( 'load-post.php',     	  		  'monstroid_add_pagetitle_metabox' );
	add_action( 'load-post-new.php', 	  		  'monstroid_add_pagetitle_metabox' );
}

// Add to logo hamburger icon for responsive menu trigger.
add_filter('cherry_get_site_logo', 'monstroid_logo_responsive_menu_trigger', 11, 2);

// New Breadcumbs wrap.
add_filter( 'cherry_breadcrumbs_custom_args',     'monstroid_breadcrumbs_wrapper_format' );
add_filter( 'cherry_breadcrumbs_custom_args',     'monstroid_breadcrumbs_additional_page_options' );

// Body classes for 'paddings' on pages
add_filter( 'body_class',						  'monstroid_paddings_body_classes' );

// Adds a option for 404 page & totop.
add_filter( 'cherry_general_options_list',        'monstroid_new_settings' );

// Remove a option for mobile nav label.
add_filter( 'cherry_mega_menu_options',    		  'monstroid_remove_mega_menu_settings' );

// Remove cherry option.
add_filter( 'cherry_defaults_settings',    		  'monstroid_remove_cherry_settings' );

// Adds a `To top` button.
add_filter( 'cherry_footer', 					  'monstroid_totop_button' );

// Changed a Footer info.
add_filter( 'cherry_default_footer_info_format',  'monstroid_footer_info_format' );

// Assign options filter to apropriate filter.
add_filter( 'cherry_data_manager_export_options',  'monstroid_options_to_export' );

// Assign option id's filter to apropriate filter.
add_filter( 'cherry_data_manager_options_ids',     'monstroid_options_ids' );

// Assign `monstroid_menu_meta` to aproprite filter.
add_filter( 'cherry_data_manager_menu_meta',	   'monstroid_menu_meta' );

// Apply customization shortcodes from `Cherry Shortcodes` plugin.
add_filter( 'custom_cherry4_shortcodes',           '__return_true' );

// Changed a default `Grid type` option value for CPT.
add_filter( 'cherry_get_page_grid_type',		   'monstroid_get_page_grid_type', 11 );

// Output a Google Analytics code.
add_filter( 'wp_footer', 						   'monstroid_google_analytics', 9999 );

// Changed a documentation link.
add_filter( 'cherry_document_link_attr', 		   'cherry_document_link_attr', 40 );

// Preset default settings.
add_filter('cherry_preset_switcher_default_settings', 'monstroid_switcher_default_settings');
add_filter( 'cherry_defaults_settings', 		   'monstroid_new_settings_flat_style_functions' );
add_action( 'after_setup_theme',				   'monstroid_after_setup_theme', 40 );

// Add sidebar width option.
// Add portfolio filter items sort option.
// Add simple slider color options.
if ( is_admin() ) {
	add_filter( 'cherry_defaults_settings', 				'monstroid_new_settings_sidebar_width' );
	add_filter( 'cherry_defaults_settings', 				'monstroid_new_settings_portfolio_filter_categories' );
	add_filter( 'cherry-slider-standart-format-settings', 	'monstroid_new_settings_slider_standart' );
	add_filter( 'register_post_type_args', 					'monstroid_register_post_type_args', 10, 2 );
} else {
	add_filter( 'cherry_content_sidebar_wrapper_class',		'monstroid_content_sidebar_wrapper_class' );
	add_filter( 'cherry_portfolio_filter_categories_args', 	'monstroid_portfolio_filter_categories_args' );
	add_filter( 'cherry_slider_item_content_attr', 			'monstroid_cherry_slider_item_content_attr' );
	add_filter( 'cherry_content_template_hierarchy', 		'monstroid_content_template_hierarchy_empty' );
}

function monstroid_first_css() {
	wp_enqueue_style( 'monstroid-first-screen', CHILD_URI . '/assets/css/first.css', array(), MOSTROID_VERSION );
}

function monstroid_scripts() {
	wp_enqueue_script( 'monstroid-script', CHILD_URI . '/assets/js/min/theme-script.min.js', array( 'jquery' ), MOSTROID_VERSION, true );

	if ( defined( 'YITH_WCWL' ) ) {
		wp_dequeue_style( 'yith-wcwl-font-awesome' );
	}
	wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', false, '4.5.0', 'all' );
}

function monstroid_wp_head() {
	if ( wp_style_is( 'mpce-theme', 'registered' ) ) {
		wp_enqueue_style( 'monstroid-mpce', CHILD_URI . '/assets/css/moto-margins.css', array(), MOSTROID_VERSION );
	}
	wp_dequeue_style( 'mpce-font-awesome' );
}

function monstroid_mpsl_slider_dequeue_style() {
	wp_dequeue_style( 'mpsl-object-style' );
	wp_enqueue_style( 'monstroid-mpsl', CHILD_URI . '/assets/css/shortcodes-slider-styles.css', array(), MOSTROID_VERSION );
}

function monstroid_move_breadcrumbs() {
	remove_action( 'cherry_content_before', 'cherry_get_breadcrumbs', 5 );
	add_action( 'cherry_header_after', 'cherry_get_breadcrumbs', 99 );
}

function monstroid_post_type_clients() {
	register_post_type( 'clients',
		apply_filters(
			'cherry_clients_post_type_args',
			array(
				'label'             => __( 'Clients', 'monstroid' ),
				'singular_label'    => __( 'Clients', 'monstroid' ),
				'_builtin'          => false,
				'public'            => true,
				'show_ui'           => true,
				'show_in_nav_menus' => true,
				'hierarchical'      => true,
				'menu_icon'         => 'dashicons-groups',
				'capability_type'   => 'page',
				'rewrite'           => array(
					'slug'       => 'clients-view',
					'with_front' => false,
				),
				'supports' => array(
					'title',
					'editor',
					'thumbnail',
				)
			)
		)
	);
	register_taxonomy(
		'clients_category',
		'clients',
		array(
			'hierarchical'  => true,
			'label'         => __( 'Categories', 'monstroid' ),
			'singular_name' => __( 'Category', 'monstroid' ),
			'rewrite'       => true,
			'query_var'     => true,
		)
	);
}

function monstroid_add_header_shadow() {
	echo '<div class="shadow"></div>';
}

function monstroid_primary_menu_hover ( $items, $args ) {
	if ($args->theme_location == 'primary' || $args->theme_location == 'shop' ) {
		$items .= '<li id="magic-line-left"></li><li id="magic-line-right"></li><li class="before-menu"></li><li class="after-menu"></li>';
	}
	return $items;
}

function monstroid_simple_menu_endpoint( $endpoint ) {
	$endpoint = "768";
	return $endpoint;
}

function monstroid_logo_responsive_menu_trigger($logo, $location) {
	if ( $location == 'header' ) {
		$trigger = '<div class="menu-trigger"><button class="hamburger"><span>toggle menu</span></button></div>';
		$tagline = cherry_get_site_description();

		$logo = '<div class="logo-tagline-wrap">'.$logo.$tagline.'</div>'.$trigger;
	}

	return $logo;
}

function monstroid_wpml_add_button() {
	if ( ! function_exists( 'icl_object_id' ) ) {
		return;
	}

	global $sitepress, $wpdb;
	if (!$sitepress->get_setting( 'display_ls_in_menu' )) {
		do_action( 'wpml_add_language_selector' );
	}
}

function monstroid_add_pagetitle_metabox(){
	if ( 'false' == cherry_get_option( 'breadcrumbs', 'true' ) && 'false' == cherry_get_option( 'breadcrumbs-show-title', 'true' ) ) {
		return;
	}
	$screen    = get_current_screen();
	$post_type = $screen->post_type;

	if ( !empty( $post_type ) && 'page' == $post_type ) {
		require_once( CHILD_DIR . '/admin/class-monstroid-pagetitleblock-meta.php' );
	}
}

function monstroid_breadcrumbs_wrapper_format( $args ) {
	$args['wrapper_format'] = '
			<div class="' . apply_filters( 'cherry_get_header_class', 'container-fluid' ) . '">
				<div class="row">
					<div class="col-md-12 col-sm-12 collapse-col">%1$s</div>
					<div class="col-md-12 col-sm-12 collapse-col">%2$s</div>
				</div>
			</div>
		';

	$postid = get_the_ID();
	$meta   = get_post_meta( $postid, 'monstroid', true );

	if ( isset( $meta['page-heading'] ) ) {
		if ( $meta['page-heading'] == 'only-title' || $meta['page-heading'] == 'both' ) {

			$pageImageCssCode = '';
			$pageImageCssStyles = '';

			if ( get_post_thumbnail_id( $postid ) ) {
				$pageImageId        = get_post_thumbnail_id( $postid );
				$pageImageUrl       = wp_get_attachment_url( $pageImageId );
				$pageImageCssCode   = 'style="background-image: url(' . esc_url( $pageImageUrl ) . ')"';
				$pageImageCssStyles = 'with-background';
			}

			$excerpt = '';
			if ( get_the_excerpt() ) {
				$excerpt = '<div class="page-excerpt"><h2>' . get_the_excerpt() . '</h2></div>';
			}

			$args['wrapper_format'] = '
					<div class="' . apply_filters( 'cherry_get_header_class', 'container-fluid' ) . ' ' . $pageImageCssStyles . '">
						<div class="row">
							<div class="col-md-12 col-sm-12 title-wrapper ' . $pageImageCssStyles . '" ' . $pageImageCssCode . '>
								%1$s
								' . $excerpt . '
							</div>
							<div class="col-md-12 col-sm-12 collapse-col">%2$s</div>
						</div>
					</div>
				';
		}
	}

	return $args;
}

function monstroid_breadcrumbs_additional_page_options( $args ) {
	global $post;

	if ( null === $post ) {
		return $args;
	}

	$meta = get_post_meta( $post->ID, 'monstroid', true );

	if ( !is_array( $meta ) || $meta['page-heading'] == 'inherit' ) {
		return $args;
	}

	switch ( $meta['page-heading'] ) {
		case 'none':
			$show_title = false;
			$show       = false;

			break;

		case 'both':
			$show_title = true;
			$show       = true;

			break;

		case 'only-title':
			$show_title = true;
			$show       = false;

			break;

		case 'only-breadcrumbs':
			$show_title = false;
			$show       = true;

			break;

		default:
			return;
	}

	$args['show_title'] = $show_title;
	$args['show_items'] = $show;

	return $args;
}

function monstroid_paddings_body_classes ($classes) {
	global $post;

	if ( ! is_object( $post ) ) {
		return $classes;
	}

	$meta = get_post_meta( $post->ID, 'monstroid', true );

	$meta_page_paddings = '';
	if( !empty($meta) && isset($meta['page-paddings']) ) {
		$meta_page_paddings = $meta['page-paddings'];
	}

	$cherry_page_paddings = cherry_get_option( 'page_paddings' );

	if ( ($meta_page_paddings !== '') && is_page() ) {
		$type = $cherry_page_paddings && 'inherit' === $meta_page_paddings ? $cherry_page_paddings : $meta['page-paddings'] ;
	} else {
		$type = $cherry_page_paddings;
	}

	switch ( $type ) {
		case 'paddings-2':
			$classes[] = 'bottom-padding';
			break;
		case 'paddings-3':
			$classes[] = 'top-padding';
			break;
		case 'paddings-4':
			$classes[] = 'no-padding';
			break;
	}

	return $classes;
}

function monstroid_new_settings( $options ) {
	$new_options = array(
		'to_top_button' => array(
			'type'        => 'switcher',
			'title'       => __( 'To Top', 'monstroid' ),
			'description' => __( 'Display to top button?', 'monstroid' ),
			'value'       => 'true',
		),
		'content-404' => array(
			'type'        => 'editor',
			'title'       => __( '404 content', 'monstroid' ),
			'description' => __( 'Enter 404 page content.', 'monstroid' ),
			'value'       => '
							[cherry_row]
							[cherry_col size_xs="12" size_sm="12" size_md="12" size_lg="12"]
							[cherry_spacer size="100"]
							[/cherry_col]
							[/cherry_row]
							[cherry_row]
							[cherry_col size_xs="12" size_sm="12" size_md="5" size_lg="4" offset_xs="none" offset_sm="none" offset_md="1" offset_lg="2"]
							<img class="aligncenter size-full" src="'.CHILD_URI.'/assets/images/404.jpg" alt="404 Not Found" width="520" height="436" />
							[/cherry_col]
							[cherry_col size_xs="12" size_sm="12" size_md="6" size_lg="6"]
							<h1>Sorry</h1>
							<h2>It’s not you.
							It’s us.</h2>
							The page you are looking for can’t be found.
							[cherry_spacer size="50"]
							[cherry_button text="Go Home!" style="danger" size="large"]
							[/cherry_col]
							[/cherry_row]
							[cherry_row]
							[cherry_col size_xs="12" size_sm="12" size_md="12" size_lg="12"]
							[cherry_spacer size="100"]
							[/cherry_col]
							[/cherry_row]
		'),
		'google_analytics' => array(
			'type'        => 'textarea',
			'title'       => __( 'Google Analytics Code', 'monstroid' ),
			'description' => __( 'You can paste your Google Analytics or other tracking code in this box. This will be automatically added to the footer.', 'monstroid' ),
			'value'       => '',
		)
	);
	$options = array_merge( $options, $new_options );

	return $options;
}

add_filter('cherry_page_options_list', 'monstroid_new_settings_paddings');
function monstroid_new_settings_paddings( $options ) {
	$new_options = array(
		'page_paddings' => array(
			'type'			=> 'radio',
			'title'			=> __('Choose paddings for page content', 'monstroid'),
			'label'			=> '',
			'value'			=> 'paddings-1',
			'class'			=> '',
			'options'		=> array(
				'paddings-1' => array(
					'label' => __( 'Content with top and bottom paddings', 'monstroid' ),
					'img_src' => CHILD_URI.'/admin/assets/images/paddings-1.png'
				),
				'paddings-2' => array(
					'label' => __( 'Content bottom padding', 'monstroid' ),
					'img_src' => CHILD_URI.'/admin/assets/images/paddings-2.png'
				),
				'paddings-3' => array(
					'label' => __( 'Content top padding', 'monstroid' ),
					'img_src' => CHILD_URI.'/admin/assets/images/paddings-3.png'
				),
				'paddings-4' => array(
					'label' => __( 'No paddings', 'monstroid' ),
					'img_src' => CHILD_URI.'/admin/assets/images/paddings-4.png'
				),
			)
		)
	);
	$options = array_merge( $options, $new_options );

	return $options;
}

function monstroid_remove_mega_menu_settings( $options ) {
	unset( $options['mega-menu-mobile-label'] );
	unset( $options['mega-menu-direction'] );
	unset( $options['mega-menu-mobile-trigger'] );
	return $options;
}

function monstroid_remove_cherry_settings( $options ) {
	unset( $options['breadcrumbs-subsection']['options-list']['breadcrumbs-show-on-front'] );
	return $options;
}

function monstroid_totop_button() {
	if ( 'true' == cherry_get_option( 'to_top_button', 'true' ) ) {
		echo '<div id="totop"><a id="totopLink" href="javascript:void(0)"><i class="fa fa-chevron-up color-white"></i></a></div>';
	}
}

function monstroid_footer_info_format(){
	return get_bloginfo( 'name' ) .' &copy; %1$s. %3$s';
}

if ( function_exists('ihf_replace_after_body_open') ) {
	add_action( 'cherry_body_start', 'ihf_replace_after_body_open', 1 );
}
if ( function_exists('ihf_replace_before_body_close') ) {
	add_action( 'cherry_body_end', 'ihf_replace_before_body_close', 999 );
}

function monstroid_google_analytics () {
	if ( cherry_get_option( 'google_analytics' ) ) {
		echo '<script>'.cherry_get_option( 'google_analytics' ).'</script>';
	}
}

function monstroid_get_page_grid_type( $grid_type ) {
	if ( ! empty( $grid_type['content'] ) ) {
		return $grid_type;
	}

	if ( is_author() ||
		is_archive() ||
		is_singular( 'service' ) ||
		is_singular( 'testimonial' ) ||
		is_singular( 'team' ) ||
		is_singular( 'clients' )
		) {
		$grid_type['content'] = 'boxed';
	}

	return $grid_type;
}

function cherry_document_link_attr( $cherry_document_link_attr ) {

	$cherry_document_link_attr['project'] = 'monstroid';
	$cherry_document_link_attr['text_link'] = __( 'Monstroid documentation', 'monstroid' );

	return $cherry_document_link_attr;
}

function monstroid_switcher_default_settings( $settings ){
	$settings['skin_group'] = array(
		'group_name' => __('Skins', 'monstroid'),
		'presets'  => array(
			'material_skin' => array(
				'label'   => __('Material', 'monstroid'),
				'description' => __( 'Material design', 'monstroid' ),
				'thumbnail'  => 'material.png',
				'preset'  => 'material.options',
			),
			'dark_skin' => array(
				'label'   => __('Dark', 'monstroid'),
				'description' => __( 'Dark design', 'monstroid' ),
				'thumbnail'  => 'dark.png',
				'preset'  => 'dark.options',
			),
			'minimal_skin' => array(
				'label'   => __('Minimal', 'monstroid'),
				'description' => __( 'Minimal design', 'monstroid' ),
				'thumbnail'  => 'minimal.png',
				'preset'  => 'minimal.options',
			),
			'flat_skin' => array(
				'label'   => __('Flat', 'monstroid'),
				'description' => __( 'Flat design', 'monstroid' ),
				'thumbnail'  => 'flat.png',
				'preset'  => 'flat.options',
			),
		)
	);
	$settings['layout_group']['group_name'] = __('Layout type', 'monstroid');
	$settings['layout_group']['presets']['wide']['thumbnail'] = 'wide.png';
	$settings['layout_group']['presets']['boxed']['thumbnail'] = 'boxed.png';
	unset($settings['sidebar_group']);

	return $settings;
}

function monstroid_new_settings_flat_style_functions( $options ) {
	$options['style-switcher-section']['options-list']['skin-functions'] = array(
		'type'			=> 'radio',
		'title'			=> __('Skins functions', 'cherry'),
		'label'			=> '',
		'value'			=> 'material-skin',
		'class'			=> '',
		'description' => __('Enable additional skins functionality. Note that each skin can has its own functions. If to enable a function of the certain skin, it leads to initial design changes of the other. However you can create some new combinations or use the design as is.', 'monstroid'),
		'master'  => 'style-switcher-true-slave',
		'options'		=> array(
			'material-skin' => array(
				'label' =>  __('Material-skin addons', 'monstroid'),
				'img_src' => CHILD_URI . '/child-presets/thumbnails/material.png'
			),
			'dark-skin' => array(
				'label' =>  __('Dark-skin addons', 'monstroid'),
				'img_src' => CHILD_URI . '/child-presets/thumbnails/dark.png'
			),
			'minimal-skin' => array(
				'label' =>  __('Minimal-skin addons', 'monstroid'),
				'img_src' => CHILD_URI . '/child-presets/thumbnails/minimal.png'
			),
			'flat-skin' => array(
				'label' =>  __('Flat-skin addons', 'monstroid'),
				'img_src' => CHILD_URI . '/child-presets/thumbnails/flat.png'
			),
		)
	);

	return $options;
}

function monstroid_after_setup_theme() {
	switch ( cherry_get_option('skin-functions', 'material-skin') ) {
		case 'material-skin':
				require_once get_stylesheet_directory() . '/includes/material-skin-functions.php';
			break;
		case 'dark-skin':
				require_once get_stylesheet_directory() . '/includes/dark-skin-functions.php';
			break;
		case 'minimal-skin':
				require_once get_stylesheet_directory() . '/includes/minimal-skin-functions.php';
			break;
		case 'flat-skin':
				require_once get_stylesheet_directory() . '/includes/flat-skin-functions.php';
			break;
	}
}

/**
 * Pass own options to export (for example if you use thirdparty plugin and need to export some default options).
 *
 * WARNING #1
 * You should NOT totally overwrite $options_ids array with this filter, only add new values.
 *
 * @param  array $options Default options to export.
 * @return array          Filtered options to export.
 */
function monstroid_options_to_export( $options ) {

	/**
	 * Example:
	 *
	 * $options[] = 'woocommerce_default_country';
	 * $options[] = 'woocommerce_currency';
	 */

	$options[] = 'woocommerce_enable_myaccount_registration';
	$options[] = 'woocommerce_weight_unit';
	$options[] = 'woocommerce_dimension_unit';
	$options[] = 'woocommerce_enable_review_rating';
	$options[] = 'woocommerce_enable_review_rating';
	$options[] = 'yith_woocompare_is_button';
	$options[] = 'yith_woocompare_compare_button_in_product_page';
	$options[] = 'yith_woocompare_compare_button_in_products_list';
	$options[] = 'yith_woocompare_auto_open';
	$options[] = 'yith_woocompare_price_end';
	$options[] = 'yith_woocompare_add_to_cart_end';
	$options[] = 'yith_woocompare_image_size[width]';
	$options[] = 'yith_woocompare_image_size[height]';
	$options[] = 'woocommerce_enable_lightbox';
	$options[] = 'mpsl_last_preset_id';
	$options[] = 'mpsl_last_private_preset_id';
	$options[] = 'mpsl_preset';
	$options[] = 'mpsl_css';
	$options[] = 'mpsl_preview_default_css';
	$options[] = 'mpsl_preview_css';
	$options[] = 'mpsl_default_css';
	$options[] = 'mpsl_private_css';

	return $options;
}

/**
 * Pass some own options (which contain page ID's) to export function,
 * if needed (for example if you use thirdparty plugin and need to export some default options).
 *
 * WARNING #1
 * With this filter you need pass only options, which contain page ID's and it's would be rewrited with new ID's on import.
 * Standrd options should passed via 'cherry_data_manager_export_options' filter.
 *
 * WARNING #2
 * You should NOT totally overwrite $options_ids array with this filter, only add new values.
 *
 * @param  array $options_ids Default array.
 * @return array              Result array.
 */
function monstroid_options_ids( $options_ids ) {

	/**
	 * Example:
	 *
	 * $options_ids[] = 'woocommerce_cart_page_id';
	 * $options_ids[] = 'woocommerce_checkout_page_id';
	 */

	$options_ids[] = 'woocommerce_shop_page_id';
	$options_ids[] = 'woocommerce_shop_page_display';
	$options_ids[] = 'woocommerce_cart_page_id';
	$options_ids[] = 'woocommerce_checkout_page _id';
	$options_ids[] = 'woocommerce_terms_page_id';
	$options_ids[] = 'woocommerce_myaccount_page_id';
	$options_ids[] = 'yith_wcwl_wishlist_page_id';

	return $options_ids;
}

/**
 * Pass additional nav menu meta atts to import function.
 *
 * By default all nav menu meta fields are passed to XML file,
 * but on import processed only default fields, with this filter you can import your own custom fields.
 *
 * @param  array $extra_meta Additional menu meta fields to import.
 * @return array             Filtered meta atts array.
 */
function monstroid_menu_meta( $extra_meta ) {

	/**
	 * Example:
	 *
	 * $extra_meta[] = '_cherry_megamenu';
	 */

	return $extra_meta;
}

function monstroid_new_settings_sidebar_width( $options ) {
	$options['layouts-subsection']['options-list']['sidebar-width'] = array(
		'type'        => 'select',
		'title'       => __( 'Sidebar width', 'monstroid' ),
		'value'       => '1_3',
		'options'     => array(
			'1_3' => '1/3',
			'1_4' => '1/4',
		)
	);

	return $options;
}

function monstroid_content_sidebar_wrapper_class( $class ) {
	$sidebar_width = cherry_get_option( 'sidebar-width' );
	$class .= ' sidebar-width-' . $sidebar_width;

	return $class;
}

function monstroid_new_settings_portfolio_filter_categories( $options ) {
	$new_arr = array(
		'portfolio-order-filter-categories' => array(
			'type'			=> 'radio',
			'title'			=> __( 'Order filter categories', 'monstroid' ),
			'value'			=> 'asc',
			'display-input'	=> true,
			'options'		=> array(
				'desc' => array(
					'label' => __('DESC', 'monstroid'),
				),
				'asc' => array(
					'label' => __('ASC', 'monstroid'),
				),
			)
		),
		'portfolio-orderby-filter-categories' => array(
			'type'			=> 'radio',
			'title'			=> __( 'Order by filter categories', 'monstroid' ),
			'value'			=> 'name',
			'display-input'	=> true,
			'options'		=> array(
				'id' => array(
					'label' => __('ID', 'monstroid'),
				),
				'name' => array(
					'label' => __('Name', 'monstroid'),
				),
				'count' => array(
					'label' => __('Count', 'monstroid'),
				),
			)
		),
	);

	if ( array_key_exists( 'portfolio-options-section', $options ) ) {
		$options['portfolio-options-section']['options-list'] = monstroid_insert_into_array_after_key( $options['portfolio-options-section']['options-list'], 'portfolio-filter-visible', $new_arr );
	}

	return $options;
}

function monstroid_portfolio_filter_categories_args( $args ) {
	$args['orderby'] = cherry_get_option( 'portfolio-orderby-filter-categories' );
	$args['order'] = cherry_get_option( 'portfolio-order-filter-categories' );

	return $args;
}

function monstroid_new_settings_slider_standart( $array ) {
	array_unshift( $array, array(
		'id'			=> 'slider-standart-text-color',
		'type'			=> 'colorpicker',
		'label'			=> __('Color', 'monstroid'),
		'decsription'	=> __('Color', 'monstroid'),
		'value'			=> ''
	), array(
		'id'			=> 'slider-standart-background-color',
		'type'			=> 'colorpicker',
		'label'			=> __('Background Color', 'monstroid'),
		'decsription'	=> __('Background Color', 'monstroid'),
		'value'			=> ''
	), array(
		'id'			=> 'slider-standart-background-opacity',
		'type'			=> 'slider',
		'label'			=> __('Background Opacity', 'monstroid'),
		'decsription'	=> __('Background Opacity', 'monstroid'),
		'value'			=> 75,
		'max_value'		=> 100,
		'min_value'		=> 0,
		'step_value'	=> 1,
	) );

	return $array;
}

function monstroid_cherry_slider_item_content_attr( $attr ) {
	$post_meta = get_post_meta( get_the_ID(), CHERRY_SLIDER_POSTMETA, true);
	$slide_text_color = $post_meta['slider-standart-text-color'];
	$slide_background_color = $post_meta['slider-standart-background-color'];
	$slide_background_opacity = $post_meta['slider-standart-background-opacity'];
	$slide_style = '';

	if ( ! is_null( $slide_text_color ) && '' !== $slide_text_color ) {
		$slide_style .= 'color:' . $slide_text_color . '; ';
	}

	if ( ! is_null( $slide_background_color ) && '' !== $slide_background_color ) {
		$rgb_color = hex2rgb( $slide_background_color );
		$slide_style .= 'background-color:rgba(' . $rgb_color[0] . ', ' . $rgb_color[1] . ', ' . $rgb_color[2] . ', ' . $slide_background_opacity / 100 . ');';
	}

	if ( '' !== $slide_style ) {
		$slide_style = 'style="' . $slide_style . '"';
		$attr .= ' ' . $slide_style;
	}

	return $attr;
}

function hex2rgb( $hex ) {
	$hex = str_replace( "#", "", $hex );

	if ( strlen( $hex ) == 3 ) {
		$r = hexdec( substr( $hex, 0, 1 ).substr( $hex, 0, 1 ) );
		$g = hexdec( substr( $hex, 1, 1 ).substr( $hex, 1, 1 ) );
		$b = hexdec( substr( $hex, 2, 1 ).substr( $hex, 2, 1 ) );
	} else {
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
	}
	$rgb = array( $r, $g, $b );

	return $rgb;
}

function monstroid_insert_into_array_after_key( $arr, $key, $inserted_arr ) {
	if ( ! is_null( $arr ) ) {
		if ( array_key_exists( $key, $arr ) ) {
			$item_index = array_search( $key, array_keys( $arr ) ) + 1;
			$arr = array_slice( $arr, 0, $item_index )
				 + $inserted_arr
				 + array_slice( $arr, $item_index, count($arr) - 1);

			return $arr;
		}
	}
}

function monstroid_register_post_type_args( $args, $post_type ) {
	if ( 'ai1ec_event' === $post_type || 'forum' === $post_type || 'topic' === $post_type ) {
		array_push( $args['supports'], 'cherry-grid-type', 'cherry-layouts' );
	}

	return $args;
}

function monstroid_content_template_hierarchy_empty( $templates ) {
	if ( 'content/.tmpl' === $templates[0] ) {
		$templates[0] = 'content/undefined.tmpl';
	}

	return $templates;
}
