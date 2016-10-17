<?php
/**
 * Handles custom post meta boxes for the public post types.
 *
 * @package   Cherry_Grid Shortcode
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
	die;
}

class Cherry_Grid_Shortcode {

	/**
	 * A reference to an instance of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Post data array to replace it
	 * @var array
	 */
	public $grid_data = array();

	function __construct() {

		add_shortcode( 'grid', array( $this, 'shortcode' ) );

		// Register shortcode and add it to the dialog.
		add_filter( 'cherry_shortcodes/data/shortcodes', array( $this, 'shortcode_register' ) );
		add_filter( 'cherry_templater/data/shortcodes',  array( $this, 'shortcode_register' ) );

		add_filter( 'cherry_templater_target_dirs', array( $this, 'register_template_dir' ), 11 );

	}

	/**
	 * Main shortcode function
	 *
	 * @since  1.0.0
	 * @param  array  $atts    shortcode atts
	 * @param  string $content shortcode content (optional)
	 */
	function shortcode( $atts, $content = null ) {

		$atts = shortcode_atts(
			array(
				'num'            => 8,
				'post_type'      => 'post',
				'type'           => 'flex',
				'gutter'         => 0,
				'columns'        => 3,
				'initial_size'   => 200,
				'thumbnail_size' => 100,
				'button_text'    => __( 'Read More', 'cherry-grid' ),
				'template'       => 'default.tmpl',
				'class'          => ''
			),
			$atts, 'grid'
		);

		$atts = $this->sanitize_atts( $atts );

		$masonry_atts = '';
		if ( 'masonry' == $atts['type'] ) {
			wp_enqueue_script( 'jquery-masonry' );
			wp_enqueue_script( 'cherry-grid' );

			$data_atts = array();

			$data_atts['columnWidth']  = $atts['initial_size'];
			$data_atts['itemSelector'] = '.cherry-grid_item';
			$data_atts['gutter']       = $atts['gutter'];

			$data_atts = apply_filters( 'cherry_grid_masonry_init_atts', $data_atts, $atts );

			$masonry_atts = ' data-masonry-atts=\'' . json_encode( $data_atts ) . '\'';
		}

		$query_args = array(
			'posts_per_page'      => $atts['num'],
			'ignore_sticky_posts' => true,
			'post_type'           => $atts['post_type']
		);

		$grid_query = new WP_Query( $query_args );

		if ( ! $grid_query->have_posts() ) {
			return __( 'There are no posts found', 'cherry-grid' );
		}

		$unique_class = 'cherry-grid-' . rand( 1000, 9999 );
		$wrap_classes = array( 'cherry-grid', 'type-' . $atts['type'], $unique_class );

		if ( '' != $atts['class'] ) {
			$wrap_classes[] = $atts['class'];
		}

		$wrap_class = implode( ' ', $wrap_classes );

		$result = '<div class="' . $wrap_class . '">';

			$result .= '<ul class="cherry-grid_list"' . $masonry_atts . '>';

				$tpl_file = $this->get_template_path( $atts['template'], 'grid' );

				if ( ! $tpl_file ) {
					return '<div class="error">' . __( 'Template file does not exist', 'cherry-grid' ) . '</div>';
				}

				$macros    = '/%%([a-zA-Z]+[^%]{2})(=[\'\"]([a-zA-Z0-9-_\s]+)[\'\"])?%%/';
				$callbacks = $this->setup_template_data( $atts );

				while ( $grid_query->have_posts() ) {

					$grid_query->the_post();

					$meta = $callbacks->get_meta();

					ob_start();
					require $tpl_file;
					$tpl = ob_get_clean();

					$item_class = '';

					if ( 'flex' == $atts['type'] || 'masonry' == $atts['type'] ) {
						$width = isset( $meta['width'] ) ? $meta['width'] : 1;
						$item_class = 'cherry-grid_item_' . $width;
					}

					$custom_style = '';

					if ( ! empty( $meta['item_background'] ) ) {
						$custom_style .= 'background-color:' . esc_attr( $meta['item_background'] ) . ';';
					}

					if ( ! empty( $meta['item_color'] ) ) {
						$custom_style .= 'color:' . esc_attr( $meta['item_color'] ) . ';';
					}

					if ( ! empty( $custom_style ) ) {
						$custom_style = sprintf( ' style="%s"', $custom_style );
					}

					if ( ! empty( $meta['css_class'] ) ) {
						$item_class .= ' ' . esc_attr( $meta['css_class'] );
					}

					$content = preg_replace_callback( $macros, array( $this, 'replace_callback' ), $tpl );
					$result .= '<li class="cherry-grid_item ' . $item_class . '"' . $custom_style . '><div class="cherry-grid_item_inner">' . $content . '</div></li>';

					$callbacks->clear_data();
				}

				$css_template_name = CHERRY_GRID_DIR . 'templates/css/' . $atts['type'] . '.css';

				$this->reset_template_data();
				wp_reset_postdata();
				wp_reset_query();

			$result .= '</ul>';
			$result .= $this->get_grid_style( $unique_class, $css_template_name, $atts );

		$result .= '</div>';

		return $result;

	}

	/**
	 * Process element custom CSS from te,plate
	 *
	 * @since  1.0.0
	 *
	 * @param  string $class    current masonry block class
	 * @param  string $template CSS template path
	 * @param  array  $atts     shortocode attributes array
	 */
	public function get_grid_style( $class, $template, $atts ) {

		$result_format = '<style>%s</style>';
		require_once( CHERRY_GRID_DIR . 'includes/class-cherry-grid-css-parser.php' );
		$style = new Cherry_Grid_CSS_Parser( $class, $template, $atts );

		return sprintf( $result_format, $style->css );

	}

	/**
	 * Prepare template data to replace
	 *
	 * @since  1.0.0
	 * @param  array  $atts shortcode attributes
	 */
	function setup_template_data( $atts ) {

		require_once( CHERRY_GRID_DIR . 'includes/class-cherry-grid-shortcode-callbacks.php' );

		$callbacks = new Cherry_Grid_Shortcode_Callbacks( $atts );

		$data = array(
			'title'    => array( $callbacks, 'get_title' ),
			'image'    => array( $callbacks, 'get_image' ),
			'author'   => array( $callbacks, 'get_author' ),
			'taxonomy' => array( $callbacks, 'get_tax' ),
			'date'     => array( $callbacks, 'get_date' ),
			'comments' => array( $callbacks, 'get_comments' ),
			'excerpt'  => array( $callbacks, 'get_excerpt' ),
			'content'  => array( $callbacks, 'get_content' ),
			'button'   => array( $callbacks, 'get_button' )
		);

		$this->grid_data = apply_filters( 'cherry_grid_shortcode_data_callbacks', $data, $atts );

		return $callbacks;
	}

	/**
	 * Reset template data array
	 *
	 * @since  1.0.0
	 */
	function reset_template_data() {
		$this->grid_data = array();
	}

	/**
	 * Replace callbaks for template file
	 *
	 * @since  1.0.0
	 * @param  array   $matches replace matches
	 * @return string           string with replaced data
	 */
	function replace_callback( $matches ) {

		if ( !is_array( $matches ) ) {
			return '';
		}

		if ( empty( $matches ) ) {
			return '';
		}

		$key = strtolower( $matches[1] );

		// if key not found in data -return nothing
		if ( ! isset( $this->grid_data[$key] ) ) {
			return '';
		}

		$callback = $this->grid_data[$key];

		if ( ! is_callable( $callback ) ) {
			return;
		}

		// if found parameters and has correct callback - process it
		if ( isset( $matches[3] ) ) {
			return call_user_func( $callback, $matches[3] );
		}

		return call_user_func( $callback );

	}

	/**
	 * Sanitize shortcode attributes
	 *
	 * @since  1.0.0
	 * @param  array $atts shortcode attributes array
	 */
	function sanitize_atts( $atts ) {

		if ( ! is_array( $atts ) ) {
			return;
		}

		$allowed_types = array( 'flex', 'columns', 'masonry' );

		$atts['num']            = $this->sanitize_num( $atts['num'], 8 );
		$atts['post_type']      = post_type_exists( $atts['post_type'] ) ? $atts['post_type'] : 'post';
		$atts['type']           = in_array( $atts['type'], $allowed_types ) ? $atts['type'] : 'flex';
		$atts['gutter']         = $this->sanitize_num( $atts['gutter'], 0 );
		$atts['columns']        = $this->sanitize_num( $atts['columns'], 3 );
		$atts['initial_size']   = $this->sanitize_num( $atts['initial_size'], 3 );
		$atts['thumbnail_size'] = $this->sanitize_num( $atts['thumbnail_size'], 3 );
		$atts['button_text']    = sanitize_text_field( $atts['button_text'] );
		$atts['template']       = sanitize_file_name( $atts['template'] );
		$atts['class']          = esc_attr( $atts['class'] );

		return $atts;

	}

	/**
	 * Sanitize numeric value
	 *
	 * @since  1.0.0
	 * @param  mixed   $value   maybe integer
	 * @param  integer $default default value
	 */
	function sanitize_num( $value, $default = 0 ) {

		$value = absint( $value );

		if ( 0 != $value )
			return $value;
		else
			return $default;

	}

	/**
	 * Register shortcode for shortcodes ultimate
	 *
	 * @since  1.0.0
	 *
	 * @param  array   $shortcodes Original plugin shortcodes.
	 * @return array               Modified array.
	 */
	public function shortcode_register( $shortcodes ) {

		$post_types = get_post_types( array( 'public' => true ), 'objects' );

		$post_types = wp_list_pluck( $post_types, 'label', 'name' );

		$shortcodes['grid'] = array(
			'name'  => __( 'Grid', 'cherry-grid' ), // Shortcode name.
			'desc'  => 'This is a Cherry Grid Shortcode',
			'type'  => 'single',
			'group' => 'content',
			'atts'  => array( // List of shortcode params (attributes).
				'num' => array(
					'default' => 8,
					'name'    => __( 'Number of posts', 'cherry-grid' ),
					'desc'    => __( 'Set number of posts to show', 'cherry-grid' )
				),
				'post_type' => array(
					'default' => 'post',
					'type'    => 'select',
					'name'    => __( 'Post type', 'cherry-grid' ),
					'desc'    => __( 'Select post type to get posts from', 'cherry-grid' ),
					'values'  => $post_types
				),
				'type' => array(
					'default' => 'flex',
					'type'    => 'select',
					'name'    => __( 'Grid layout', 'cherry-grid' ),
					'desc'    => __( 'Select grid layout type', 'cherry-grid' ),
					'values'  => array(
						'flex'    => __( 'Rows', 'cherry-grid' ),
						'columns' => __( 'Columns', 'cherry-grid' ),
						'masonry' => __( 'Masonry', 'cherry-grid' ),
					)
				),
				'gutter' => array(
					'type'    => 'number',
					'min'     => 0,
					'max'     => 100,
					'step'    => 1,
					'default' => 0,
					'name'    => __( 'Gutter Width', 'cherry-grid' ),
					'desc'    => __( 'Set gutter width (in px)', 'cherry-grid' ),
				),
				'columns' => array(
					'type'    => 'number',
					'min'     => 1,
					'max'     => 12,
					'step'    => 1,
					'default' => 3,
					'name'    => __( 'Columns number', 'cherry-grid' ),
					'desc'    => __( 'Set columns number (has effect only for columns layout type)', 'cherry-grid' ),
				),
				'initial_size' => array(
					'type'    => 'number',
					'min'     => 20,
					'max'     => 1200,
					'step'    => 240,
					'default' => 0,
					'name'    => __( 'Initial item width', 'cherry-grid' ),
					'desc'    => __( 'Set initial item width', 'cherry-grid' ),
				),
				'thumbnail_size' => array(
					'type'    => 'number',
					'min'     => 0,
					'max'     => 100,
					'step'    => 1,
					'default' => 0,
					'name'    => __( 'Thumbnail size', 'cherry-grid' ),
					'desc'    => __( 'Set post thumbnail size to show', 'cherry-grid' ),
				),
				'button_text' => array(
					'default' => __( 'Read More', 'cherry-grid' ),
					'name'    => __( 'Read more button text', 'cherry-grid' ),
					'desc'    => __( 'Enter text for read more button', 'cherry-grid' ),
				),
				'class' => array(
					'default' => '',
					'name'    => __( 'Custom CSS class', 'cherry-grid' ),
					'desc'    => __( 'Enter custom CSS class name', 'cherry-grid' )
				),
				'template' => array(
					'type'   => 'select',
					'values' => array(
						'default.tmpl' => 'default.tmpl',
					),
					'default' => 'default.tmpl',
					'name'    => __( 'Template', 'cherry-grid' ),
					'desc'    => __( 'Shortcode template', 'cherry-grid' ),
				),
			),
			'icon'     => 'th-large', // Custom icon (font-awesome).
			'function' => array( $this, 'shortcode' ), // Name of shortcode function.
			'use_template' => false
		);

		return $shortcodes;
	}

	/**
	 * regiter template directory for editor
	 *
	 * @since  1.0.0
	 *
	 * @return array  registered directories for editor
	 */
	function register_template_dir( $dirs ) {
		$dirs[] = CHERRY_GRID_DIR;
		return $dirs;
	}

	/**
	 * Retrieve a template's file content.
	 *
	 * @since  1.0.0
	 * @param  string $template_name  Template's file name.
	 * @param  string $shortcode      Shortcode's name.
	 * @return bool|string            Template's content.
	 */
	public static function get_template_path( $template_name, $shortcode ) {

		$file       = false;
		$default    = CHERRY_GRID_DIR . 'templates/shortcodes/' . $shortcode . '/default.tmpl';
		$subdir     = 'templates/shortcodes/' . $shortcode . '/' . $template_name;
		$upload_dir = wp_upload_dir();
		$upload_dir = trailingslashit( $upload_dir['basedir'] );

		if ( file_exists( $upload_dir . $subdir ) ) {
			$file = $upload_dir . $subdir;
		} elseif ( file_exists( CHERRY_GRID_DIR . $subdir ) ) {
			$file = CHERRY_GRID_DIR . $subdir;
		} elseif ( file_exists( $default ) ) {
			$file = $default;
		}

		$file = apply_filters( 'cherry_shortcodes_get_template_path', $file, $template_name, $shortcode );

		return $file;

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

Cherry_Grid_Shortcode::get_instance();