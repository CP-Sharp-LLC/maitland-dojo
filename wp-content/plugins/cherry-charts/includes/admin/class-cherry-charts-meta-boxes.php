<?php

/**
 * Meta boxes management class
 *
 * @package   cherry_charts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( !class_exists( 'cherry_charts_meta' ) ) {

	/**
	 * cherry charts meta class
	 *
	 * @since  1.0.0
	 */
	class cherry_charts_meta {

		/**
		 * Charts meta key
		 */
		private $meta_key = 'cherry_charts';

		/**
		 * Chart types
		 */
		private $chart_types = array( 'progress_bar', 'multi_progress', 'pie', 'doughnut', 'bar' );

		/**
		 * chart meta boxes
		 * @var  array
		 */
		public $meta_boxes = array();

		/**
		 * chart meta fields
		 * @var  array
		 */
		public $meta_fields = array();

		/**
		 * chart meta fields builder
		 * @var  array
		 */
		public $builder = array();

		function __construct() {

			/**
			 * @todo also need to delete cache on shortcode templates saving
			 */

			/**
			 * filter chart metaboxes list
			 *
			 * @since  1.0.0
			 * @var    array
			 */
			$this->meta_boxes = apply_filters( 'cherry_charts_meta_boxes', array(
				'chart-settings' => array(
					'title'    => __( 'Define chart settings', 'cherry-charts' ),
					'callback' => array( $this, '_settings_box' ),
					'screen'   => 'chart',
					'context'  => 'normal',
					'priority' => 'high'
				),
				'chart-content' => array(
					'title'    => __( 'Set up content settings', 'cherry-charts' ),
					'callback' => array( $this, '_content_box' ),
					'screen'   => 'chart',
					'context'  => 'normal',
					'priority' => 'high'
				),
				'chart-data' => array(
					'title'    => __( 'Set up chart data', 'cherry-charts' ),
					'callback' => array( $this, '_data_box' ),
					'screen'   => 'chart',
					'context'  => 'normal',
					'priority' => 'high'
				),
				'chart-style' => array(
					'title'    => __( 'Set up chart style', 'cherry-charts' ),
					'callback' => array( $this, '_style_box' ),
					'screen'   => 'chart',
					'context'  => 'normal',
					'priority' => 'high'
				),
				'chart-shortcode' => array(
					'title'    => __( 'Shortcode to paste', 'cherry-charts' ),
					'callback' => array( $this, '_shortcode_box' ),
					'screen'   => 'chart',
					'context'  => 'normal',
					'priority' => 'high'
				)
			) );

			add_action( 'add_meta_boxes_chart', array( $this, 'register_meta_boxes' ) );
			add_action( 'save_post_chart', array( $this, '_save_meta' ), 10, 3 );
			add_action( 'delete_post', array( $this, '_delete_chart_transient' ), 10, 3 );
			add_action( 'admin_enqueue_scripts', array( $this, 'pass_charts_data_js' ), 99, 1 );

		}

		/**
		 * Pass chart data to JS to render saved data tables
		 *
		 * @since  1.0.0
		 */
		function pass_charts_data_js() {
			global $typenow, $current_screen, $post;
			if ( 'post' != $current_screen->base || 'chart' != $current_screen->id ) {
				return;
			}
			$data = array();
			foreach ( $this->chart_types as $type ) {
				$current_data = cherry_charts_get_meta( $post->ID, 'data_' . $type, array() );
				$data[$type] = $current_data;
			}
			wp_localize_script( 'cherry-charts', 'cherry_charts_saved', $data );
		}

		/**
		 * Register necessary metaboxes for charts
		 *
		 * @since 1.0.0
		 */
		function register_meta_boxes() {

			if ( ! is_array( $this->meta_boxes ) ) {
				return;
			}

			if ( ! class_exists( 'Cherry_Interface_Builder' ) ) {
				require_once 'class-cherry-interface-builder.php';
			}

			$this->builder = new Cherry_Interface_Builder(
				array(
					'name_prefix' => $this->meta_key,
					'pattern'     => 'inline',
					'class'       => array( 'section' => 'single-section' )
				)
			);

			foreach ( $this->meta_boxes as $id => $data ) {
				$data = wp_parse_args( $data, array(
					'title'         => '',
					'callback'      => '',
					'screen'        => 'chart',
					'context'       => 'normal',
					'priority'      => 'core',
					'callback_args' => ''
				) );
				add_meta_box( $id, $data['title'], $data['callback'], $data['screen'], $data['context'], $data['priority'], $data['callback_args'] );
			}
		}

		/**
		 * Callback function to show settings meta box
		 *
		 * @since  1.0.0
		 *
		 * @param  object $post post object
		 */
		function _settings_box( $post ) {

			$fields = array(
				'type' => array(
					'id'          => 'type',
					'save'        => true,
					'type'        => 'select',
					'label'       => __( 'Chart type', 'cherry-charts' ),
					'description' => __( 'Select chart type', 'cherry-charts' ),
					'value'       => 'progress_bar',
					'options'     => array(
						'progress_bar'   => __( 'Progress Bar', 'cherry-charts' ),
						'multi_progress' => __( 'Multi Progress Bar', 'cherry-charts' ),
						'pie'            => __( 'Pie', 'cherry-charts' ),
						'doughnut'       => __( 'Doughnut', 'cherry-charts' ),
						'bar'            => __( 'Bar', 'cherry-charts' )
					)
				),
				'bar_type' => array(
					'id'          => 'bar_type',
					'save'        => true,
					'type'        => 'select',
					'label'       => __( 'Progress bar type', 'cherry-charts' ),
					'description' => __( 'Select progress bar type', 'cherry-charts' ),
					'value'       => 'radial',
					'options'     => array(
						'radial'     => __( 'Radial', 'cherry-charts' ),
						'horizontal' => __( 'Horizontal', 'cherry-charts' ),
						'vertical'   => __( 'Vertical', 'cherry-charts' )
					),
					'chart_group'    => 'progress_bar-group depend-group'
				),
				'inner_cut' => array(
					'id'          => 'inner_cut',
					'save'        => true,
					'type'        => 'stepper',
					'label'       => __( 'Inner cutout percentage', 'cherry-charts' ),
					'description' => __( 'Set inner cutout percentage (0 - for pie, > 0 for doughnut)', 'cherry-charts' ),
					'value'       => 50,
					'max_value'   => 100,
					'min_value'   => 0,
					'value_step'  => 1,
					'chart_group' => 'progress_bar-group radial-subgroup doughnut-group depend-group'
				),
				'width' => array(
					'id'          => 'width',
					'save'        => true,
					'type'        => 'stepper',
					'label'       => __( 'Width', 'cherry-charts' ),
					'description' => __( 'Chart width (for bar chart & non-radial progress bars)', 'cherry-charts' ),
					'value'       => 200,
					'max_value'   => 1200,
					'min_value'   => 2,
					'value_step'  => 1
				),
				'height' => array(
					'id'          => 'height',
					'save'        => true,
					'type'        => 'stepper',
					'label'       => __( 'Height', 'cherry-charts' ),
					'description' => __( 'Chart height (for bar chart & non-radial progress bars)', 'cherry-charts' ),
					'value'       => 200,
					'max_value'   => 800,
					'min_value'   => 2,
					'value_step'  => 1
				)
			);

			$fields = apply_filters( 'cherry_charts_settins_meta_fields', $fields );

			$this->meta_fields = array_merge( $this->meta_fields, $fields );

			$result = '';

			foreach ( $fields as $field ) {
				$field['value'] = cherry_charts_get_meta( $post->ID, $field['id'], $field['value'] );
				$row_class = !empty( $field['chart_group'] ) ? esc_attr( $field['chart_group'] ) : '';
				$result .= '<div class="' . $row_class . '">' . $this->builder->add_form_item( $field ) . '</div>';
			}

			$nonce = wp_nonce_field( 'cherry_charts_nonce', 'cherry_charts_nonce', false, false );

			printf( '<div class="cherry-ui-core">%1s<div>%2s</div></div>', $result, $nonce );
		}

		/**
		 * chart content meta box
		 *
		 * @since  1.0.0
		 */
		function _content_box( $post ) {

			// Get templates.
			if ( class_exists( 'Cherry_Shortcode_Editor' ) ) {
				$templates = Cherry_Shortcode_Editor::dirlist( 'charts' );
			} else {
				$templates = array(
					'default.tmpl' => 'default.tmpl'
				);
			}

			$fields = array(

				'template' => array(
					'id'          => 'template',
					'save'        => true,
					'type'        => 'select',
					'label'       => __( 'Progress bar template', 'cherry-charts' ),
					'description' => __( 'Select progress bar template (this option allowed only for progress bars)', 'cherry-charts' ),
					'value'       => 'radial',
					'options'     => $templates,
					'chart_group' => 'progress_bar-group depend-group'
				),
				'chart_icon' => array(
					'id'          => 'chart_icon',
					'type'        => 'text',
					'label'       => __( 'Chart Icon', 'cherry-charts' ),
					'description' => __( 'Select chart icon', 'cherry-charts' ),
					'value'       => '',
					'chart_group' => 'progress_bar-group depend-group'
				),
				'icon_size' => array(
					'id'          => 'icon_size',
					'save'        => true,
					'type'        => 'stepper',
					'label'       => __( 'Chart Icon size', 'cherry-charts' ),
					'description' => __( 'Set chart icon size', 'cherry-charts' ),
					'value'       => 60,
					'max_value'   => 120,
					'min_value'   => 12,
					'value_step'  => 1,
					'chart_group' => 'progress_bar-group depend-group'
				),
				'icon_color' => array(
					'id'          => 'icon_color',
					'type'        => 'colorpicker',
					'label'       => __( 'Chart icon color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#bdc3c7',
					'chart_group' => 'progress_bar-group depend-group'
				),
				'show_title' => array(
					'id'            => 'show_title',
					'type'          => 'switcher',
					'label'         => __( 'Show chart title', 'cherry-charts' ),
					'description'   => '',
					'value'         => 'true',
					'toggle'        => array(
						'true_toggle'  => __( 'Yes', 'cherry-charts' ),
						'false_toggle' => __( 'No', 'cherry-charts' )
					),
					'chart_group' => 'multi_progress-group doughnut-group pie-group bar-group depend-group'
				),
				'show_labels' => array(
					'id'            => 'show_labels',
					'type'          => 'switcher',
					'label'         => __( 'Show chart label', 'cherry-charts' ),
					'description'   => '',
					'value'         => 'true',
					'toggle'        => array(
						'true_toggle'  => __( 'Yes', 'cherry-charts' ),
						'false_toggle' => __( 'No', 'cherry-charts' )
					),
					'chart_group'   => 'doughnut-group pie-group bar-group depend-group'
				),
				'show_legend' => array(
					'id'            => 'show_legend',
					'type'          => 'switcher',
					'label'         => __( 'Show chart legend', 'cherry-charts' ),
					'description'   => '',
					'value'         => 'true',
					'toggle'        => array(
						'true_toggle'  => __( 'Yes', 'cherry-charts' ),
						'false_toggle' => __( 'No', 'cherry-charts' )
					),
					'chart_group'   => 'doughnut-group pie-group bar-group depend-group'
				)
			);

			$fields = apply_filters( 'cherry_charts_content_meta_fields', $fields );

			$this->meta_fields = array_merge( $this->meta_fields, $fields );

			$result = '';

			foreach ( $fields as $field ) {
				$field['value'] = cherry_charts_get_meta( $post->ID, $field['id'], $field['value'] );
				$row_class = !empty( $field['chart_group'] ) ? esc_attr( $field['chart_group'] ) : '';
				$result .= '<div class="' . $row_class . '">' . $this->builder->add_form_item( $field ) . '</div>';
			}

			printf( '<div class="cherry-ui-core">%1s</div>', $result );

		}

		/**
		 * Callback function to show chart data meta box
		 *
		 * @since  1.0.0
		 *
		 * @param  object $post post obkect
		 */
		function _data_box( $post ) {

			$current_type = cherry_charts_get_meta( $post->ID, 'type', 'progress_bar' );

			foreach ( $this->chart_types as $type ) {

				$active_class = ( $type == $current_type ) ? 'active' : '';

				$atts_array = array(
					'type' => $type,
				);

				switch ( $type ) {
					case 'progress_bar':
						$spare_rows = 0;
						$spare_cols = 0;
						break;

					case 'pie':
						$spare_rows = 1;
						$spare_cols = 0;
						break;

					case 'multi_progress':
						$spare_rows = 1;
						$spare_cols = 0;
						break;

					case 'doughnut':
						$spare_rows = 1;
						$spare_cols = 0;
						break;

					case 'bar':
						$spare_rows = 1;
						$spare_cols = 1;
						break;

					default:
						$spare_rows = 0;
						$spare_cols = 0;
						break;
				}

				$atts_array['spare_rows'] = $spare_rows;
				$atts_array['spare_cols'] = $spare_cols;

				$atts = cherry_charts_parse_atts( $atts_array );

				$data = cherry_charts_get_meta( $post->ID, 'data_' . $type, array() );

				echo '<div id="cherry-chart-data-' . $type . '" class="cherry-chart-data_ ' . $active_class . '" ' . $atts . '></div>';
				echo '<input type="hidden" class="data-input-' . $type . '" name="' . $this->meta_key . '[data_' . $type . ']" value="' . json_encode( $data ) . '">';
			}
		}

		/**
		 * Callback function to show chart style box
		 *
		 * @since  1.0.0
		 *
		 * @param  object $post post obkect
		 */
		function _style_box( $post ) {
			$color_fields = array(
				'item_color_1' => array(
					'id'          => 'item_color_1',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #1 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#F7464A'
				),
				'item_color_2' => array(
					'id'          => 'item_color_2',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #2 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#46BFBD'
				),
				'item_color_3' => array(
					'id'          => 'item_color_3',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #3 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#FDB45C'
				),
				'item_color_4' => array(
					'id'          => 'item_color_4',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #4 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#f39c12'
				),
				'item_color_5' => array(
					'id'          => 'item_color_5',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #5 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#27ae60'
				),
				'item_color_6' => array(
					'id'          => 'item_color_6',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #6 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#16a085'
				),
				'item_color_7' => array(
					'id'          => 'item_color_7',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #7 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#2980b9'
				),
				'item_color_8' => array(
					'id'          => 'item_color_8',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #8 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#8e44ad'
				),
				'item_color_9' => array(
					'id'          => 'item_color_9',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #9 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#34495e'
				),
				'item_color_10' => array(
					'id'          => 'item_color_10',
					'type'        => 'colorpicker',
					'label'       => __( 'Item #10 color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#d35400'
				)
			);

			$color_fields = apply_filters( 'cherry_charts_colors_meta_fields', $color_fields );

			$this->meta_fields = array_merge( $this->meta_fields, $color_fields );

			$colors = '';

			foreach ( $color_fields as $field ) {
				$field['value'] = cherry_charts_get_meta( $post->ID, $field['id'], $field['value'] );
				$colors .= $this->builder->add_form_item( $field );
			}

			$style_fields = array(
				'bg_color' => array(
					'id'          => 'bg_color',
					'type'        => 'colorpicker',
					'label'       => __( 'Background color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#ecf0f1'
				),
				'items_opacity' => array(
					'id'          => 'items_opacity',
					'type'        => 'stepper',
					'label'       => __( 'Items opacity', 'cherry-charts' ),
					'description' => __( 'Set items opacity (0 - transparent, 100 - opaque)', 'cherry-charts' ),
					'value'       => 100,
					'min_value'   => 0,
					'max_value'   => 100,
					'step'        => 1
				),
				'bg_opacity' => array(
					'id'          => 'bg_opacity',
					'type'        => 'stepper',
					'label'       => __( 'Background opacity', 'cherry-charts' ),
					'description' => __( 'Set Background opacity (0 - transparent, 100 - opaque)', 'cherry-charts' ),
					'value'       => 100,
					'min_value'   => 0,
					'max_value'   => 100,
					'step'        => 1
				),
				'canvas_stroke' => array(
					'id'          => 'canvas_stroke',
					'type'        => 'stepper',
					'label'       => __( 'Chart stroke thickness', 'cherry-charts' ),
					'description' => __( 'Set chart stroke thickness (0 - without stroke)', 'cherry-charts' ),
					'value'       => 5,
					'min_value'   => 0,
					'max_value'   => 30,
					'step'        => 1
				),
				'canvas_stroke_color' => array(
					'id'          => 'canvas_stroke_color',
					'type'        => 'colorpicker',
					'label'       => __( 'Chart stroke color', 'cherry-charts' ),
					'description' => '',
					'value'       => '#bdc3c7'
				),
				'canvas_stroke_opacity' => array(
					'id'          => 'canvas_stroke_opacity',
					'type'        => 'stepper',
					'label'       => __( 'Chart stroke opacity', 'cherry-charts' ),
					'description' => __( 'Set Chart stroke opacity (0 - transparent, 100 - opaque)', 'cherry-charts' ),
					'value'       => 100,
					'min_value'   => 0,
					'max_value'   => 100,
					'step'        => 1
				)
			);

			$style_fields = apply_filters( 'cherry_charts_style_meta_fields', $style_fields );

			$this->meta_fields = array_merge( $this->meta_fields, $style_fields );

			$style = '';

			foreach ( $style_fields as $field ) {
				$field['value'] = cherry_charts_get_meta( $post->ID, $field['id'], $field['value'] );
				$style .= $this->builder->add_form_item( $field );
			}

			printf( '<div class="cherry-ui-core"><div class="item-colors_">%1$s</div><div class="item-styles_">%2$s</div></div>', $colors, $style );
		}

		/**
		 * Callback function to show shortcode meta box
		 *
		 * @since  1.0.0
		 *
		 * @param  object $post post obkect
		 */
		function _shortcode_box( $post ) {
			global $post;
			echo '<div>[charts id=' . $post->ID . ']</div>';
		}

		/**
		 * Save chart meta ( insert or update )
		 *
		 * @since  1.0.0
		 *
		 * @param  array   $post_id  saved post id
		 * @param  object  $post     post object
		 * @param  bool    $update   is updating existing post or not
		 */
		function _save_meta( $post_id, $post, $update ) {

			// Verify the nonce.
			if ( !isset( $_POST['cherry_charts_nonce'] )
				|| ! wp_verify_nonce( $_POST['cherry_charts_nonce'], 'cherry_charts_nonce' ) ) {
				return;
			}

			// If this is an autosave, our form has not been submitted, so we don't want to do anything.
			if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
				return;
			}

			$data = isset( $_POST[$this->meta_key] ) ? $_POST[$this->meta_key] : false;

			if ( !$data || !is_array($data) ) {
				return;
			}

			foreach ( $data as $key => $value ) {
				$type = isset( $this->meta_fields[$key]['type'] ) ? $this->meta_fields[$key]['type'] : 'text';
				if ( false === strpos( $key, 'data_' ) ) {
					$data[$key] = $this->_sanitize_meta( $value, $type );
				} else {
					$data[$key] = $this->_sanitize_table_data( $value, $key );
				}
			}

			cherry_charts_delete_cache( $post_id );

			update_post_meta( $post_id, $this->meta_key, $data );
		}

		/**
		 * Delete chart transient on post delete
		 *
		 * @since  1.0.0
		 *
		 * @param  array  $id  post ID
		 */
		function _delete_chart_transient( $id ) {
			cherry_charts_delete_cache( $id );
		}

		/**
		 * Sanitize meta values before saving
		 *
		 * @since  1.0.0
		 *
		 * @param  mixed  $value  meta value to save
		 * @param  string $type   meta value type
		 * @return mixed          sanitized value
		 */
		function _sanitize_meta( $value, $type ) {

			switch ( $type ) {
				case 'select':
					$value = esc_attr( $value );
					break;

				default:
					$value = sanitize_text_field( $value );
					break;
			}

			return $value;
		}

		/**
		 * Sanitize chart data table before save into data base
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value JSON-encoded data
		 * @param  string $key   data key
		 * @return array         sanitized data array
		 */
		function _sanitize_table_data( $value, $key ) {

			$chart_type = str_replace( 'data_', '', $key );

			if ( ! in_array( $chart_type, $this->chart_types ) ) {
				return array();
			}

			$data_parsed   = json_decode( stripslashes( $value ) );
			$data_filtered = array();

			if ( ! $data_parsed ) {
				return $data_filtered;
			}

			foreach ( $data_parsed as $index => $row ) {

				$f_row = array_filter( $row );

				if ( empty($f_row) ) {
					continue;
				}
				array_walk(
					$row,
					array( $this, '_sanitize_table_row' ), array( 'row' => $index, 'type' => $chart_type )
				);
				$data_filtered[] = $row;

			}

			return $data_filtered;
		}

		/**
		 * Sanitize single value in data table row
		 *
		 * @since  1.0.0
		 *
		 * @param  mixed  &$value input value
		 * @param  int    $col    value index in row
		 * @param  array  $data   array with value row index and table type
		 */
		function _sanitize_table_row( &$value, $col, $data ) {

			$row = $data['row'];

			// sanitize service titles in progress bar table (just in case)
			if ( 'progress_bar' == $data['type'] && $row == 0 ) {
				$value = sanitize_text_field( $value );
				return;
			}
			// sanitize label in progress bar table
			if ( 'progress_bar' == $data['type'] && $row == 1 && $col == 0 ) {
				$value = sanitize_text_field( $value );
				return;
			}
			// sanitize values in progress bar
			if ( 'progress_bar' == $data['type'] && $row >=1 && $col >= 1 ) {
				$value = ( intval( $value ) != 0 ) ? intval( $value ) : null;
				return;
			}
			// sanitize label in doughnut & pie
			if ( ( 'pie' == $data['type'] || 'doughnut' == $data['type'] ) && $col == 0 ) {
				$value = sanitize_text_field( $value );
				return;
			}
			// sanitize value in doughnut & pie
			if ( ( 'pie' == $data['type'] || 'doughnut' == $data['type'] ) && $col == 1 ) {
				$value = ( intval( $value ) != 0 ) ? intval( $value ) : null;
				return;
			}
			// sanitize labels in bar chart
			if ( 'bar' == $data['type'] && ( $col == 0 || $row == 0 ) ) {
				$value = sanitize_text_field( $value );
				return;
			}
			// sanitize values in bar chart
			if ( 'bar' == $data['type'] && $col != 0 && $row != 0 ) {
				$value = ( intval( $value ) != 0 ) ? intval( $value ) : null;
				return;
			}
		}
	}

}