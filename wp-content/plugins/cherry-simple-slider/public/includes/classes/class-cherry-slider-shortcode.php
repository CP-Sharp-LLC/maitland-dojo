<?php
/**
 * Cherry Slider.
 *
 * @package   Cherry_Slider
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for Slider shortcode.
 *
 * @since 1.0.0
 */
class Cherry_Slider_Shortcode extends Cherry_Slider_Data {

	/**
	 * Shortcode name.
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	public static $name = 'slider';

	/**
	 * A reference to an instance of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Sets up our actions/filters.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		// Register shortcode on 'init'.
		add_action( 'init', array( $this, 'register_shortcode' ) );

		// Register shortcode and add it to the dialog.
		add_filter( 'cherry_shortcodes/data/shortcodes', array( $this, 'shortcodes' ) );
		add_filter( 'cherry_templater/data/shortcodes',  array( $this, 'shortcodes' ) );

		add_filter( 'cherry_editor_target_dirs', array( $this, 'add_target_dir' ), 11 );
	}

	/**
	 * Registers the [$this->name] shortcode.
	 *
	 * @since 1.0.0
	 */
	public function register_shortcode() {
		/**
		 * Filters a shortcode name.
		 *
		 * @since 1.0.0
		 * @param string $this->name Shortcode name.
		 */
		$tag = apply_filters( self::$name . '_shortcode_name', self::$name );

		add_shortcode( 'cherry_' . $tag, array( $this, 'do_shortcode' ) );
	}

	/**
	 * Filter to modify original shortcodes data and add [$this->name] shortcode.
	 *
	 * @since  1.0.0
	 * @param  array $shortcodes Original plugin shortcodes.
	 * @return array               Modified array.
	 */
	public function shortcodes( $shortcodes ) {
		$shortcodes[ self::$name ] = array(
			'name'  => __( 'Simple Slider', 'cherry-slider' ), // Shortcode name.
			'desc'  => 'This is a Slider Shortcode',
			'type'  => 'single', // Can be 'wrap' or 'single'. Example: [b]this is wrapped[/b], [this_is_single]
			'group' => 'media', // Can be 'content', 'box', 'media' or 'other'. Groups can be mixed, for example 'content box'.
			'atts'  => array( // List of shortcode params (attributes).
				'cherry_slider_sliders' => array(
					'default' => '',
					'name'    => __( 'Slider name', 'cherry-slider' ),
					'desc'    => __( 'Leave field blank, if you need all of the slides', 'cherry-slider' ),
				),
				'posts_per_page' => array(
					'type'    => 'number',
					'min'     => -1,
					'max'     => 50,
					'step'    => 1,
					'default' => 5,
					'name'    => __( 'Post per page', 'cherry-slider' ),
					'desc'    => __( 'Specify number of posts that you want to show. Enter -1 to get all posts', 'cherry-slider' ),
				),
				'slider_width' => array(
					'default' => '100%',
					'name'    => __( 'Slider width', 'cherry-slider' ),
					'desc'    => __( 'Sets the width of the slider', 'cherry-slider' ),
				),
				'slider_height' => array(
					'default' => '600',
					'name'    => __( 'Slider height', 'cherry-slider' ),
					'desc'    => __( 'Sets the height of the slider', 'cherry-slider' ),
				),
				'slider_orientation' => array(
					'type'    => 'select',
					'values'  => array(
						'horizontal'	=> __( 'Horizontal', 'cherry-slider' ),
						'vertical'		=> __( 'Vertical', 'cherry-slider' ),
					),
					'default' => 'horizontal',
					'name'    => __( 'Slider orientation', 'cherry-slider' ),
					'desc'    => __( 'Indicates whether the slides will be arranged horizontally or vertically', 'cherry-slider' ),
				),
				'slider_slide_distance' => array(
					'type'    => 'slider',
					'min'     => 0,
					'max'     => 100,
					'step'    => 1,
					'default' => 10,
					'name'    => __( 'Slide distance', 'cherry-slider' ),
					'desc'    => __( 'Sets the distance between the slides', 'cherry-slider' ),
				),
				'slider_navigation' => array(
					'type'    => 'bool',
					'default' => 'yes',
					'name'    => __( 'Slider navigation', 'cherry-slider' ),
					'desc'    => __( 'Indicates whether the arrow buttons will be created', 'cherry-slider' ),
				),
				'slider_pagination' => array(
					'type'    => 'bool',
					'default' => 'yes',
					'name'    => __( 'Slider pagination', 'cherry-slider' ),
					'desc'    => __( 'Indicates whether the pagination will be created', 'cherry-slider' ),
				),
				'slider_autoplay' => array(
					'type'    => 'bool',
					'default' => 'yes',
					'name'    => __( 'Slider autoplay', 'cherry-slider' ),
					'desc'    => __( 'Indicates whether or not autoplay will be enabled', 'cherry-slider' ),
				),
				'slider_fullScreen' => array(
					'type'    => 'bool',
					'default' => 'yes',
					'name'    => __( 'Slider fullScreen', 'cherry-slider' ),
					'desc'    => __( 'Indicates whether the full-screen button is enabled', 'cherry-slider' ),
				),
				'custom_class' => array(
					'default' => '',
					'name'    => __( 'Class', 'cherry-slider' ),
					'desc'    => __( 'Extra CSS class', 'cherry-slider' ),
				),
			),
			'icon'     => 'fa fa-eye', // Custom icon (font-awesome).
			'function' => array( $this, 'do_shortcode' ), // Name of shortcode function.
		);

		return $shortcodes;
	}

	/**
	 * Add target dir
	 *
	 * @param array $target_dirs Target dirs.
	 * @return array $target_dirs updated array.
	 */
	public function add_target_dir( $target_dirs ) {
		array_push( $target_dirs, CHERRY_SLIDER_DIR );

		return $target_dirs;
	}

	/**
	 * The shortcode function.
	 *
	 * @since  1.0.0
	 * @param  array  $atts      The user-inputted arguments.
	 * @param  string $content   The enclosed content (if the shortcode is used in its enclosing form).
	 * @param  string $shortcode The shortcode tag, useful for shared callback functions.
	 * @return string
	 */
	public function do_shortcode( $atts, $content = null, $shortcode = '' ) {

		// Set up the default arguments.
		$defaults = array(
			'cherry_slider_sliders'		=> '',
			'posts_per_page'			=> 9,
			'slider_width'				=> '100%',
			'slider_height'				=> '600',
			'slider_orientation'		=> 'horizontal',
			'slider_slide_distance'		=> 10,
			'slider_navigation'			=> 'yes',
			'slider_pagination'			=> 'yes',
			'slider_autoplay'			=> 'yes',
			'slider_fullScreen'			=> 'yes',
			'custom_class'				=> '',
		);

		/**
		 * Parse the arguments.
		 *
		 * @link http://codex.wordpress.org/Function_Reference/shortcode_atts
		 */
		$atts = shortcode_atts( $defaults, $atts, $shortcode );

		$atts['slider_navigation']	= ( bool ) ( 'yes' === $atts['slider_navigation'] ) ? 'true' : 'false' ;
		$atts['slider_pagination']	= ( bool ) ( 'yes' === $atts['slider_pagination'] ) ? 'true' : 'false' ;
		$atts['slider_autoplay']	= ( bool ) ( 'yes' === $atts['slider_autoplay'] ) ? 'true' : 'false' ;
		$atts['slider_fullScreen']	= ( bool ) ( 'yes' === $atts['slider_fullScreen'] ) ? 'true' : 'false' ;

		return $this->the_slider( $atts );
	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 * @return object
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}
}

Cherry_Slider_Shortcode::get_instance();
