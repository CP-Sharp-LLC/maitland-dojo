<?php
// Assign register plugins function to appropriate filter.
add_filter( 'cherry_theme_required_plugins', 'monstroid_register_plugins' );

/**
 * Register required plugins for theme.
 *
 * Plugins registered by this function will be automatically installed by Cherry Wizard.
 *
 * Notes:
 * - Slug parameter must be the same with plugin key in array
 * - Source parameter supports 3 possible values:
 *   a) cherry    - plugin will be downloaded from cherry plugins repository
 *   b) wordpress - plugin will be downloaded from wordpress.org repository
 *   c) path      - plugin will be downloaded by provided path
 *
 * @param  array $plugins Default array of required plugins (empty).
 * @return array          New array of required plugins.
 */
function monstroid_register_plugins( $plugins ) {

	$plugins = array(
		'cherry-blog-layouts' => array(
			'name'   => __( 'Cherry blog layouts', 'monstroid' ),
			'slug'   => 'cherry-blog-layouts',
			'source' => 'cherry-free',
		),
		'cherry-charts' => array(
			'name'   => __( 'Cherry charts', 'monstroid' ),
			'slug'   => 'cherry-charts',
			'source' => 'cherry-free',
		),
		'cherry-data-manager' => array(
			'name'   => __( 'Cherry data manager', 'monstroid' ),
			'slug'   => 'cherry-data-manager',
			'source' => 'cherry-free',
		),
		'cherry-grid' => array(
			'name'   => __( 'Cherry grid', 'monstroid' ),
			'slug'   => 'cherry-grid',
			'source' => 'cherry-free',
		),
		'cherry-mega-menu' => array(
			'name'   => __( 'Cherry mega menu', 'monstroid' ),
			'slug'   => 'cherry-mega-menu',
			'source' => 'cherry-free',
		),
		'cherry-portfolio' => array(
			'name'   => __( 'Cherry portfolio', 'monstroid' ),
			'slug'   => 'cherry-portfolio',
			'source' => 'cherry-free',
		),
		'cherry-rank' => array(
			'name'   => __( 'Cherry rank', 'monstroid' ),
			'slug'   => 'cherry-rank',
			'source' => 'cherry-free',
		),
		'cherry-services' => array(
			'name'   => __( 'Cherry services', 'monstroid' ),
			'slug'   => 'cherry-services',
			'source' => 'cherry-free',
		),
		'cherry-shortcodes' => array(
			'name'   => __( 'Cherry Shortcodes', 'monstroid' ),
			'slug'   => 'cherry-shortcodes',
			'source' => 'cherry-free',
		),
		'cherry-shortcodes-templater' => array(
			'name'   => __( 'Cherry shortcodes templater', 'monstroid' ),
			'slug'   => 'cherry-shortcodes-templater',
			'source' => 'cherry-free',
		),
		'cherry-sidebar-manager' => array(
			'name'   => __( 'Cherry sidebar manager', 'monstroid' ),
			'slug'   => 'cherry-sidebar-manager',
			'source' => 'cherry-free',
		),
		'cherry-simple-slider' => array(
			'name'   => __( 'Cherry simple slider', 'monstroid' ),
			'slug'   => 'cherry-simple-slider',
			'source' => 'cherry-free',
		),
		'cherry-social' => array(
			'name'   => __( 'Cherry social', 'monstroid' ),
			'slug'   => 'cherry-social',
			'source' => 'cherry-free',
		),
		'cherry-style-switcher' => array(
			'name'   => __( 'Cherry style switcher', 'monstroid' ),
			'slug'   => 'cherry-style-switcher',
			'source' => 'cherry-free',
		),
		'cherry-team' => array(
			'name'   => __( 'Cherry team', 'monstroid' ),
			'slug'   => 'cherry-team',
			'source' => 'cherry-free',
		),
		'cherry-testimonials' => array(
			'name'   => __( 'Cherry testimonials', 'monstroid' ),
			'slug'   => 'cherry-testimonials',
			'source' => 'cherry-free',
		),
		'cherry-white-label' => array(
			'name'   => __( 'Cherry white label', 'monstroid' ),
			'slug'   => 'cherry-white-label',
			'source' => 'cherry-free',
		),
		'monstroid-dashboard' => array(
			'name'   => __( 'Monstroid Dashboard', 'monstroid' ),
			'slug'   => 'monstroid-dashboard',
			'source' => 'cherry-free',
		),
		'motopress-content-editor' => array(
			'name'   => __( 'Motopress content editor', 'monstroid' ),
			'slug'   => 'motopress-content-editor',
			'source' => 'cherry-premium',
		),
		'motopress-slider' => array(
			'name'   => __( 'Motopress slider', 'monstroid' ),
			'slug'   => 'motopress-slider',
			'source' => 'cherry-premium',
		),
		'motopress-cherryframework4' => array(
			'name'   => __( 'MotoPress and CherryFramework4 integration', 'monstroid' ),
			'slug'   => 'motopress-cherryframework4',
			'source' => 'cherry-free',
		),
		'contact-form-7' => array(
			'name'   => __( 'Contact Form 7', 'monstroid' ),
			'slug'   => 'contact-form-7',
			'source' => 'wordpress',
		),
		'woocommerce' => array(
			'name'   => __( 'Woocommerce', 'monstroid' ),
			'slug'   => 'woocommerce',
			'source' => 'wordpress',
			'optional' => true,
		),
		'yith-woocommerce-compare' => array(
			'name'   => __( 'Yith woocommerce compare', 'monstroid' ),
			'slug'   => 'yith-woocommerce-compare',
			'source' => 'wordpress',
			'optional' => true,
		),
		'yith-woocommerce-wishlist' => array(
			'name'   => __( 'Yith woocommerce wishlist', 'monstroid' ),
			'slug'   => 'yith-woocommerce-wishlist',
			'source' => 'wordpress',
			'optional' => true,
		),
		'yith-woocommerce-quick-view' => array(
			'name'   => __( 'Yith woocommerce quick view', 'monstroid' ),
			'slug'   => 'yith-woocommerce-quick-view',
			'source' => 'wordpress',
			'optional' => true,
		),
		'yith-woocommerce-zoom-magnifier' => array(
			'name'   => __( 'Yith woocommerce zoom magnifier', 'monstroid' ),
			'slug'   => 'yith-woocommerce-zoom-magnifier',
			'source' => 'wordpress',
			'optional' => true,
		),
		'mailchimp-for-wp' => array(
			'name'   => __( 'MailChimp for WordPress', 'monstroid' ),
			'slug'   => 'mailchimp-for-wp',
			'source' => 'wordpress',
		),
	);

	return $plugins;
}

// register plugin for TGM activator
require_once get_stylesheet_directory() . '/includes/class-tgm-plugin-activation.php';
add_action( 'tgmpa_register', 'monstroid_register_plugins_tgma' );
function monstroid_register_plugins_tgma() {

	/**
	 * Array of plugin arrays. Required keys are name and slug.
	 */
	$plugins = array(
		array(
			'name'         => __( 'Cherry blog layouts', 'monstroid' ),
			'slug'         => 'cherry-blog-layouts',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-blog-layouts/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-blog-layouts',
		),
		array(
			'name'         => __( 'Cherry charts', 'monstroid' ),
			'slug'         => 'cherry-charts',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-charts/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-charts',
		),
		array(
			'name'         => __( 'Cherry data manager', 'monstroid' ),
			'slug'         => 'cherry-data-manager',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-data-manager/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-data-manager',
		),
		array(
			'name'         => __( 'Cherry grid', 'monstroid' ),
			'slug'         => 'cherry-grid',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-grid/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-grid',
		),
		array(
			'name'         => __( 'Cherry mega menu', 'monstroid' ),
			'slug'         => 'cherry-mega-menu',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-mega-menu/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-mega-menu',
		),
		array(
			'name'         => __( 'Cherry portfolio', 'monstroid' ),
			'slug'         => 'cherry-portfolio',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-portfolio/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-portfolio',
		),
		array(
			'name'         => __( 'Cherry rank', 'monstroid' ),
			'slug'         => 'cherry-rank',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-rank/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-rank',
		),
		array(
			'name'         => __( 'Cherry services', 'monstroid' ),
			'slug'         => 'cherry-services',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-services/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-services',
		),
		array(
			'name'         => __( 'Cherry shortcodes', 'monstroid' ),
			'slug'         => 'cherry-shortcodes',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-shortcodes/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-shortcodes',
		),
		array(
			'name'         => __( 'Cherry shortcodes templater', 'monstroid' ),
			'slug'         => 'cherry-shortcodes-templater',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-shortcodes-templater/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-shortcodes-templater',
		),
		array(
			'name'         => __( 'Cherry sidebar manager', 'monstroid' ),
			'slug'         => 'cherry-sidebar-manager',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-sidebar-manager/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-sidebar-manager',
		),
		array(
			'name'         => __( 'Cherry simple slider', 'monstroid' ),
			'slug'         => 'cherry-simple-slider',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-simple-slider/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-simple-slider',
 		),
		array(
			'name'         => __( 'Cherry social', 'monstroid' ),
			'slug'         => 'cherry-social',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-social/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-social',
		),
		array(
			'name'         => __( 'Cherry style switcher', 'monstroid' ),
			'slug'         => 'cherry-style-switcher',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-style-switcher/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-style-switcher',
		),
		array(
			'name'         => __( 'Cherry team', 'monstroid' ),
			'slug'         => 'cherry-team',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-team/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-team',
		),
		array(
			'name'         => __( 'Cherry testimonials', 'monstroid' ),
			'slug'         => 'cherry-testimonials',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-testimonials/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-testimonials',
		),
		array(
			'name'         => __( 'Cherry white label', 'monstroid' ),
			'slug'         => 'cherry-white-label',
			'source'       => 'https://api.github.com/repos/CherryFramework/cherry-white-label/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/cherry-white-label',
		),
		array(
			'name'         => __( 'Monstroid dashboard', 'monstroid' ),
			'slug'         => 'monstroid-dashboard',
			'source'       => 'https://api.github.com/repos/CherryFramework/monstroid-dashboard/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/monstroid-dashboard',
		),
		array(
			'name'     => __( 'Motopress content editor', 'monstroid' ),
			'slug'     => 'motopress-content-editor',
			'source'   => '',
			'required' => false,
		),
		array(
			'name'     => __( 'Motopress slider', 'monstroid' ),
			'slug'     => 'motopress-slider',
			'source'   => '',
			'required' => false,
		),
		array(
			'name'         => __( 'MotoPress and CherryFramework 4 Integration', 'monstroid' ),
			'slug'         => 'motopress-cherryframework4',
			'source'       => 'https://api.github.com/repos/CherryFramework/motopress-cherryframework4/zipball/',
			'required'     => false,
			'external_url' => 'https://github.com/CherryFramework/motopress-cherryframework4',
		),
		array(
			'name'     => __( 'Contact Form 7', 'monstroid' ),
			'slug'     => 'contact-form-7',
			'required' => false,
		),
		array(
			'name'     => __( 'Woocommerce', 'monstroid' ),
			'slug'     => 'woocommerce',
			'required' => false,
		),
		array(
			'name'     => __( 'Yith woocommerce compare', 'monstroid' ),
			'slug'     => 'yith-woocommerce-compare',
			'required' => false,
		),
		array(
			'name'     => __( 'Yith woocommerce wishlist', 'monstroid' ),
			'slug'     => 'yith-woocommerce-wishlist',
			'required' => false,
		),
		array(
			'name'     => __( 'Yith woocommerce zoom magnifier', 'monstroid' ),
			'slug'     => 'yith-woocommerce-zoom-magnifier',
			'required' => false,
		),
		array(
			'name'     => __( 'Yith woocommerce quick view', 'monstroid' ),
			'slug'     => 'yith-woocommerce-quick-view',
			'required' => false,
		),
		array(
			'name'     => __( 'MailChimp for WordPress', 'monstroid' ),
			'slug'     => 'mailchimp-for-wp',
			'required' => false,
		),
	);

	/**
	 * Array of configuration settings. Amend each line as needed.
	 */
	$config = array(
		'default_path' => '',                      // Default absolute path to pre-packaged plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => true,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
		'strings'      => array(
			'page_title'                      => __( 'Install Recommended Plugins', 'monstroid' ),
			'menu_title'                      => __( 'Install Plugins', 'monstroid' ),
			'installing'                      => __( 'Installing Plugin: %s', 'monstroid' ), // %s = plugin name.
			'oops'                            => __( 'Something went wrong with the plugin API.', 'monstroid' ),
			'notice_can_install_required'     => _n_noop( 'This theme requires the following plugin: %1$s.', 'This theme requires the following plugins: %1$s.' ), // %1$s = plugin name(s).
			'notice_can_install_recommended'  => _n_noop( 'This theme recommends the following plugin: %1$s.', 'This theme recommends the following plugins: %1$s.' ), // %1$s = plugin name(s).
			'notice_cannot_install'           => _n_noop( 'Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.' ), // %1$s = plugin name(s).
			'notice_can_activate_required'    => _n_noop( 'The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
			'notice_can_activate_recommended' => _n_noop( 'The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
			'notice_cannot_activate'          => _n_noop( 'Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.' ), // %1$s = plugin name(s).
			'notice_ask_to_update'            => _n_noop( 'The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.', 'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.' ), // %1$s = plugin name(s).
			'notice_cannot_update'            => _n_noop( 'Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.' ), // %1$s = plugin name(s).
			'install_link'                    => _n_noop( 'Begin installing plugin', 'Begin installing plugins' ),
			'activate_link'                   => _n_noop( 'Begin activating plugin', 'Begin activating plugins' ),
			'return'                          => __( 'Return to Recommended Plugins Installer', 'monstroid' ),
			'plugin_activated'                => __( 'Plugin activated successfully.', 'monstroid' ),
			'complete'                        => __( 'All plugins installed and activated successfully. %s', 'monstroid' ), // %s = dashboard link.
			'nag_type'                        => 'updated'
		)
	);

	tgmpa( $plugins, $config );

}