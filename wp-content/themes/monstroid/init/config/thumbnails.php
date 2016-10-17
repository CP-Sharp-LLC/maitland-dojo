<?php
/**
 * Thumbnails configuration.
 *
 * @package    Cherry_Framework
 * @subpackage Config
 * @author     Cherry Team <support@cherryframework.com>
 * @copyright  Copyright (c) 2012 - 2015, Cherry Team
 * @link       http://www.cherryframework.com/
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
	die;
}

// Registers custom image sizes for the theme.
add_action( 'init', 'monstroid_register_image_sizes' );
function monstroid_register_image_sizes() {

	if ( ! current_theme_supports( 'post-thumbnails' ) ) {
		return;
	}

	// Registers a new image sizes.
	add_image_size( 'monstroid-thumb-190x190', 190, 190, true );
	add_image_size( 'monstroid-thumb-475x300', 475, 300, true );
	add_image_size( 'monstroid-thumb-500x500', 500, 500, true );
	add_image_size( 'monstroid-thumb-570x360', 570, 360, true );
}