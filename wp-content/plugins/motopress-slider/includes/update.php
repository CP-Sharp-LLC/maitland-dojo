<?php
if (!defined('ABSPATH')) exit;

function mpslDoUpdate() {
    global $mpsl_settings;

    $currentDBVersion = get_option('mpsl_db_version');

    if (version_compare($currentDBVersion, '1.1.0', '<')) {
        include($mpsl_settings['plugin_dir_path'] . 'includes/updates/1.1.0.php');
        update_option('mpsl_db_version', '1.1.0');
    }

	if (version_compare($currentDBVersion, '1.2.0', '<')) {
        include($mpsl_settings['plugin_dir_path'] . 'includes/updates/1.2.0.php');
        update_option('mpsl_db_version', '1.2.0');
    }

    update_option('mpsl_db_version', $mpsl_settings['plugin_version']);
}