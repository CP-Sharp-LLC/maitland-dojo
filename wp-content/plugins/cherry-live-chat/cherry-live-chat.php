<?php
/**
 * Plugin Name: Cherry Live Chat
 * Plugin URI:  http://www.cherryframework.com/
 * Description: A plugin for integration in admin dashboard a support live chat.
 * Version:     1.0.1
 * Author:      Cherry Team
 * Author URI:  http://www.cherryframework.com/
 * Text Domain: cherry-live-chat
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

if ( is_admin() ) {
	include dirname( __FILE__ ) . '/admin/class-cherry-live-chat.php';
}

add_action( 'plugins_loaded', 'cherry_live_chat_load_textdomain' );
function cherry_live_chat_load_textdomain() {
	load_plugin_textdomain( 'cherry-live-chat', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

register_deactivation_hook( __FILE__, 'cherry_live_chat_deactivation' );
function cherry_live_chat_deactivation() {
	delete_transient( 'cherry_live_chat_operator_status' );
}