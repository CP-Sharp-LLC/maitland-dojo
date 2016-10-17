<?php
/**
 * Portfolio functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

add_filter( 'cherry_portfolio_default_settings', 'monstroid_portfolio_default_settings' );
function monstroid_portfolio_default_settings( $portfolio_options ) {
	$portfolio_color_primary = array( 'portfolio-color-primary' => array(
			'type'        => 'colorpicker',
			'title'       => __( 'Primary color', 'monstroid' ),
			'description' => __( 'Choose portfolio Primary color.', 'monstroid' ),
			'value'       => '#4eb7fe',
		)
	);

	$portfolio_options = array_merge( $portfolio_color_primary, $portfolio_options );

	return $portfolio_options;
}

add_filter( 'cherry_css_var_list', 'monstroid_portfolio_add_vars' );
function monstroid_portfolio_add_vars( $var_list ) {
	$var_list[] = 'portfolio-color-primary';

	return $var_list;
}

add_filter( 'cherry-portfolio-thumbnails-size', 'monstroid_portfolio_thumbnails_size' );
function monstroid_portfolio_thumbnails_size( $size ) {
	return 'monstroid-thumb-190x190';
}

add_filter( 'cherry_portfolio_show_all_text', 'monstroid_portfolio_show_all_text' );
function monstroid_portfolio_show_all_text( $text ) {
	return __( 'All', 'monstroid' );
}

add_filter( 'cherry-portfolio-taxonomy-name-list',   '__return_empty_string' );
add_filter( 'cherry-portfolio-order-filter-label',   '__return_empty_string' );
add_filter( 'cherry-portfolio-orderby-filter-label', '__return_empty_string' );