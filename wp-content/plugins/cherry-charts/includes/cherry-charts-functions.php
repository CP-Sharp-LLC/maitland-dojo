<?php
/**
 * Charts core functions
 *
 * @package   cherry_charts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

/**
 * get chart meta field
 *
 * @since  1.0.0
 *
 * @param  int     $post_id charts post ID
 * @param  string  $key     meta filed name
 * @param  boolean $default default meta field value
 * @return mixed            result
 */
function cherry_charts_get_meta( $post_id = null, $key = '', $default = false ) {

	$charts_meta = wp_cache_get( 'cherry_charts_' . $post_id );

	if ( !$charts_meta ) {
		$charts_meta = get_post_meta( $post_id, 'cherry_charts', true );
		wp_cache_add( 'cherry_charts_' . $post_id, $charts_meta );
	}

	if ( !$charts_meta ) {
		return $default;
	}

	if ( isset($charts_meta[$key]) ) {
		return $charts_meta[$key];
	} else {
		return $default;
	}
}

/**
 * Parse data-attributes array into string
 *
 * @since  1.0.0
 *
 * @param  array  $atts  attributes array to paste
 * @return string        parsed string
 */
function cherry_charts_parse_atts( $atts = array() ) {

	if ( ! is_array( $atts ) ) {
		return;
	}

	$atts = array_filter( $atts );

	$atts_str = '';

	foreach ( $atts as $att_key => $att_value ) {
		$atts_str .= ' data-' . $att_key . '="' . esc_attr( $att_value ) . '"';
	}

	return $atts_str;
}

/**
 * Parse CSS styles array into CSS-formated string
 *
 * @since  1.0.0
 *
 * @param  array  $styles  attributes array to paste
 * @return string        parsed string
 */
function cherry_charts_parse_css( $styles = array() ) {

	if ( ! is_array( $styles ) ) {
		return;
	}

	$styles = array_filter( $styles );

	$style_str = '';

	foreach ( $styles as $style_name => $style_value ) {
		$style_str .= $style_name . ':' . esc_attr( $style_value ) . ';';
	}

	return $style_str;
}

/**
 * Translate hex to regba if opacity < 100, or return hex if opacity = 100
 *
 * @since  1.0.0
 *
 * @param  string  $hex      HEX color
 * @param  int     $opacity  opacity (0..100)
 * @return string            hex or opacity
 */
function cherry_charts_maybe_to_rgba( $hex, $opacity ) {

	if ( 100 <= intval( $opacity ) ) {
		return $hex;
	}

	$opacity = round( ($opacity/100), 2 );

	if ( $hex[0] == '#' ) {
		$tmp_hex = substr( $hex, 1 );
	}
	if ( strlen( $tmp_hex ) == 6 ) {
		list( $r, $g, $b ) = array( $tmp_hex[0] . $tmp_hex[1], $tmp_hex[2] . $tmp_hex[3], $tmp_hex[4] . $tmp_hex[5] );
	} elseif ( strlen( $colour ) == 3 ) {
		list( $r, $g, $b ) = array( $tmp_hex[0] . $tmp_hex[0], $tmp_hex[1] . $tmp_hex[1], $tmp_hex[2] . $tmp_hex[2] );
	} else {
		return $hex;
	}

	$r = hexdec( $r );
	$g = hexdec( $g );
	$b = hexdec( $b );

	return sprintf( 'rgba(%1$d, %2$d, %3$d, %4$s)', $r, $g, $b, $opacity );
}

/**
 * Get shortcode transient cache
 *
 * @since  1.0.0
 *
 * @param  int  $id  chart ID to get cache for
 * @return string|bool false
 */
function cherry_charts_get_cache( $id ) {

	if ( defined( 'CHERRY_USE_SHORTCODE_CACHING' ) && CHERRY_USE_SHORTCODE_CACHING === false ) {
		return false;
	}

	$cache = get_transient( 'cherry_charts_' . $id );

	return $cache;
}

/**
 * Set shortcode transient cache
 *
 * @since  1.0.0
 *
 * @param  int    $id      chart ID to get cache for
 * @param  string $content content to save
 * @return void|bool false
 */
function cherry_charts_set_cache( $id, $content ) {

	if ( defined( 'CHERRY_USE_SHORTCODE_CACHING' ) && CHERRY_USE_SHORTCODE_CACHING === false ) {
		return false;
	}

	set_transient( 'cherry_charts_' . $id, $content, DAY_IN_SECONDS );
}

/**
 * Delete shortcode transient cache
 *
 * @since  1.0.0
 *
 * @param  int  $id  chart ID to get cache for
 * @return void|bool false
 */
function cherry_charts_delete_cache( $id ) {

	if ( defined( 'CHERRY_USE_SHORTCODE_CACHING' ) && CHERRY_USE_SHORTCODE_CACHING === false ) {
		return false;
	}

	delete_transient( 'cherry_charts_' . $id );
}

/**
 * Delete all cached charts
 *
 * @since  1.0.0
 */
function cherry_charts_clear_cache() {

	global $wpdb;
	$transient = 'transient_cherry_charts_';
	$sql = "SELECT `option_name` AS `name`
			FROM  $wpdb->options
			WHERE `option_name` LIKE '%$transient%'
			ORDER BY `option_name`";

	$results = $wpdb->get_results( $sql, ARRAY_A );

	if ( empty( $results ) || !is_array( $results ) ) {
		return false;
	}

	foreach ( $results as $name ) {

		if ( empty( $name['name'] ) ) {
			continue;
		}

		$tr_key = str_replace( '_transient_', '', $name['name'] );
		delete_transient( $tr_key );
	}
}