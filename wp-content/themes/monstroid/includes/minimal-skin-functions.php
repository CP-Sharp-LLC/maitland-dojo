<?php
/**
 * Dark skin functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.1.1
 */

// Enqueue minimal skin js script
add_action( 'wp_enqueue_scripts', 'monstroid_flat_scripts', 11 );
function monstroid_flat_scripts() {
	wp_enqueue_script( 'minimal-skin-scripts', CHILD_URI . '/assets/js/min/minimal-script.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
}
