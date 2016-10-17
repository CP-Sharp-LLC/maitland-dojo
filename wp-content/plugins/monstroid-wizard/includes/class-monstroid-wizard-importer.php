<?php
/**
 * Add cherry theme import sample content controllers
 *
 * @package   monstroid_wizard
 * @author    Cherry Team
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * main importer class
 *
 * @since  1.0.0
 */
class monstroid_wizard_importer {

	/**
	 * Check if auto upload is avaliable
	 *
	 * @since  1.0.0
	 */
	public $auto_upload = true;

	/**
	 * Remote uploads folder status message
	 *
	 * @since  1.0.0
	 */
	public $theme_folder_status = 200;

	/**
	 * Transient name to save file list in
	 *
	 * @since  1.0.0
	 */
	public $transient_key = 'monstroid_wizard_uploads';


	function __construct() {

		add_filter(
			'cherry_data_manager_conditions_cherry-content-import',
			array( $this, 'add_conditions_for_importer_page' )
		);

		add_filter( 'cherry_data_manager_import_key', array( $this, 'set_key_for_importer' ) );
	}

	/**
	 * add wizard importer page to data manager
	 *
	 * @since 1.0.0
	 */
	public function add_conditions_for_importer_page( $condition ) {

		global $monstroid_wizard;

		if ( isset( $_GET['page'] )
			&& isset( $_GET['step'] )
			&& $monstroid_wizard->slug == $_GET['page']
			&& 'content-install' == $_GET['step']
		) {
			return true;
		}

		return $condition;
	}

	/**
	 * Pass cherry license key ( or 'demo' for demo theme installation ) to importer plugin
	 *
	 * @since 1.0.0
	 */
	public function set_key_for_importer( $key ) {
		global $monstroid_wizard;

		if ( isset( $_REQUEST['type'] ) && 'premium' == $_REQUEST['type'] ) {
			// if is premium theme installation - return cherry key
			return $monstroid_wizard->cherry_key;
		} else {
			// if is demo theme installation or undefined installation type - return 'demo'
			return 'demo';
		}
	}

}

global $monstroid_wizard;
$monstroid_wizard->importer = new monstroid_wizard_importer();