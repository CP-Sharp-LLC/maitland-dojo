<?php
/**
 * Add cherry theme install helper class
 * Activate license if premium install. Save theme name and key for demo install
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( !class_exists( 'monstroid_wizard_helper' ) ) {

	/**
	 * Define helper class
	 *
	 * @since 1.0.0
	 */
	class monstroid_wizard_helper {

		/**
		 * Key server URL
		 *
		 * @since  1.0.0
		 * @var    string
		 */
		public $key_server = 'https://cloud.cherryframework.com/';

		/**
		 * include necessary files. Run actions
		 */
		function __construct() {

			// Check and activate license key
			add_action( 'wp_ajax_monstroid_wizard_validate_key', array( $this, 'check_license' ) );
			// Try to get child theme install links from API
			add_action( 'wp_ajax_monstroid_wizard_get_child_link', array( $this, 'get_child_links' ) );
			// Prepare main monstroid theme installation
			add_action( 'wp_ajax_monstroid_wizard_start_main_install', array( $this, 'prepare_main_install' ) );
			// Prepare advanced installation
			add_action( 'wp_ajax_monstroid_wizard_start_advanced_install', array( $this, 'prepare_advanced_install' ) );

		}

		/**
		 * Check and activate license key
		 *
		 * @since 1.0.0
		 */
		public function check_license() {

			//make sure request is comming from Ajax
			check_ajax_referer( 'monstroid_wizard', 'nonce' );

			if ( ! session_id() ) {
				session_start();
			}

			global $monstroid_wizard;

			$monstroid_wizard->cherry_key = isset($_REQUEST['key']) ? esc_attr( $_REQUEST['key'] ) : false;

			if ( !$monstroid_wizard->cherry_theme_name || !$monstroid_wizard->cherry_key ) {

				$key_class   = empty($monstroid_wizard->cherry_key) ? 'error' : 'success';

				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => $key_class,
					'message'   => __( 'Please, fill required fields', $monstroid_wizard->slug )
				) );
			}

			$request_uri = add_query_arg(
				array(
					'edd_action' => 'activate_license',
					'item_name'  => urlencode( $monstroid_wizard->cherry_theme_name ),
					'license'    => $monstroid_wizard->cherry_key
				),
				$this->key_server
			);

			global $wp_version;
			$key_request = wp_remote_get(
				$request_uri,
				array( 'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ) )
			);

			// Can't send request
			if ( is_wp_error( $key_request ) || ! isset($key_request['response']) ) {
				$this->send_license_response( array(
					'type'    => 'error',
					'message' => __( 'Can`t send activation request. ' . $key_request->get_error_message(), $monstroid_wizard->slug )
				) );
			}

			if ( 200 != $key_request['response']['code'] ) {
				$this->send_license_response( array(
					'type'    => 'error',
					'message' => __( 'Activation request error. ' . $key_request['response']['code'] . ' - ' . $key_request['response']['message'] . '. Please, try again later', $monstroid_wizard->slug )
				) );
			}

			$response = json_decode( $key_request['body'] );

			// Request generate unexpected result
			if ( ! is_object( $response ) || !isset( $response->success ) ) {
				$this->send_license_response( array(
					'type'    => 'error',
					'message' => __( 'Bad request.', $monstroid_wizard->slug )
				) );
			}

			// Requested license key is missing
			if ( ! $response->success && 'missing' == $response->error ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'error',
					'message'   => __( 'Wrong license key. Make sure activation key is correct.', $monstroid_wizard->slug )
				) );
			}

			// Hosts limit reached
			if ( ! $response->success && 'limit_reached' == $response->error ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'error',
					'message'   => __( 'Sorry, the license key you are trying to use exceeded the maximum amount of activations was applied for 3 domains', $monstroid_wizard->slug )
				) );
			}
			if ( ! $response->success && 'no_activations_left' == $response->error ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'error',
					'message'   => __( 'Sorry, the license key you are trying to use exceeded the maximum amount of activations was applied for 3 domains', $monstroid_wizard->slug )
				) );
			}

			// Unknown error
			if ( ! $response->success && $response->error ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'error',
					'message'   => $response->error
				) );
			}

			// Can not get the,e information from TM
			if ( empty( $response->tm_data->status ) || 'request failed' == $response->tm_data->status ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'success',
					'message'   => __( 'License key is invalid or evaluation expired. Please, contact Support Live Chat: <a href="http://chat.template-help.com/">http://chat.template-help.com/</a>', $monstroid_wizard->slug )
				) );
			}

			// Theme currently in queue
			if ( 'queue' == $response->tm_data->status ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'success',
					'message'   => __( 'Theme is not available yet. Please try again in 10 minutes.', $monstroid_wizard->slug )
				) );
			}

			// Theme currently removed from cloud
			if ( 'failed' == $response->tm_data->status ) {
				$this->send_license_response( array(
					'type'      => 'error',
					'key_class' => 'success',
					'message'   => __( 'Theme is not available. Please contact support team for help.', $monstroid_wizard->slug )
				) );
			}

			update_option( 'monstroid_key', $monstroid_wizard->cherry_key );

			set_transient( 'cherry_theme_name', $monstroid_wizard->cherry_theme_name, WEEK_IN_SECONDS );
			set_transient( 'cherry_key', $monstroid_wizard->cherry_key, WEEK_IN_SECONDS );

			$_SESSION['cherry_data'] = array(
				'theme'  => $response->tm_data->theme,
				'sample' => $response->tm_data->sample_data,
			);

			delete_option( 'monstroid_wizard_need_install' );
			update_option( 'monstroid_install_data', $_SESSION['cherry_data'] );

			$this->send_license_response( array(
				'message' => __( 'Everything is ready. Starting theme installation...', $monstroid_wizard->slug )
			) );

		}

		/**
		 * send AJAX license response with selected parameters via JSON
		 *
		 * @since  1.0.0
		 * @param  array  $result  array of arguments to send via JSON
		 */
		public function send_license_response( $result = array() ) {

			$default_result = array(
				'type'        => 'success',
				'key_class'   => 'success',
				'message'     => ''
			);

			$result = wp_parse_args( $result, $default_result );

			wp_send_json( $result );
		}

		/**
		 * Get child links to install
		 *
		 * @since 1.0.0
		 */
		public function get_child_links() {

			global $monstroid_wizard;

			if ( ! $_REQUEST['template_id'] || 0 == absint( $_REQUEST['template_id'] ) ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => __( 'Broken request data', $monstroid_wizard->slug )
				) );
			}

			$template_id = absint( $_REQUEST['template_id'] );
			$key         = get_transient( 'cherry_key' );

			if ( ! $key ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => __( 'License key not found', $monstroid_wizard->slug )
				) );
			}

			$url = add_query_arg(
				array(
					'action' => 'get-montroid-child-links',
					'key'    => $key,
					'theme'  => $template_id
				),
				$monstroid_wizard->cherry_cloud_url
			);

			global $wp_version;

			$request = wp_remote_get(
				$url,
				array( 'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ) )
			);

			if ( is_wp_error( $request ) ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => __( 'Can\'t send remote request', $monstroid_wizard->slug )
				) );
			}

			if ( ! isset( $request['body'] ) ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => __( 'Remote request failed', $monstroid_wizard->slug )
				) );
			}

			$result = json_decode( $request['body'], true );

			if ( ! is_array( $result ) ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => __( 'Invalid API response', $monstroid_wizard->slug )
				) );
			}

			if ( 'success' != $result['status'] ) {
				wp_send_json( array(
					'type'    => 'error',
					'message' => $result['message']
				) );
			}

			$links = $result['links'];

			$_SESSION['cherry_data'] = array(
				'theme'  => $links['theme'],
				'sample' => $links['sample_data']
			);

			$this->set_install_type( 'full' );

			// prepare screen
			if ( isset( $_SESSION['cherry_screens'] ) && is_array( $_SESSION['cherry_screens'] ) ) {
				foreach ( $_SESSION['cherry_screens'] as $id => $screen ) {
					if ( absint( $id ) == $template_id ) {
						continue;
					}
					unset( $_SESSION['cherry_screens'][$id] );
				}
			}

			wp_send_json( array(
				'type'    => 'success'
			) );

		}

		/**
		 * Prepare main monstroid theme install
		 */
		public function prepare_main_install() {

			global $monstroid_wizard;

			$links = $this->get_remote_links();

			if ( false !== $links ) {
				$theme  = $_SESSION['cherry_data']['theme']  = $links['theme'];
				$sample = $_SESSION['cherry_data']['sample'] = $links['sample'];
			} else {
				$theme  = isset( $_SESSION['cherry_data']['theme'] ) ? $_SESSION['cherry_data']['theme'] : false;
				$sample = isset( $_SESSION['cherry_data']['sample'] ) ? $_SESSION['cherry_data']['sample'] : false;
			}

			if ( isset( $_SESSION['cherry_screens'] ) ) {
				unset( $_SESSION['cherry_screens'] );
			}

			if ( ! $theme || ! $sample ) {

				$monstroid_data = get_option( 'monstroid_install_data' );

				if ( ! $monstroid_data ) {
					wp_send_json( array( 'status' => 'error' ) );
				}

				$theme  = $_SESSION['cherry_data']['theme']  = $monstroid_data['theme'];
				$sample = $_SESSION['cherry_data']['sample'] = $monstroid_data['sample'];

			}

			$monstroid = (string)$monstroid_wizard->cherry_theme_name;

			if ( false == strpos( $theme, $monstroid ) || false == strpos( $sample, $monstroid ) ) {
				$monstroid_data = get_option( 'monstroid_install_data' );

				if ( ! $monstroid_data ) {
					wp_send_json( array( 'status' => 'error' ) );
				}

				$_SESSION['cherry_data']['theme']  = $monstroid_data['theme'];
				$_SESSION['cherry_data']['sample'] = $monstroid_data['sample'];

			}

			$this->set_install_type( 'full' );

			wp_send_json( array( 'status' => 'success' ) );

		}

		/**
		 * Prepare advanced installation
		 *
		 * @return void
		 */
		public function prepare_advanced_install() {

			if ( ! current_user_can( 'import' ) ) {
				wp_send_json( array( 'status' => 'error' ) );
			}

			global $monstroid_wizard;

			if ( ! isset( $_REQUEST['type'] ) || 'advanced' !== esc_attr( $_REQUEST['type'] ) ) {
				$this->set_install_type( 'full' );
				wp_send_json( array( 'status' => 'success' ) );
			}

			$key = get_transient( 'cherry_key' );
			$url = add_query_arg(
				array(
					'action' => 'get-montroid-lite-content',
					'key'    => $key,
				),
				$monstroid_wizard->cherry_cloud_url
			);

			global $wp_version;

			$request = wp_remote_get(
				$url,
				array( 'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ) )
			);

			$data = wp_remote_retrieve_body( $request );

			if ( empty( $data ) ) {
				wp_send_json( array( 'status' => 'error' ) );
			}

			$data = json_decode( $data, true );

			if ( ! isset( $data['links']['sample_data'] ) ) {
				wp_send_json( array( 'status' => 'error' ) );
			}

			$_SESSION['cherry_data']['sample'] = $data['links']['sample_data'];

			$this->set_install_type( $_REQUEST['type'] );

			$install_data = get_option( 'monstroid_install_data' );
			$install_data['sample'] = $data['links']['sample_data'];

			update_option( 'monstroid_install_data', $install_data );

			wp_send_json( array( 'status' => 'success' ) );

		}

		/**
		 * Get remote links for monstroid downloading.
		 *
		 * @return array|bool
		 */
		function get_remote_links() {

			$key = get_option( 'monstroid_key' );

			if (!$key) {
				return false;
			}

			global $monstroid_wizard;

			$request_uri = add_query_arg(
				array(
					'edd_action' => 'activate_license',
					'item_name'  => urlencode( $monstroid_wizard->cherry_theme_name ),
					'license'    => get_option( 'monstroid_key' )
				),
				$this->key_server
			);

			global $wp_version;

			$key_request = wp_remote_get(
				$request_uri,
				array( 'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ) )
			);

			// Can't send request
			if ( is_wp_error( $key_request ) || ! isset($key_request['response']) ) {
				return false;
			}

			if ( 200 != $key_request['response']['code'] ) {
				return false;
			}

			$response = json_decode( $key_request['body'] );

			// Request generate unexpected result
			if ( ! is_object( $response ) || !isset( $response->success ) ) {
				return false;
			}

			// Requested license key is missing
			if ( ! $response->success && 'missing' == $response->error ) {
				return false;
			}

			// Hosts limit reached
			if ( ! $response->success && 'limit_reached' == $response->error ) {
				return false;
			}
			if ( ! $response->success && 'no_activations_left' == $response->error ) {
				return false;
			}

			// Unknown error
			if ( ! $response->success && $response->error ) {
				return false;
			}

			// Can not get the,e information from TM
			if ( empty( $response->tm_data->status ) || 'request failed' == $response->tm_data->status ) {
				return false;
			}

			// Theme currently in queue
			if ( 'queue' == $response->tm_data->status ) {
				return false;
			}

			// Theme currently removed from cloud
			if ( 'failed' == $response->tm_data->status ) {
				return false;
			}

			return array(
				'theme'  => $response->tm_data->theme,
				'sample' => $response->tm_data->sample_data
			);
		}

		/**
		 * Set current installation type
		 *
		 * @since  1.1.0
		 * @param  string $type current installation type.
		 * @return void
		 */
		public function set_install_type( $type ) {
			$_SESSION['monstroid_install_type'] = esc_attr( $type );
		}

	}

	global $monstroid_wizard;
	$monstroid_wizard->helper = new monstroid_wizard_helper();

}