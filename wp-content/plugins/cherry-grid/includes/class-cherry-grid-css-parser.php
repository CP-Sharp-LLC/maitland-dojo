<?php
/**
 * Parse CSS template and replace macros with callbaks
 *
 * @package   Cherry_Grid Shortcode CSS
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
	die;
}

/**
 * Parse CSS template and replace macros with callbaks
 *
 * @since 1.0.0
 */
class Cherry_Grid_CSS_Parser {

	/**
	 * Parent CSS class
	 */
	public $class = null;

	/**
	 * Path to CSS template file
	 */
	public $template = null;

	/**
	 * Custom shortcode attributes
	 */
	public $atts = array();

	/**
	 * Macros array to replace
	 */
	public $macros = array();

	/**
	 * Parsed CSS
	 */
	public $css = null;

	function __construct( $class, $template, $atts ) {

		if ( ! $class || ! file_exists( $template ) || ! is_array( $atts ) ) {
			return false;
		}

		$this->class    = $class;
		$this->template = $template;
		$this->atts     = $atts;

		$this->macros = array(
			'class'   => $this->class,
			'color'   => '',
			'bgcolor' => '',
			'gutter'  => ! empty( $atts['gutter'] ) ? absint( $atts['gutter'] ) : 0,
			'columns' => ! empty( $atts['columns'] ) ? absint( $atts['columns'] ) : 3,
			'width'   => ! empty( $atts['initial_size'] ) ? absint( $atts['initial_size'] ) : 0
		);

		$template  = $this->get_template();
		$this->css = $this->parse_template( $template );

	}

	/**
	 * Get CSS template content
	 *
	 * @since 1.0.0
	 */
	public function get_template() {
		ob_start();
		require $this->template;
		$content = ob_get_clean();
		return $content;
	}

	/**
	 * Parse CSS template and reaplce macros
	 */
	public function parse_template( $content ) {

		$pattern = '/%%([a-zA-Z]+)(\*([0-9\.]+))?(&([a-z%]+))?%%/';
		$result  = preg_replace_callback( $pattern, array( $this, 'replace_callback' ), $content );
		$result  = preg_replace( '/\t|\r|\n|\s{2,}/', '', $result );

		return $result;

	}

	/**
	 * Process founded matches and replace it with data
	 *
	 * @since 1.0.0
	 */
	public function replace_callback( $matches ) {

		$result = '';

		if ( !empty( $matches[3] ) && isset( $this->macros[$matches[1]] ) ) {
			$result = absint( $this->macros[$matches[1]] ) * floatval( $matches[3] );
			$result = $this->maybe_fix_width( $result, $matches[1], absint( $matches[3] ) );
		} elseif ( isset( $this->macros[$matches[1]] ) ) {
			$result = esc_attr( $this->macros[$matches[1]] );
		}

		if ( isset( $matches[5] ) ) {
			$result .= esc_attr( $matches[5] );
		}

		return $result;

	}

	/**
	 * If it's width param - maybe fix it's on gutter value
	 *
	 * @since 1.0.0
	 *
	 * @param int     $value   result value
	 * @param string  $macros  macros
	 * @param int     $factor  multiplier
	 */
	public function maybe_fix_width( $value, $macros, $factor ) {

		if ( 'width' != $macros ) {
			return $value;
		}

		$value = $value + ($this->macros['gutter']* ( $factor - 1 ) );
		return $value;

	}


}