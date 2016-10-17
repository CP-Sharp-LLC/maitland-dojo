<?php

/**
 * Init class for tables - register post type etc.
 *
 * @package   cherry-white-label
 * @author
 * @license   GPL-2.0+
 * @link
 * @copyright 2014
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( !class_exists( 'CherryWhiteLabelInit' ) ) {

	/**
	 * Cherry white label init class
	 *
	 * @since  1.0.0
	 */
	class CherryWhiteLabelInit {

        /**
         * Developer website URL
         * @var $dev_website_url
         */
        private $_dev_website_url;

        /**
         * Developer website text link
         * @var $dev_website_text
         */
        private $_dev_website_text;

		/**
		 * @var $_data
		 */
		private $_update_settings = FALSE;

		/**
		 * @var $_custom_logo_admin_bar
		 */
        private $_custom_logo_admin_bar;

		/**
		 * @var $_custom_login_logo
		 */
        private $_custom_login_logo;

		/**
		 * @var $_custom_login_background
		 */
        private $_custom_login_background;

		/**
		 * @var $_custom_login_css
		 */
        private $_custom_login_css;

		public function __construct()
        {
			if ( is_admin() )
            {
//				add_action('load-index.php', array( $this, 'admin_assets' ));

                // Load admin scripts
				add_action( 'admin_enqueue_scripts', array( $this, 'admin_assets' ) );

				// Menu plugin
				add_action( 'admin_menu', array($this, 'register_menu_plugin') );

                // Hide admin bar options
                add_action( 'wp_before_admin_bar_render', array($this, 'hide_options_admin_bar') );
			}

            $this->_custom_settings_admin_panel();
		}

		/**
		 *  Init custom settings
		 */
        private function _custom_settings_admin_panel()
        {
	        // Check exist and automatically create .htaccess file
	        if (!file_exists($this->_get_home_path() . '.htaccess'))
	        {
		        if (!$this->_create_htaccess())
		        {
			        if (isset($_GET['page']) && 'cherry-white-label-settings' == $_GET['page'])
			        {
				        add_action( 'admin_notices', array($this, 'htaccess_notice') );
			        }
		        }
	        }
	        else
	        {
		        // Custom URL Admin Panel Authorization
		        add_filter( 'site_url', array($this, '_replace_login_url'), 10, 2 );
		        add_action( 'login_init', array($this, '_custom_login_url') );
		        add_filter( 'lostpassword_url', array($this, '_custom_lostpassword_url'), 10, 2 );
	        }

	        if ( !empty($_POST)
	             && isset($_POST['cherry-white-label-settings-value'])
	             && wp_verify_nonce($_POST['cherry-white-label-settings-value'], 'cherry-white-label-settings')
	             && !$error_message = $this->_validate_settings($_POST))
	        {
		        $this->_save_settings();
	        }

            $settings = $this->_get_settings();

	        // Custom Welcome Panel
	        remove_action('welcome_panel', 'wp_welcome_panel' );

	        if (isset($settings['visible-welcome-panel']) && 'on' == $settings['visible-welcome-panel'])
	        {
		        $user_info = wp_get_current_user();
		        $settings = $this->_get_settings();

		        if (isset($user_info->roles) && !empty($user_info->roles))
		        {
			        $role_user = $user_info->roles[0];

			        if (isset($settings['visible-welcome-group']) && !empty($settings['visible-welcome-group']))
			        {
				        if (in_array($role_user, $settings['visible-welcome-group']))
				        {
		                    add_action( 'welcome_panel', array( $this, 'custom_welcome_panel' ) );
				        }
			        }
		        }
	        }
	        else
	        {
		        add_action( 'welcome_panel', array( $this, 'custom_welcome_panel' ) );
	        }

            // Hide screen options
            if (isset($settings['visible-screen-options']) && 'on' == $settings['visible-screen-options'])
            {
                add_filter( 'screen_options_show_screen', array($this, 'remove_screen_options_tab') );
            }

            // Hide help box
            if (isset($settings['visible-help-box']) && 'on' == $settings['visible-help-box'])
            {
                add_action( 'admin_head', array($this, 'hide_help_box') );
            }

            // Hide version Wordpress
            if (isset($settings['visible-wp-version']) && 'on' == $settings['visible-wp-version'])
            {
                add_action('admin_menu', array($this, 'hide_footer_wp_version'));
            }

            // Developer link
            if (isset($settings['dev-website-name']) && !empty($settings['dev-website-name'])
                && isset($settings['dev-website-url']) && !empty($settings['dev-website-url']))
            {
                $this->_dev_website_text = $settings['dev-website-name'];
                $this->_dev_website_url = $settings['dev-website-url'];

                add_filter( 'admin_footer_text', array($this, 'custom_footer_text') );
            }

            // Hide Wordpress logo in admin bar
            if (isset($settings['visible-wp-logo']) && 'on' == $settings['visible-wp-logo'])
            {
                add_action( 'wp_before_admin_bar_render', array($this, 'hide_logo_admin_bar') );
            }

	        // Custom logo admin bar
            if (isset($settings['wp-logo-admin']) && !empty($settings['wp-logo-admin']))
            {
                $this->_custom_logo_admin_bar = $settings['wp-logo-admin'];
                add_action('add_admin_bar_menus', array($this, 'custom_logo_admin_bar'));
            }

	        // Custom logo in Login form
            if (isset($settings['custom-wp-login-logo']) && !empty($settings['custom-wp-login-logo']))
            {
                $this->_custom_login_logo = $settings['custom-wp-login-logo'];
                add_action( 'login_enqueue_scripts', array($this, 'custom_login_logo') );
            }

	        // Custom background in Login form
            if (isset($settings['background-wp-login-page']) && !empty($settings['background-wp-login-page']))
            {
                $this->_custom_login_background = $settings['background-wp-login-page'];
                add_action( 'login_enqueue_scripts', array($this, 'custom_login_background') );
            }

	        // Custom Login form css
            if (isset($settings['custom-login-css']) && !empty($settings['custom-login-css']))
            {
                $this->_custom_login_css = $settings['custom-login-css'];
                add_action( 'login_enqueue_scripts', array($this, 'custom_login_css') );
            }
        }

		/**
		 * Custom dashboard widget "Welcome Panel"
		 */
		public function custom_welcome_panel()
		{
			$is_admin = (current_user_can('administrator'))? TRUE : FALSE;
			$settings = $this->_get_settings();

			if (isset($settings['welcome-panel-heading']) && !empty($settings['welcome-panel-heading']))
			{
				$welcome_panel_heading = $settings['welcome-panel-heading'];
			}
			else
			{
				$welcome_panel_heading = 'Welcome to WordPress!';
			}

			if (isset($settings['welcome-panel-logo']) && !empty($settings['welcome-panel-logo']))
			{
				$welcome_panel_logo  = '<div style="height: 40px; width: 40px; margin-right: 15px; float: left; vertical-align: bottom;">';
				$welcome_panel_logo .= '<img style="max-width: 100%;" src="' . $settings['welcome-panel-logo'] . '" alt"">';
				$welcome_panel_logo .= '</div>';
			}
			else
			{
				$welcome_panel_logo = '';
			}

			if (isset($settings['welcome-panel-text']) && !empty($settings['welcome-panel-text']))
			{
				$welcome_panel_text = $settings['welcome-panel-text'];
			}
			else
			{
				$welcome_panel_text = '';
			}

			if (isset($settings['visible-welcome-group']) && !empty($settings['visible-welcome-group']))
			{
				$user_info = wp_get_current_user();

				if (isset($user_info->roles) && !empty($user_info->roles))
				{
					$role_user = $user_info->roles[0];

					if ('administrator' == $role_user)
					{
						$is_admin = TRUE;
					}
				}
			}

			$welcome_panel_html  = '<div class="welcome-panel-content">';

				// Title Welcome Box
				$welcome_panel_html .= $welcome_panel_logo . '<h3>' . __( $welcome_panel_heading ) . '</h3>';
				$welcome_panel_html .= '<p class="about-description">' . __( $welcome_panel_text ) . '</p>';

				if ($is_admin)
				{
					// Content Welcome Box
					$welcome_panel_html .= '<div class="welcome-panel-column-container">';

					// Column 1
					$welcome_panel_html .= '<div class="welcome-panel-column">';
						$welcome_panel_html .= '<h4>' . __( "Get Started" ) . '</h4>';
						$welcome_panel_html .= '<a class="button button-primary button-hero load-customize hide-if-no-customize" href="' . wp_customize_url() . '">' . __( 'Customize Your Site' ) . '</a>';
						$welcome_panel_html .= '<p class="hide-if-no-customize">' .  __( 'or, <a href="' . admin_url( 'themes.php' ) . '">change your theme completely</a>' ) . '</p>';
					$welcome_panel_html .= '</div>';

					// Column 2
					$welcome_panel_html .= '<div class="welcome-panel-column">';
					$welcome_panel_html .= '<h4>' . __( 'Next Steps' ) . '</h4>';
					$welcome_panel_html .= '<ul>';

						if ( 'page' == get_option( 'show_on_front' ) && ! get_option( 'page_for_posts' ) )
						{
							$welcome_panel_html .= '<li><a href="' . get_edit_post_link( get_option( 'page_on_front' ) ) . '" class="welcome-icon welcome-edit-page">' . __( 'Edit your front page' ) . '</a></li>';
							$welcome_panel_html .= '<li><a href="' . admin_url( 'post-new.php?post_type=page' ) . '" class="welcome-icon welcome-add-page">' . __( 'Add additional pages' ) . '</a></li>';
						}
						elseif ( 'page' == get_option( 'show_on_front' ) )
						{
							$welcome_panel_html .= '<li><a href="' . get_edit_post_link( get_option( 'page_on_front' ) ) . '" class="welcome-icon welcome-edit-page">' . __( 'Edit your front page' ) . '</a></li>';
							$welcome_panel_html .= '<li><a href="' . admin_url( 'post-new.php?post_type=page' ) . '" class="welcome-icon welcome-add-page">' . __( 'Add additional pages' ) . '</a></li>';
							$welcome_panel_html .= '<li><a href="' . admin_url( 'post-new.php' ) . '" class="welcome-icon welcome-write-blog">' . __( 'Add a blog post' ) . '</a></li>';
						}
						else
						{
							$welcome_panel_html .= '<li><a href="' . admin_url( 'post-new.php' ) . '" class="welcome-icon welcome-write-blog">' . __( 'Write your first blog post' ) . '</a></li>';
							$welcome_panel_html .= '<li><a href="' . admin_url( 'post-new.php?post_type=page' ) . '" class="welcome-icon welcome-add-page">' . __( 'Add an About page' ) . '</a></li>';
						}

						$welcome_panel_html .= '<li><a href="' . home_url( '/' ) . '" class="welcome-icon welcome-view-site">' . __( 'View your site' ) . '</a></li>';
						$welcome_panel_html .= '</ul>';
					$welcome_panel_html .= '</div>';

					// Column 3
					$welcome_panel_html .= '<div class="welcome-panel-column welcome-panel-last">';
						$welcome_panel_html .= '<h4>' .  __( 'More Actions' ) . '</h4>';
							$welcome_panel_html .= '<ul>';
								$welcome_panel_html .= '<li><div class="welcome-icon welcome-widgets-menus">' . __( 'Manage <a href="' . admin_url( 'widgets.php' ) . '">widgets</a> or <a href="' . admin_url( 'nav-menus.php' ) . '">menus</a>' ) . '</div></li>';
								$welcome_panel_html .= '<li><a href="' . admin_url( 'options-discussion.php' ) . '" class="welcome-icon welcome-comments">' . __( 'Turn comments on or off' ) . '</a></li>';
								$welcome_panel_html .= '<li><a href="' . __( 'http://codex.wordpress.org/First_Steps_With_WordPress' ) . '" class="welcome-icon welcome-learn-more">' . __( 'Learn more about getting started' ) . '</a></li>';
							$welcome_panel_html .= '</ul>';
						$welcome_panel_html .= '</div>';

					$welcome_panel_html .= '</div>';
				}

			$welcome_panel_html .= '</div>';

			echo $welcome_panel_html;
		}

		/**
		 * Saving new settings
		 */
		private function _save_settings()
		{
			// Authorization settings
			$this->_tune_custom_admin_url();

            delete_option('cherry-white-label-settings');

			if (add_option('cherry-white-label-settings', $_POST))
			{
				if (isset($_POST['visible-welcome-group']) && !empty($_POST['visible-welcome-group']))
				{
					global $wp_roles;
					$all_roles = $wp_roles->roles;
					$visible_welcome_panel = $_POST['visible-welcome-group'];

					if (isset($all_roles) && !empty($all_roles))
					{
						foreach ($all_roles as $role => $value)
						{
							if (isset($_POST['visible-welcome-panel']) && 'on' == $_POST['visible-welcome-panel'])
							{
								if (in_array($role, $visible_welcome_panel))
								{
									$this->_role_caps($role, 'edit_theme_options', 'add_cap');
								}
								else
								{
									$this->_role_caps($role, 'edit_theme_options', 'remove_cap');
								}
							}
							else
							{
								if ('administrator' != $role)
								{
									$this->_role_caps($role, 'edit_theme_options', 'remove_cap');
								}
							}
						}
					}
				}

				$this->_update_settings = TRUE;
			}
		}

		/**
		 * Expands the rights of the role
		 *
		 * @param $role
		 * @param $cap
		 * @param $method
		 */
		private function _role_caps($role, $cap, $method)
		{
			$info_role = get_role($role);
			$info_role->$method($cap);
		}

		/**
		 * Create automatically .htaccess file
		 *
		 * @return bool
		 */
		private function _create_htaccess()
		{
			$new_data  = "# BEGIN WordPress\n";
			$new_data .= "<IfModule mod_rewrite.c>\n";
			$new_data .= "RewriteEngine On\n";
			$new_data .= "RewriteBase /\n";
			$new_data .= "RewriteRule ^index\.php$ - [L]\n";
			$new_data .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
			$new_data .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
			$new_data .= "RewriteRule . /index.php [L]\n";
			$new_data .= "</IfModule>\n";
			$new_data .= "# END WordPress\n";

			$fn_htaccess = $this->_get_home_path() . '.htaccess';
			if (@file_put_contents($fn_htaccess, $new_data))
			{
				return TRUE;
			}

			return FALSE;
		}

		/**
		 * Message Notice "Error create automatically .htaccess"
		 */
		public function htaccess_notice()
		{
			echo "
				<div class='update-nag'>
					<p>The <code>.htaccess</code> file was not created automatically. Please be sure that the access rights of the directory \"" . $this->_get_home_path() . "\" are set to <b>757</b>.</p>
					<p> You may create <code>.htaccess</code> file manualy by yourself.</p>
				</div>";
		}

		/**
		 * Replace lostpassword URL in Form authorization
		 *
		 * @param $url
		 *
		 * @return mixed
		 */
		public function _custom_lostpassword_url($url)
		{
			$wp_login_path = $this->_get_custom_login_url();
			$custom_admin_slug = get_option('custom_wp_admin_slug');
			$custom_wp_forgot_password_slug = get_option('custom_wp_forgot_password_slug');

			if ($wp_login_path . '?action=lostpassword' == $url && get_option('is_forgot_password_slug'))
			{
				$url = str_replace($custom_admin_slug . '?action=lostpassword', $custom_wp_forgot_password_slug, $url);
			}
			return $url;
		}

		/**
		 * Replace login URL in Form authorization
		 *
		 * @param $url
		 *
		 * @return string
		 */
		public function _replace_login_url($url)
		{
			$scheme = 'http://';
			$domain = '';
			$now_path = '/wp-login.php';
			$url_info = $this->_get_url();
			$custom_admin_slug = get_option('custom_wp_admin_slug');
			$custom_wp_forgot_password_slug = get_option('custom_wp_forgot_password_slug');

			if (isset($url_info['scheme']) && !empty($url_info['scheme']))
			{
				$scheme = $url_info['scheme'] . '://';
			}

			if (isset($url_info['domain']) && !empty($url_info['domain']))
			{
				$domain = $url_info['domain'];
			}

			if (isset($url_info['path']) && !empty($url_info['path']))
			{
				$now_path = $url_info['path'];
			}

			if (isset($url_info['rewrite_base']) && !empty($url_info['rewrite_base']))
			{
				$subdomain = '/' . $url_info['rewrite_base'];
				$wp_domain = $scheme . $domain . $subdomain;
				$wp_login_path = $wp_domain . $now_path;
			}
			else
			{
				$wp_domain = $scheme . $domain;
				$wp_login_path = $scheme . $domain . $now_path;
			}

			if ($wp_login_path == $url && get_option('is_admin_slug'))
			{
				return $wp_domain . '/' . $custom_admin_slug;
			}
			else if ($wp_login_path . '?action=lostpassword' == $url && get_option('is_forgot_password_slug'))
			{
				return $wp_domain . '/' . $custom_wp_forgot_password_slug;
			}

			return $url;
		}

		/**
		 * Custom login URL
		 */
		public function _custom_login_url()
		{
			if (in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php')) && (get_option('custom_wp_admin_slug') != FALSE && get_option('custom_wp_admin_slug') != ''))
			{
				// check if our plugin have written necesery line to .htaccess, sometimes WP doesn't write correctly so we don't want to disable login in that case
				$markerdata = explode("\n", implode('', file($this->_get_home_path() . '.htaccess')));
				$found = FALSE;
				$url = $this->_get_url();

				foreach ($markerdata as $line)
				{
					if (trim($line) == 'RewriteRule ^' . get_option('custom_wp_admin_slug') . '/?$ ' . ($url['rewrite_base'] ? '/'.$url['rewrite_base'] : '') . '/wp-login.php [QSA,L]')
					{
						$found = TRUE;
					}
				}

				if ($found)
				{
					$this->_custom_login($url);
				}
			}
		}

		/**
		 * Custom login (Redirecting)
		 */
		private function _custom_login($url)
		{
			// start session if doesn't exist
			if (!session_id())
			{
				session_start();
			}

			if (isset($url['rewrite_base']) && !empty($url['rewrite_base']))
			{
				$request_uri = '/' . $url['rewrite_base'] . '/' . get_option('custom_wp_admin_slug');
			}
			else
			{
				$request_uri = '/' . get_option('custom_wp_admin_slug');
			}

			if ($request_uri == $_SERVER['REQUEST_URI'] || $request_uri . '/' == $_SERVER['REQUEST_URI'])
			{
				if (is_user_logged_in())
				{
					wp_redirect( site_url('wp-admin') );
				}
			}
			else
			{
				if (isset($_SERVER['REQUEST_METHOD']) && 'GET' == $_SERVER['REQUEST_METHOD'])
				{
					if ('action=lostpassword' == $url['query'] || 'action=postpass' == $url['query'])
					{
						// Let user to this pages
					}
					else if ('action=logout' == substr($url['query'], 0, 13))
					{
						check_admin_referer('log-out');
						wp_logout();

						$slug = get_option('custom_wp_admin_slug');

						if (isset($slug) && !empty($slug))
						{
							wp_redirect( home_url( '/' . $slug ), 301);
						}
						else
						{
							wp_redirect( home_url( '/' ), 301 );
						}
					}
					else if ( isset( $_REQUEST['interim-login']) && '1' == $_REQUEST['interim-login'])
					{
						// Let user to this pages
					}
					else
					{
						wp_redirect( home_url( '/' ), 301 );
					}
				}
			}
		}

		/**
		 * Taken from "/wp-admin/includes/file.php"
		 *
		 * @return string
		 */
		private function _get_home_path()
		{
			$home = get_option( 'home' );
			$site_url = get_option( 'siteurl' );

			if ( ! empty( $home ) && 0 !== strcasecmp( $home, $site_url ) )
			{
				$wp_path_rel_to_home = str_ireplace( $home, '', $site_url ); /* $site_url - $home */
				$pos = strripos( str_replace( '\\', '/', $_SERVER['SCRIPT_FILENAME'] ), trailingslashit( $wp_path_rel_to_home ) );
				$home_path = substr( $_SERVER['SCRIPT_FILENAME'], 0, $pos );
				$home_path = trailingslashit( $home_path );
			}
			else
			{
				$home_path = ABSPATH;
			}

			return $home_path;
		}

		/**
		 * Return parsed url
		 *
		 * @return array
		 */
		private function _get_url()
		{
			$url = array();
			$url['scheme'] = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != "off" ? "https" : "http";
			$url['domain'] = $_SERVER['HTTP_HOST'];
			$url['port'] = isset($_SERVER["SERVER_PORT"]) && $_SERVER["SERVER_PORT"] ? $_SERVER["SERVER_PORT"] : "";
			$url['rewrite_base'] = ($host = explode( $url['scheme'] . "://" . $_SERVER['HTTP_HOST'], get_bloginfo('url') ) ) ? preg_replace("/^\//", "", implode("", $host)) : "";
			$url['path'] = $url['rewrite_base'] ? implode("", explode("/" . $url['rewrite_base'], $_SERVER["SCRIPT_NAME"])) : $_SERVER["SCRIPT_NAME"];
			$url['query'] = $_SERVER['QUERY_STRING'];
			return $url;
		}

		/**
		 *  Create or Update custom admin URL (.htaccess)
		 */
		public function _tune_custom_admin_url()
		{
			$rules = array();

			// Sanitize input
			$custom_wp_admin_slug = trim(sanitize_key(wp_strip_all_tags($_POST['admin-panel-slug'])));
			$custom_wp_forgot_password_slug = trim(sanitize_key(wp_strip_all_tags($_POST['forgot-password-slug'])));

			if (!empty($custom_wp_admin_slug))
			{
				update_option('is_admin_slug', TRUE);
				update_option('custom_wp_admin_slug', $custom_wp_admin_slug);
				$rules['custom_admin_slug'] = $custom_wp_admin_slug;
			}
			else
			{
				update_option('is_admin_slug', FALSE);
				delete_option('custom_wp_admin_slug');
				$rules['custom_admin_slug'] = FALSE;
			}

			if (!empty($custom_wp_forgot_password_slug))
			{
				update_option('is_forgot_password_slug', TRUE);
				update_option('custom_wp_forgot_password_slug', $custom_wp_forgot_password_slug);
				$rules['custom_forgot_password_slug'] = $custom_wp_forgot_password_slug;
			}
			else
			{
				update_option('is_forgot_password_slug', FALSE);
				delete_option('custom_wp_forgot_password_slug');
				$rules['custom_forgot_password_slug'] = FALSE;
			}

			// Overwrites the data file .htaccess
			$update_htaccess = $this->_overwrites_htaccess($rules);

			if (isset($update_htaccess['error']) && !empty($update_htaccess['error']))
			{
				return $update_htaccess;
			}
		}

		/**
		 * Overwrites the data file .htaccess
		 *
		 * @param $rules
		 */
		private function _overwrites_htaccess($rules)
		{
			$subdomain = '';
			$ht_login = '';
			$ht_forgot_password = '';
			$home_path = ABSPATH;
			$settings = $this->_get_settings();

			if (isset($_SERVER['REQUEST_URI']) && !empty($_SERVER['REQUEST_URI']))
			{
				if (isset($_GET['page']) && !empty($_GET['page']))
				{
					$subdomain = str_replace('/wp-admin/admin.php?page=' . $_GET['page'], '', $_SERVER['REQUEST_URI']);
				}
				else
				{
					$subdomain = str_replace('/wp-admin/admin.php?page=cherry-white-label-settings', '', $_SERVER['REQUEST_URI']);
				}
			}

			update_option('custom_subdomain_admin_slug', $subdomain);

			$old_ht_login = !empty($settings['admin-panel-slug']) ? $settings['admin-panel-slug'] : FALSE ;
			$old_ht_password_slug = !empty($settings['forgot-password-slug']) ? $settings['forgot-password-slug'] : FALSE ;

			if ($rules['custom_admin_slug'])
			{
				$ht_login = 'RewriteRule ^' . $rules['custom_admin_slug'] . '/?$ ' . $subdomain . '/wp-login.php [QSA,L]' . "\n";
			}

			if ($rules['custom_forgot_password_slug'])
			{
				$ht_forgot_password = 'RewriteRule ^' . $rules['custom_forgot_password_slug'] . '/?$ ' . $subdomain . '/wp-login.php?action=lostpassword [QSA,L]' . "\n";
			}

			if ((!file_exists($home_path . '.htaccess') && is_writable($home_path)) || is_writable($home_path . '.htaccess'))
			{
				$found = FALSE;
				$not_exist_rules = FALSE;
				$new_data = '';
				$marker_data = explode("\n", implode('', file($home_path . '.htaccess')));

				if (in_array('# BEGIN WordPress', $marker_data))
				{
					if ( in_array( '<IfModule mod_rewrite.c>', $marker_data ) )
					{
						foreach ( $marker_data as $line )
						{
							if ( $line == '# BEGIN WordPress' )
							{
								$found = TRUE;
							}

							if ( $found )
							{
								if ( 'RewriteRule ^' . $old_ht_login . '/?$ ' . $subdomain . '/wp-login.php [QSA,L]' == $line
								     || 'RewriteRule ^' . $old_ht_password_slug . '/?$ ' . $subdomain . '/wp-login.php?action=lostpassword [QSA,L]' == $line
								)
								{
									$line = '';
									$new_data .= $line;
								}
								else
								{
									$new_data .= $line . "\n";
								}

								if ( 'RewriteRule ^index\.php$ - [L]' == $line )
								{
									$new_data .= $ht_login;
									$new_data .= $ht_forgot_password;
								}
							}

							if ( $line == '# END WordPress' )
							{
								$found = FALSE;
							}
						}
					}
					else
					{
						$new_data .= "<IfModule mod_rewrite.c>\n";
						$new_data .= "RewriteEngine On\n";
						$new_data .= "RewriteBase " . $subdomain . "/\n";
						$new_data .= "RewriteRule ^index\.php$ - [L]\n";

						if ($rules['custom_admin_slug'])
						{
							$new_data .= $ht_login;
						}

						if ($rules['custom_forgot_password_slug'])
						{
							$new_data .= $ht_forgot_password;
						}

						$new_data .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
						$new_data .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
						$new_data .= "RewriteRule . " . $subdomain . "/index.php [L]\n";
						$new_data .= "</IfModule>\n";
						$not_exist_rules = TRUE;
					}
				}
				else
				{
					$new_data .= "# BEGIN WordPress\n";
					$new_data .= "<IfModule mod_rewrite.c>\n";
					$new_data .= "RewriteEngine On\n";
					$new_data .= "RewriteBase " . $subdomain . "/\n";
					$new_data .= "RewriteRule ^index\.php$ - [L]\n";

					if ($rules['custom_admin_slug'])
					{
						$new_data .= $ht_login;
					}

					if ($rules['custom_forgot_password_slug'])
					{
						$new_data .= $ht_forgot_password;
					}

					$new_data .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
					$new_data .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
					$new_data .= "RewriteRule . " . $subdomain . "/index.php [L]\n";
					$new_data .= "</IfModule>\n";
					$new_data .= "# END WordPress\n";
				}

				if ($not_exist_rules)
				{
					insert_with_markers($home_path . '.htaccess', 'WordPress', explode("\n", $new_data));
				}
				else
				{
					$fn_htaccess = $home_path . '.htaccess';
					file_put_contents($fn_htaccess, $new_data);
				}
			}
			else
			{
				return array('error' => array(
					'message' => "The <code>.htaccess</code> file was not created automatically. Please be sure that the access rights of the directory \"" . $this->_get_home_path() . "\" are set to <b>757</b>."));
			}
		}

        /**
         * Custom login page background
         */
        public function custom_login_background()
        {
            echo '
                <style type="text/css" media="screen">
                    .login-action-login{
                        background-image:url("' . $this->_custom_login_background . '") !important;
                        background-size: cover;
                    }
                </style>
            ';
        }

        /**
         * Custom login page logo
         */
        public function custom_login_logo()
        {
            echo '
                <style type="text/css" media="screen">
                    .login h1 a { background-image: url("'.$this->_custom_login_logo.'") !important; }
                </style>
            ';
        }

        /**
         * Custom login page css
         */
        public function custom_login_css()
        {
            echo '
                <style type="text/css" media="screen">'.$this->_custom_login_css.'</style>
            ';
        }

        /**
         * Custom logo admin bar
         */
        public function custom_logo_admin_bar()
        {
            remove_action( 'admin_bar_menu', 'wp_admin_bar_wp_menu', 10 );
            add_action( 'admin_bar_menu', array($this, 'custom_logo_admin_bar_bottom'), 10 );
        }

        /**
         * Custom admin bar Logo Bottom
         * @param $wp_admin_bar
         */
        public function custom_logo_admin_bar_bottom( $wp_admin_bar )
        {
            $wp_admin_bar->add_menu( array(
                'id'    => 'wp-logo',
                'title' => '<img style="max-width:16px; height:16px; padding-top: 8px; padding-left: 5px; padding-right: 5px; vertical-align: top;" src="'. $this->_custom_logo_admin_bar .'" alt="" >',
                'href'  => home_url(''),
            ) );
        }

        /**
         * Hide options admin bar
         */
        public function hide_options_admin_bar()
        {
            global $wp_admin_bar;
            $wp_admin_bar->remove_menu('updates');
            $wp_admin_bar->remove_menu('site-name');
        }

        /**
         * Hide logo Wordpress in admin bar
         */
        public function hide_logo_admin_bar()
        {
            global $wp_admin_bar;
            $wp_admin_bar->remove_menu('wp-logo');
        }

        /**
         * Developer link
         */
        public function custom_footer_text()
        {
            echo '<a href="' . $this->_dev_website_url . '">' . $this->_dev_website_text . '</a>';
        }

        /**
         * Hide "Footer version Wordpress"
         */
        public function hide_footer_wp_version()
        {
            remove_filter( 'update_footer', 'core_update_footer' );
        }

        /**
         * Hide "Help box"
         */
        public function hide_help_box()
        {
            echo '<style type="text/css">#contextual-help-link-wrap { display: none !important; }</style>';
        }

        /**
         * Hide "Screen options"
         * @return bool
         */
        public function remove_screen_options_tab()
        {
            return FALSE;
        }

        /**
		 * Register menu plugin
		 */
		public function register_menu_plugin()
		{
			add_menu_page(
				'White Label',
				'White Label',
				'manage_options',
				'cherry-white-label-settings',
				array($this, '_plugin_settings_page'),
				'',
				81
			);
		}

        /**
		 * Plugin settings page options
		 */
		public function _plugin_settings_page()
		{
			if (file_exists(CHERRY_WHITE_LABEL_DIR . 'templates/admin/page-settings.php'))
			{
				$data = $this->_get_settings();

				if ( !empty($_POST)
				     && wp_verify_nonce($_POST['cherry-white-label-settings-value'], 'cherry-white-label-settings')
					 && !$error_message = $this->_validate_settings($_POST))
				{
					// Authorization settings
					$error_custom_url = $this->_tune_custom_admin_url();

					if (isset($error_custom_url['error']['message']) && !empty($error_custom_url['error']['message']))
					{
						$error_message = array('error_message' => $error_custom_url['error']['message']);
					}

					if ($this->_update_settings)
					{
						$success_message = __('Saved successfully');
						$data = $_POST;
					}
				}

				$width_image    = 90;
				$height_image   = 90;

				$image_src      = $no_image = CHERRY_WHITE_LABEL_URI . 'admin/assets/images/no-image90x90.png';
				global $wp_roles;
				$roles = $wp_roles->roles;

				if (isset($roles) && !empty($roles))
				{
					foreach($roles as $role => $role_info)
					{
						$roles[$role] = array(
							'name' => $role_info['name'],
						);

						if (isset($data['visible-welcome-group']) && !empty($data['visible-welcome-group']))
						{
							foreach ($data['visible-welcome-group'] as $visible_role)
							{
								if ($role == $visible_role)
								{
									$roles[$role] = array_merge($roles[$role], array('selected' => TRUE));
								}
							}
						}
					}
				}

				require_once CHERRY_WHITE_LABEL_DIR . 'templates/admin/page-settings.php';
			}
		}

		/**
		 * Get settings Cherry White Label
		 *
		 * @return mixed|void
		 */
		private function _get_settings()
		{
			return get_option('cherry-white-label-settings');
		}

		/**
		 * Validate form settings
		 * @param $data
		 *
		 * @return array|bool
		 */
		private function _validate_settings($data)
		{
			$errors = array();

			if (!empty($errors))
			{
				$errors = array_merge(
					array('error_message' => __('Error validate data')),
					$errors
				);

				return $errors;
			}

			return FALSE;
		}

		/**
		 * Get custom login url
		 * @param array $attr
		 *
		 * @return string
		 */
		private function _get_custom_login_url($attr = array())
		{
			$attr_url = '';
			$url_info = $this->_get_url();
			$custom_slug = get_option('custom_wp_admin_slug');

			if (isset($url_info['scheme']) && !empty($url_info['scheme']))
			{
				$scheme = $url_info['scheme'] . '://';
			}

			if (isset($url_info['domain']) && !empty($url_info['domain']))
			{
				$domain = $url_info['domain'];
			}

			if ( is_array($attr) && !empty($attr) )
			{
				$key_attr = key($attr);
				$val_attr = $attr[$key_attr];
				$attr_url = '?' . $key_attr . '=' . $val_attr;
			}

			if (isset($url_info['rewrite_base']) && !empty($url_info['rewrite_base']))
			{
				$wp_domain = $scheme . $domain . '/' . $url_info['rewrite_base'];
				return $wp_domain . '/' . $custom_slug . $attr_url;
			}
			else
			{
				return $scheme . $domain . '/' . $custom_slug . $attr_url;
			}
		}

		/**
		 * Enqueue admin assets
		 *
		 * @since  1.0.0
		 *
		 * @param  string  $hook  admin page hook
		 */
		public function admin_assets( $hook ) {
			if( strpos( $hook, 'cherry-white-label' ) !== false ){

				// Styles
				wp_enqueue_style(
					'cherry-white-label-style',
					CHERRY_WHITE_LABEL_URI . 'admin/assets/css/cherry-white-label.css',
					array(),
					CHERRY_WHITE_LABEL_VERSION
				);

				if ( ! did_action( 'wp_enqueue_media' ) ) {
					wp_enqueue_media();
				}

				// Scripts
				wp_enqueue_script(
					'cherry-white-label-script',
					CHERRY_WHITE_LABEL_URI . 'admin/assets/js/min/cherry-white-label.min.js',
					array( 'jquery' ),
					CHERRY_WHITE_LABEL_VERSION,
					true
				);

				$optionsPageSettings = array();

				if ( get_option('is_admin_slug') )
				{
					$optionsPageSettings['interim_url'] = $this->_get_custom_login_url(array( 'interim-login' => 1 ));
				}

				wp_localize_script( 'cherry-white-label-script', 'optionsPageSettings', $optionsPageSettings);
			}
		}

	}

	new CherryWhiteLabelInit();
}