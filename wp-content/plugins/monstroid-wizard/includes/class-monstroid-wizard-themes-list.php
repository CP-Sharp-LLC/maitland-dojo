<?php
/**
 * Add admin interface
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Monstroid_Wizard_Themes_List {

	/**
	 * A reference to an instance of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Current themes query data
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private $query_data = array();

	function __construct() {
		add_action( 'wp_ajax_monstroid_wizard_get_themes_page', array( $this, 'pager_callbak' ) );
	}

	/**
	 * Get TM themes list array
	 *
	 * @return array
	 */
	public function get_themes( $page = 1, $per_page = 4 ) {

		global $monstroid_wizard;

		$page     = absint( $page );
		$per_page = absint( $per_page );

		if ( ! $page ) {
			$page = 1;
		}

		if ( ! $per_page ) {
			$per_page = 4;
		}

		$offset = $per_page * ( $page - 1 );

		$url = add_query_arg(
			array(
				'cherry_action' => 'get-themes-list',
				'offset'        => $offset,
				'per_page'      => $per_page
			),
			$monstroid_wizard->cherry_cloud_url
		);

		$response = wp_remote_get( $url );
		$response = $this->validate_response( $response );

		if ( ! $response ) {
			return array();
		}

		$result = '';
		$theme_item = '<div class="wizard-col-2">
			<div class="wizard-theme-item">
				<h4 class="wizard-theme-item-title">%6$s</h4>
				<div class="wizard-theme-item-thumb">
					<img src="%1$s" alt="">
				</div>
				<div class="wizard-theme-item-actions">
					<a href="%2$s" class="button-default_ live-demo" target="_blank">
						<span class="dashicons dashicons-desktop"></span>%3$s
					</a>
					<a href="#" data-template="%4$s" class="button-primary_ install">
						<span class="dashicons dashicons-download"></span>%5$s
					</a>
				</div>
			</div>
		</div>';

		$this->clear_screens_data();

		foreach ( $response['themes'] as $theme ) {

			$result .= sprintf(
				$theme_item,
				$theme['screen_md'],
				$theme['livedemo'], __( 'Live Demo', $monstroid_wizard->slug ),
				$theme['template_id'], __( 'Install', $monstroid_wizard->slug ),
				'Theme ' . $theme['template_id']
			);

			$this->store_large_screen( $theme['template_id'], $theme['screen_lg'] );

		}

		$total_pages = ceil( $response['count'] / $per_page );

		// prepare current query data to build pager after themes list
		$this->query_data = array(
			'page'        => $page,
			'total_pages' => $total_pages
		);

		return $result;

	}

	/**
	 * Build themes list pager
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function get_pager() {

		if ( empty( $this->query_data ) ) {
			return;
		}

		global $monstroid_wizard;

		$page_format = '<div class="wizard-pager-item">
			<a href="#" data-page="%1$s" class="wizard-pager-item-link page-item%2$s">%3$s</a>
		</div>';
		$direct_format = '<div class="wizard-pager-item item-%4$s">
			<a href="#" data-page="%1$s" class="wizard-pager-item-link%2$s %4$s">%3$s</a>
		</div>';

		$pages = '';

		for ( $i = 1; $i <= $this->query_data['total_pages']; $i++) {

			$current = ( $this->query_data['page'] == $i ) ? ' current-page' : '';

			$pages .= sprintf(
				$page_format,
				$i, $current, __( 'page', $monstroid_wizard->slug ) . ' ' . $i
			);
		}

		if ( $this->query_data['page'] == 1 ) {
			$prev_num      = $this->query_data['page'];
			$prev_disabled = ' disabled';
		} else {
			$prev_num      = $this->query_data['page'] - 1;
			$prev_disabled = '';
		}

		if ( $this->query_data['page'] == $this->query_data['total_pages'] ) {
			$next_num      = $this->query_data['page'];
			$next_disabled = ' disabled';
		} else {
			$next_num      = $this->query_data['page'] + 1;
			$next_disabled = '';
		}

		$prev = sprintf(
			$direct_format,
			$prev_num, $prev_disabled, __( 'prev', $monstroid_wizard->slug ), 'prev-page'
		);

		$next = sprintf(
			$direct_format,
			$next_num, $next_disabled, __( 'next', $monstroid_wizard->slug ), 'next-page'
		);

		$pages = '<div class="wizard-pages-list">' . $pages . '</div>';

		return sprintf( '<div class="wizard-pager">%s</div>', $next . $prev . $pages );

	}

	/**
	 * Ajax pager callack for themes list
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function pager_callbak() {

		if ( ! current_user_can( 'switch_themes' ) ) {
			die();
		}

		$page = isset( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : false;

		if ( ! $page ) {
			die();
		}
		?>
		<div class="wizard-row">
		<?php
			echo $this->get_themes( $page, 4 );
		?>
		</div>
		<?php
			echo $this->get_pager();

		die();

	}

	/**
	 * Store large screen for next step
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function store_large_screen( $id, $screen ) {

		if ( ! isset( $_SESSION['cherry_screens'] ) ) {
			$_SESSION['cherry_screens'] = array();
		}

		$_SESSION['cherry_screens'][$id] = $screen;

	}

	/**
	 * Remove screens data before new themes list building
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function clear_screens_data() {
		if ( isset( $_SESSION['cherry_screens'] ) ) {
			$_SESSION['cherry_screens'] = array();
		}
	}

	/**
	 * Check if we get valid response from wizard API
	 *
	 * @since  1.0.0
	 * @param  array|WP_Error  $response  API response
	 * @return bool|array
	 */
	public function validate_response( $response ) {

		if ( is_wp_error( $response ) ) {
			return false;
		}

		if ( ! isset( $response['response']['code'] ) || 200 != $response['response']['code'] ) {
			return false;
		}

		$body = $response['body'];

		$body = json_decode( $body, true );

		if ( ! is_array( $body ) ) {
			return false;
		}

		return $body;

	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 * @return object
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance )
			self::$instance = new self;

		return self::$instance;
	}

}

Monstroid_Wizard_Themes_List::get_instance();