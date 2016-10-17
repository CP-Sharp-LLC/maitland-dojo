<?php
/**
 * Slider Configuration class.
 *
 * @package   Cherry_Slider
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// If class 'Slider_Options' not exists.
if ( ! class_exists( 'Slider_Options' ) ) {

	/**
	 * Sets up and initializes Slider Options class.
	 *
	 * @since 1.0.0
	 */
	class Slider_Options {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * All options array.
		 *
		 * @var array
		 */
		static $options = array();

		/**
		 * Defaults query arg-settings
		 *
		 * @var array
		 */
		static $defaults_query_args = array();

		/**
		 * Sets up needed actions/filters for the plugin to initialize.
		 *
		 * @since 1.0.0
		 */
		private function __construct() {
			add_action( 'init', array( $this, 'set_slider_options' ) );

			// Cherry option filter.
			add_filter( 'cherry_defaults_settings', array( $this, 'cherry_slider_settings' ) );
		}

		/**
		 * Generate slider options
		 *
		 * @return void
		 */
		static function set_slider_options() {
			self::set_option_value( 'image_size', 'thumb-xl' );
			self::set_option_value( 'is_image_crop', false );
			self::set_option_value( 'image_crop_width', 1170 );
			self::set_option_value( 'image_crop_height', 780 );
			self::set_option_value( 'slider_width', self::cherry_slider_get_option( 'cherry-slider-width', '100%' ) );
			self::set_option_value( 'slider_height', self::cherry_slider_get_option( 'cherry-slider-height', '600' ) );
			self::set_option_value( 'slider_992_breakpoint_height', self::cherry_slider_get_option( 'cherry-slider-992-breakpoint-height', '500' ) );
			self::set_option_value( 'slider_768_breakpoint_height', self::cherry_slider_get_option( 'cherry-slider-768-breakpoint-height', '350' ) );
			self::set_option_value( 'slider_visible_size', self::cherry_slider_get_option( 'cherry-slider-visible-size', 'auto' ) );
			self::set_option_value( 'slider_force_size', self::cherry_slider_get_option( 'cherry-slider-force-size', 'none' ) );
			self::set_option_value( 'slider_orientation', self::cherry_slider_get_option( 'cherry-slider-orientation', 'horizontal' ) );
			self::set_option_value( 'slider_slide_distance', self::cherry_slider_get_option( 'cherry-slider-slide-distance', 10 ) );
			self::set_option_value( 'slider_slide_duration', self::cherry_slider_get_option( 'cherry-slider-slide-duration', 700 ) );
			self::set_option_value( 'slider_slide_fade', self::cherry_slider_get_option( 'cherry-slider-slide-fade', 'false' ) );
			self::set_option_value( 'slider_navigation', self::cherry_slider_get_option( 'cherry-slider-navigation', 'true' ) );
			self::set_option_value( 'slider_fade_navigation', self::cherry_slider_get_option( 'cherry-slider-fade-navigation', 'true' ) );
			self::set_option_value( 'slider_pagination', self::cherry_slider_get_option( 'cherry-slider-pagination', 'false' ) );
			self::set_option_value( 'slider_autoplay', self::cherry_slider_get_option( 'cherry-slider-autoplay', 'true' ) );
			self::set_option_value( 'slider_fullScreen', self::cherry_slider_get_option( 'cherry-slider-fullScreen', 'true' ) );
			self::set_option_value( 'slider_shuffle', self::cherry_slider_get_option( 'cherry-slider-shuffle', 'false' ) );
			self::set_option_value( 'slider_loop', self::cherry_slider_get_option( 'cherry-slider-loop', 'true' ) );
			self::set_option_value( 'slider_thumbnails', self::cherry_slider_get_option( 'cherry-slider-thumbnails', 'false' ) );
			self::set_option_value( 'slider_thumbnails_arrows', self::cherry_slider_get_option( 'cherry-slider-thumbnails-arrows', 'false' ) );
			self::set_option_value( 'slider_thumbnails_position', self::cherry_slider_get_option( 'cherry-slider-thumbnails-position', 'bottom' ) );
			self::set_option_value( 'slider_thumbnails_width', self::cherry_slider_get_option( 'cherry-slider-thumbnails-width', 150 ) );
			self::set_option_value( 'slider_thumbnails_height', self::cherry_slider_get_option( 'cherry-slider-thumbnails-height', 150 ) );
			self::set_option_value( 'slider_reach_video_action', self::cherry_slider_get_option( 'cherry-slider-reach-video-action', 'none' ) );
			self::set_option_value( 'image_class', '' );
			self::set_option_value( 'post_type', CHERRY_SLIDER_NAME );
			self::set_option_value( CHERRY_SLIDER_NAME.'_sliders', self::cherry_slider_get_option( 'cherry-slider-name', '' ) );
			self::set_option_value( 'orderby', 'date' );
			self::set_option_value( 'order', self::cherry_slider_get_option( 'cherry-slider-order', 'DESC' ) );
			self::set_option_value( 'posts_per_page', self::cherry_slider_get_option( 'cherry-slider-number-slides', 5 ) );
			self::set_option_value( 'offset', 0 );
			self::set_option_value( 'suppress_filters', false );
		}

		/**
		 * Set option value and pushing to resuul array.
		 *
		 * @since  1.0.0
		 * @param string $name option name.
		 * @param mixed  $value option value.
		 * @return void
		 */
		static function set_option_value( $name, $value = null ) {
			self::$options[ $name ] = $value;
		}

		/**
		 * Get slider option value.
		 *
		 * @since  1.0.0
		 * @param string $name option name.
		 * @return mixed|boolen option value.
		 */
		static function get_option_value( $name ) {

			if ( isset( self::$options[ $name ] ) ) {

				return self::$options[ $name ];
			} else {
				return false;
			}

		}

		/**
		 * Update dafault cherry-options array.
		 *
		 * @param  array $result_array currunt dafault cherry-options array.
		 * @return array $result_array updated dafault cherry-options array.
		 */
		function cherry_slider_settings( $result_array ) {
			$slider_options = array();
			$slider_options['cherry-slider-name'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider name', 'cherry-slider' ),
				'decsription'	=> __( 'Leave field blank, if you need all of the slides', 'cherry-slider' ),
				'value'			=> '',
			);
			$slider_options['cherry-slider-number-slides'] = array(
				'type'			=> 'slider',
				'title'			=> __( 'Number of slides', 'cherry' ),
				'label'			=> '',
				'decsription'	=> __( 'Indicates number of slides', 'cherry' ),
				'max_value'		=> 100,
				'min_value'		=> 2,
				'value'			=> 5,
			);
			$slider_options['cherry-slider-order'] = array(
				'type'			=> 'select',
				'title'			=> __( 'Slides order', 'cherry-slider' ),
				'decsription'	=> __( 'Designates the ascending or descending order of the "orderby" parameter.', 'cherry-slider' ),
				'value'			=> 'DESC',
				'class'			=> 'width-full',
				'options'		=> array(
					'ASC'	=> __( 'Ascending order from lowest to highest values', 'cherry-slider' ),
					'DESC'	=> __( 'Descending order from highest to lowest values', 'cherry-slider' ),
				),
			);
			$slider_options['cherry-slider-width'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider width', 'cherry-slider' ),
				'decsription'	=> __( 'Sets the width of the slide.', 'cherry-slider' ),
				'hint'			=> array(
					'type'		=> 'text',
					'content'	=> __( "Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like '100%'. It's important to note that percentage values need to be specified inside quotes. For fixed values, the quotes are not necessary. Also, please note that, in order to make the slider responsive, it's not necessary to use percentage values.", 'cherry-slider' ),
				),
				'value'			=> '100%',
			);
			$slider_options['cherry-slider-height'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider height', 'cherry-slider' ),
				'decsription'	=> __( 'Sets specific breakpoints which allow changing the look and behavior of the slider when the page resizes.', 'cherry-slider' ),
				'value'			=> '600',
			);
			$slider_options['cherry-slider-992-breakpoint-height'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider 992px breakpoint height', 'cherry-slider' ),
				'decsription'	=> __( 'Sets specific breakpoints which allow changing the look and behavior of the slider when the page resizes.', 'cherry-slider' ),
				'hint'			=> array(
					'type'		=> 'text',
					'content'	=> __( "The 'breakpoints' property is assigned an object which contains certain browser window widths and the slider properties that are applied to those specific widths. This is very similar to CSS media queries.", 'cherry-slider' ),
				),
				'value'			=> '500',
			);
			$slider_options['cherry-slider-768-breakpoint-height'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider 768px breakpoint height', 'cherry-slider' ),
				'decsription'	=> __( 'Sets specific breakpoints which allow changing the look and behavior of the slider when the page resizes.', 'cherry-slider' ),
				'hint'			=> array(
					'type'		=> 'text',
					'content'	=> __( "The 'breakpoints' property is assigned an object which contains certain browser window widths and the slider properties that are applied to those specific widths. This is very similar to CSS media queries.", 'cherry-slider' ),
				),
				'value'			=> '350',
			);
			$slider_options['cherry-slider-visible-size'] = array(
				'type'			=> 'text',
				'title'			=> __( 'Slider visible size', 'cherry-slider' ),
				'decsription'	=> __( 'Sets the size of the visible area, allowing for more slides to become visible near the selected slide.', 'cherry-slider' ),
				'value'			=> 'auto',
			);
			$slider_options['cherry-slider-force-size'] = array(
				'type'			=> 'select',
				'title'			=> __( 'Slider forceSize', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates if the size of the slider will be forced to full width or full window.', 'cherry-slider' ),
				'hint'			=> array(
					'type'		=> 'text',
					'content'	=> __( "Note: It's possible to make the slider full width or full window by giving it width and/or height of '100%'. However, sometimes the slider might be inside other containers which are less than full width/window. The 'forceSize' property is useful in those situations because it will still enlarge the slider to fill the width or window by overflowing its parent elements.", 'cherry-slider' ),
				),
				'value'			=> 'none',
				'class'			=> 'width-full',
				'options'		=> array(
					'none'			=> __( 'None', 'cherry-slider' ),
					'fullWindow'	=> __( 'fullWindow', 'cherry-slider' ),
					'fullWidth'		=> __( 'fullWidth', 'cherry-slider' ),
				),
			);
			$slider_options['cherry-slider-orientation'] = array(
				'type'			=> 'radio',
				'title'			=> __( 'Slider orientation', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the slides will be arranged horizontally or vertically.', 'cherry-slider' ),
				'value'			=> 'horizontal',
				'class'			=> '',
				'display-input'	=> true,
				'options'		=> array(
					'horizontal' => array(
						'label' => __( 'Horizontal', 'cherry-slider' ),
					),
					'vertical' => array(
						'label' => __( 'Vertical', 'cherry-slider' ),
					),
				),
			);
			$slider_options['cherry-slider-slide-distance'] = array(
				'type'			=> 'slider',
				'title'			=> __( 'Slide distance', 'cherry' ),
				'label'			=> '',
				'decsription'	=> __( 'Sets the distance between the slides.', 'cherry' ),
				'max_value'		=> 500,
				'min_value'		=> 0,
				'value'			=> 10,
			);
			$slider_options['cherry-slider-slide-duration'] = array(
				'type'			=> 'slider',
				'title'			=> __( 'Slide animation duration', 'cherry' ),
				'label'			=> '',
				'decsription'	=> __( 'Sets the duration of the slide animation.', 'cherry' ),
				'max_value'		=> 5000,
				'min_value'		=> 100,
				'value'			=> 700,
			);
			$slider_options['cherry-slider-slide-fade'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slide fading', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates if fade will be used.', 'cherry-slider' ),
				'value'			=> 'false',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-navigation'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider navigation', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the arrow buttons will be created.', 'cherry-slider' ),
				'value'			=> 'true',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-fade-navigation'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider fade navigation', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the arrows will fade in only on hover.', 'cherry-slider' ),
				'value'			=> 'true',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-pagination'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider pagination', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the buttons will be created.', 'cherry-slider' ),
				'value'			=> 'false',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-autoplay'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider autoplay', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether or not autoplay will be enabled.', 'cherry-slider' ),
				'value'			=> 'true',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-fullScreen'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider fullScreen', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the full-screen button is enabled.', 'cherry-slider' ),
				'value'			=> 'true',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-shuffle'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider shuffle', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates if the slides will be shuffled.', 'cherry-slider' ),
				'value'			=> 'false',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-loop'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Slider loop', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates if the slider will be loopable (infinite scrolling).', 'cherry-slider' ),
				'value'			=> 'true',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);

			$slider_options['cherry-slider-thumbnails'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Thumbnails', 'cherry-slider' ),
				'decsription'	=> __( 'Show thumbnails', 'cherry-slider' ),
				'value'			=> 'false',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-thumbnails-arrows'] = array(
				'type'			=> 'switcher',
				'title'			=> __( 'Thumbnail arrows', 'cherry-slider' ),
				'decsription'	=> __( 'Indicates whether the thumbnail arrows will be enabled', 'cherry-slider' ),
				'value'			=> 'false',
				'toggle'		=> array(
					'true_toggle'	=> __( 'Yes', 'cherry' ),
					'false_toggle'	=> __( 'No', 'cherry' ),
				),
			);
			$slider_options['cherry-slider-thumbnails-position'] = array(
				'type'			=> 'select',
				'title'			=> __( 'Thumbnails Position', 'cherry-slider' ),
				'decsription'	=> __( 'Sets the position of the thumbnail scroller', 'cherry-slider' ),
				'value'			=> 'select-1',
				'class'			=> 'width-full',
				'options'		=> array(
					'top'		=> __( 'Top position', 'cherry-slider' ),
					'bottom'	=> __( 'Bottom position', 'cherry-slider' ),
					'right'		=> __( 'Right position', 'cherry-slider' ),
					'left'		=> __( 'Left position', 'cherry-slider' ),
				),
			);
			$slider_options['cherry-slider-thumbnails-width'] = array(
				'type'			=> 'slider',
				'title'			=> __( 'Thumbnail width', 'cherry-slider' ),
				'label'			=> '',
				'decsription'	=> __( 'Sets the width of the thumbnail.', 'cherry-slider' ),
				'max_value'		=> 500,
				'min_value'		=> 50,
				'value'			=> 150,
			);
			$slider_options['cherry-slider-thumbnails-height'] = array(
				'type'			=> 'slider',
				'title'			=> __( 'Thumbnail height', 'cherry-slider' ),
				'label'			=> '',
				'decsription'	=> __( 'Sets the height of the thumbnail.', 'cherry-slider' ),
				'max_value'		=> 500,
				'min_value'		=> 50,
				'value'			=> 150,
			);
			$slider_options['cherry-slider-reach-video-action'] = array(
				'type'			=> 'select',
				'title'			=> __( 'Reach video action', 'cherry-slider' ),
				'decsription'	=> __( 'Sets the action that the video will perform when its slide container is selected.', 'cherry-slider' ),
				'value'			=> 'none',
				'class'			=> 'width-full',
				'options'		=> array(
					'none'		=> __( 'None', 'cherry-slider' ),
					'playVideo'	=> __( 'PlayVideo', 'cherry-slider' ),
				),
			);
			$result_array['slider-options-section'] = array(
				'name'			=> __( 'Cherry Slider', 'cherry-slider' ),
				'icon' 			=> 'dashicons dashicons-star-empty',
				'priority'		=> 125,
				'options-list'	=> apply_filters( 'cherry_slider_default_settings', $slider_options ),
			);

			return $result_array;
		}

		/**
		 * Get option by name from theme options.
		 *
		 * @since  1.0.0
		 *
		 * @uses   cherry_get_option  use cherry_get_option from Cherry framework if exist
		 *
		 * @param string $name     Option name to get.
		 * @param mixed  $default  Default option value.
		 * @return mixed           Option value.
		 */
		public static function cherry_slider_get_option( $name, $default = false ) {

			if ( function_exists( 'cherry_get_option' ) ) {
				$result = cherry_get_option( $name , $default );

				return $result;
			}

			return $default;
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

	Slider_Options::get_instance();
}
