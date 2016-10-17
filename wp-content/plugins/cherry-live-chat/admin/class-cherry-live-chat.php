<?php
if ( ! class_exists( 'Cherry_Live_Chat_Class' ) ) {
	/**
	 * Class for live chat logic.
	 */
	class Cherry_Live_Chat_Class {

		const VERSION = '1.0.1';

		protected static $instance = null;

		protected $slug = 'cherry-live-chat';
		protected $chat_url;
		protected $ticket_url;

		protected $api_key;
		protected $secret_key;
		protected $chat_key;
		protected $salt;
		protected $response;
		protected $status;

		/**
		 * Sets up needed actions/filters for the plugin to initialize.
		 *
		 * @since 1.0.0
		 */
		private function __construct() {

			if ( function_exists( 'is_customize_preview' ) && is_customize_preview() ) {
				return;
			}

			// Init
			$this->chat_url   = esc_url( 'http://www.cherryframework.com/chat/' );
			$this->ticket_url = esc_url( 'http://support.template-help.com/api/index.php' );
			$this->api_key    = 'T0dRNVpEWmpNelF0WVdNMU5DMWtNekUwTFRoa09HSXRNekU1TkdRMVpEZzRNbVZr';
			$this->secret_key = 'VG1wRmVFNXRWVEZhUkVsMFRqSk5kMDFETURWUFJHc3dURmRHYTFwWF	VYUk5iVTB3VFVST2FGcEVhelZPUjFwcVRWUkpNbGt5VFRST2VsRjBUa2RPYVU5VE1EUk5SR3N3VEZSSk1VMXFaM1JOUkVWNFRsZFNhMDFIVm1sWmVrVXg=';
			$this->chat_key   = 'YkdGclgyRnpaR2N6TkRVPQ==';
			$this->status     = $this->get_operator_status();

			// Loads stylesheet and javascript.
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

			// Print a dialog.
			add_action( 'admin_footer', array( $this, 'dialog' ) );

			// AJAX actions.
			add_action( 'wp_ajax_cherry_live_start_chat', array( $this, 'launch_chat' ) );
			add_action( 'wp_ajax_check_order',            array( $this, 'check_order' ) );
		}

		/**
		 * Enqueue admin-facing stylesheet.
		 *
		 * @since 1.0.0
		 */
		public function enqueue_styles() {
			wp_enqueue_style( $this->slug, plugins_url( 'assets/css/admin.css', __FILE__ ), array(), self::VERSION );
		}

		/**
		 * Register and enqueue admin-facing javascript.
		 *
		 * @since 1.0.0
		 */
		public function enqueue_scripts() {
			wp_register_script( $this->slug . '-livevalidation', plugins_url( 'assets/js/livevalidation_standalone.min.js', __FILE__ ), array( 'jquery' ), self::VERSION );
			wp_register_script( $this->slug . '-script', plugins_url( 'assets/js/admin.min.js', __FILE__ ), array( 'jquery', $this->slug . '-livevalidation' ), self::VERSION );

			// Localize the script with new data.
			$translate_data = array(
				'name_fail'      => __( 'Specify your name.', 'cherry-live-chat' ),
				'email_fail'     => __( 'Specify your email.', 'cherry-live-chat' ),
				'order_fail'     => __( 'Specify your Order ID.', 'cherry-live-chat' ),
				'subject_fail'   => __( 'Specify ticket subject.', 'cherry-live-chat' ),
				'message_fail'   => __( 'Specify ticket message.', 'cherry-live-chat' ),
				'select_default' => __( 'Please select a product', 'cherry-live-chat' ),
				'order_bad'      => __( 'Order ID is not correct.', 'cherry-live-chat' ),
			);
			wp_localize_script( $this->slug . '-script', 'message_text', $translate_data );

			wp_enqueue_script( $this->slug . '-livevalidation' );
			wp_enqueue_script( $this->slug . '-script' );
		}

		public function dialog() {

			if ( 1 == $this->status || 2 == $this->status ) {
				include_once( 'views/dialog-online.php' );
			} else {
				include_once( 'views/dialog-offline.php' );
			}
		}

		public function launch_chat() {
			$current_user = wp_get_current_user();

			$nick     = ( ! empty( $_REQUEST['chat_nick'] ) ) ? sanitize_text_field( $_REQUEST['chat_nick'] ) : $current_user->user_login;
			$email    = ( ! empty( $_REQUEST['chat_email'] ) ) ? sanitize_email( $_REQUEST['chat_email'] ) : $current_user->user_email;
			$order_id = ( ! empty( $_REQUEST['chat_order'] ) ) ? sanitize_text_field( $_REQUEST['chat_order'] ) : '';
			$subject  = ( ! empty( $_REQUEST['chat_subject'] ) ) ? sanitize_text_field( $_REQUEST['chat_subject'] ) : '';
			$message  = ( ! empty( $_REQUEST['chat_message'] ) ) ? sanitize_text_field( $_REQUEST['chat_message'] ) : '';
			$product  = ( ! empty( $_REQUEST['chat_product'] ) ) ? sanitize_text_field( $_REQUEST['chat_product'] ) : '';
			$room     = ( ! empty( $order_id ) ) ? 'support-cherry' : 'pre-sales-cherry';
			$referer  = $_SERVER['HTTP_REFERER'];

			if ( 1 == $this->status || 2 == $this->status ) {
				$chat_args['nick']        = $nick;
				$chat_args['email']       = $email;
				$chat_args['orderId']     = $order_id;
				$chat_args['room']        = $room;
				$chat_args['question']    = $message;
				$chat_args['referer']     = $referer;

				if ( !empty( $product ) ) {
					$product_data = explode( '#', $product );
					$chat_args['productType'] = trim( $product_data[0] );
					$chat_args['templateId']  = ltrim( $product_data[1], '#' );
				}

				ksort( $chat_args );

				$chat_args['key'] = md5( implode( '', $chat_args ) . base64_decode( base64_decode( $this->chat_key ) ) );
				$result['url']    = add_query_arg( urlencode_deep( $chat_args ), $this->chat_url );
				$result['status'] = 'success';
				$result['type']   = 'chat';

				wp_send_json( $result );

			} else {
				$signature = $this->generate_signature();
				$apikey    = base64_decode( base64_decode( $this->api_key ) );

				$params = array(
					'apikey'           => $apikey,
					'salt'             => $this->salt,
					'signature'        => $signature,
					'subject'          => $subject,
					'fullname'         => $nick,
					'email'            => $email,
					'contents'         => $message,
					'departmentid'     => 3,   // support
					'ticketstatusid'   => 1,   // open
					'ticketpriorityid' => '1', // issue
					'tickettypeid'     => 1,
					'orderid'          => $order_id,
					'autouserid'       => '1',
				);

				$http_code = $this->client( $this->ticket_url . '?/Tickets/Ticket', http_build_query( $params ) );

				$http_message = 'error';
				if ( 200 == $http_code ) {
					$http_message = 'success';
				}

				$result['status'] = $http_message;
				$result['type']   = 'ticket';

				wp_send_json( $result );
			}

			exit();
		}

		public function check_order() {

			if ( empty( $_REQUEST['chat_order'] ) ) {
				$result['status'] = 'error';
				wp_send_json( $result );
			}

			$order_id = sanitize_text_field( $_REQUEST['chat_order'] );

			$url = add_query_arg(
				urlencode_deep( array( 'orderId' => $order_id ) ),
				$this->chat_url . 'producttypes.jsp'
			);

			$response = wp_remote_get( $url );

			if ( is_wp_error( $response ) ) {
				$result['status'] = 'error';
				wp_send_json( $result );
			}

			if ( is_object( $response ) && ( $response['response']['code'] == 404 ) ) {
				$result['status'] = 'error';
				wp_send_json( $result );
			}

			if ( !is_wp_error( $response ) && ( $response['response']['code'] == 200 ) ) {
				$res = $response['body'];

				$order = new SimpleXMLElement( $res );

				if ( 'true' != $order->exists ) {
					$result['status'] = 'error';
					wp_send_json( $result );
				}

				$order_data = array();
				foreach ( $order->items->item as $item ) {
					if ( 'false' == $item->is_template ) {
						continue;
					}
					if ( ( false !== strpos( $item->type, 'WordPress' ) )
						|| ( false !== strpos( $item->type, 'WooCommerce' ) )
						) {
						$order_data[] = $item;
					}
				}

				if ( !empty( $order_data ) ) {
					$result['status']     = 'success';
					$result['order_data'] = $order_data;
					$result['count']      = count( $order_data );
				} else {
					$result['status'] = 'error';
				}

				wp_send_json( $result );
			}

			$result['status'] = 'error';
			wp_send_json( $result );
		}

		/**
		 * Get avaliable operators status.
		 *
		 * null - no rooms
		 * 0    - all operator are offline
		 * 1    - operator is online
		 * 2    - operator is online, but busy (away, XA, DND)
		 *
		 * @return int $status Operator status.
		 */
		private function get_operator_status( $room = 'pre-sales-cherry' ) {
			$status = get_transient( 'cherry_live_chat_operator_status' );

			if ( false !== $status ) {
				return $status;
			}

			$url = add_query_arg(
				array( 'room' => esc_attr( $room ), 'nocache' => 'true' ),
				$this->chat_url . 'status.jsp'
			);
			$response = wp_remote_get( $url );

			if ( is_wp_error( $response ) || empty( $response ) || $response ['response']['code'] != '200' ) {
				set_transient( 'cherry_live_chat_operator_status', 0, 5 * MINUTE_IN_SECONDS );
				return 0;
			}

			$status = wp_remote_retrieve_body( $response );
			$status = sanitize_text_field( $status );

			set_transient( 'cherry_live_chat_operator_status', $status, 5 * MINUTE_IN_SECONDS );

			return $status;
		}

		protected function generate_signature() {
			// Generates a random string of ten digits.
			$this->salt = mt_rand();

			// Computes the signature by hashing the salt with the secret key as the key.
			$signature = hash_hmac( 'sha256', $this->salt, base64_decode( base64_decode( $this->secret_key ) ), true );

			return base64_encode( $signature );
		}

		private function client( $url, $data ) {
			$request = $data;
			$curl    = curl_init( $url );
			curl_setopt( $curl, CURLOPT_POST, 1 );
			curl_setopt( $curl, CURLOPT_TIMEOUT, 40 );
			curl_setopt( $curl, CURLOPT_NOPROGRESS, 1 );
			curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
			curl_setopt( $curl, CURLOPT_POSTFIELDS, $request );
			$ret = stripcslashes( curl_exec( $curl ) );
			$this->response = $ret;
			$http_code = curl_getinfo( $curl, CURLINFO_HTTP_CODE );
			curl_close( $curl );

			return $http_code;
		}

		public static function get_instance() {

			// If the single instance hasn't been set, set it now.
			if ( null == self::$instance ) {
				self::$instance = new self;
			}

			return self::$instance;
		}

	}

	add_action( 'after_setup_theme', array( 'Cherry_Live_Chat_Class', 'get_instance' ), 11 );
}