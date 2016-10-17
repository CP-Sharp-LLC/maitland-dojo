<?php
/**
 * Charts output shortcode
 *
 * @package   cherry_charts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( ! class_exists( 'cherry_charts_shortcode' ) ) {

	/**
	 * Cherry cahrts shortcode init class
	 */
	class cherry_charts_shortcode {

		/**
		 * Chart settings array (using only for templating for progress bars)
		 *
		 * @since  1.0.0
		 * @var    array
		 */
		public $chart_data = array();

		function __construct() {
			add_shortcode( 'charts', array( $this, 'charts_shortcode' ) );

			// Register shortcode and add it to the dialog.
			add_filter( 'cherry_shortcodes/data/shortcodes', array( $this, 'shortcode_register' ) );
			add_filter( 'cherry_templater/data/shortcodes',  array( $this, 'shortcode_register' ) );

			add_filter( 'cherry_templater_target_dirs', array( $this, 'register_template_dir' ) );
			add_filter( 'cherry_templater_macros_buttons', array( $this, 'register_macros_buttons' ), 10, 2 );
		}

		/**
		 * regiter template directory for editor
		 *
		 * @since  1.0.0
		 *
		 * @return array  registered directories for editor
		 */
		function register_template_dir( $dirs ) {
			$dirs[] = CHERRY_CHARTS_DIR;
			return $dirs;
		}

		/**
		 * Register macros buttons for shortcode editor
		 *
		 * @since  1.0.0
		 *
		 * @param  array  $buttons    default buttons
		 * @param  string $shortcode  shortcode name
		 * @return array              filtered buttons
		 */
		function register_macros_buttons( $buttons, $shortcode ) {

			if ( 'charts' != $shortcode ) {
				return $buttons;
			}

			$buttons = array(
				'title' => array(
					'id'    => 'cherry_title',
					'value' => __( 'Title', 'cherry-charts' ),
					'open'  => '%%TITLE%%',
					'close' => '',
				),
				'label' => array(
					'id'    => 'cherry_label',
					'value' => __( 'Label', 'cherry-charts' ),
					'open'  => '%%LABEL%%',
					'close' => '',
				),
				'icon' => array(
					'id'    => 'cherry_icon',
					'value' => __( 'Icon', 'cherry-charts' ),
					'open'  => '%%ICON%%',
					'close' => '',
				),
				'pie_icon' => array(
					'id'    => 'cherry_pie_icon',
					'value' => __( 'Pie icon styles', 'cherry-charts' ),
					'title' => __( 'Apply this only as style attribute value' ),
					'open'  => '%%PIESTYLE%%',
					'close' => '',
				),
				'bar' => array(
					'id'    => 'cherry_bar',
					'value' => __( 'Progress bar (or pie)', 'cherry-charts' ),
					'open'  => '%%BAR%%',
					'close' => '',
				),
				'progress' => array(
					'id'    => 'cherry_progress',
					'value' => __( 'Progress value', 'cherry-shortcodes-templater' ),
					'open'  => '%%PROGRESS%%',
					'close' => '',
				),
				'total' => array(
					'id'    => 'cherry_total',
					'value' => __( 'Total', 'cherry-shortcodes-templater' ),
					'open'  => '%%TOTAL%%',
					'close' => '',
				),
				'percent' => array(
					'id'    => 'cherry_percent',
					'value' => __( 'Progress percent', 'cherry-shortcodes-templater' ),
					'open'  => '%%PERCENT%%',
					'close' => '',
				)
			);

			return $buttons;
		}

		/**
		 * Register Charts shortcode for shortcodes ultimate
		 *
		 * @since  1.0.0
		 *
		 * @param  array   $shortcodes Original plugin shortcodes.
		 * @return array               Modified array.
		 */
		public function shortcode_register( $shortcodes ) {
			$shortcodes['charts'] = array(
				'name'  => __( 'Charts', 'cherry-charts' ), // Shortcode name.
				'desc'  => 'This is a Charts Shortcode',
				'type'  => 'single',
				'group' => 'content',
				'atts'  => array( // List of shortcode params (attributes).
					'id' => array(
						'default' => 0,
						'name'    => __( 'Chart ID', 'cherry-charts' ),
						'desc'    => __( 'Enter Chart ID to show', 'cherry-charts' )
					),
					'custom_class' => array(
						'default' => '',
						'name'    => __( 'Class', 'cherry-charts' ),
						'desc'    => __( 'Extra CSS class', 'cherry-charts' )
					)
				),
				'icon'     => 'bar-chart-o', // Custom icon (font-awesome).
				'function' => array( $this, 'charts_shortcode' ), // Name of shortcode function.
				'use_template' => false
			);

			return $shortcodes;
		}

		/**
		 * Cherry charts shortcode output
		 *
		 * @since  1.0.0
		 * @since  1.1.0  added multi progress bar.
		 *
		 * @param  array  $atts    shortcode atts.
		 * @param  string $content shortcode content.
		 * @return string          shortcode output.
		 */
		function charts_shortcode( $atts, $content = null ) {

			$defaults = array(
				'id'           => '',
				'custom_class' => ''
			);

			extract( shortcode_atts( $defaults, $atts, 'cherry_chart' ) );

			$id = intval( $id );

			if ( ! $id ) {
				return '<div class="error">' . __( 'Please, provide correct Chart ID', 'cherry-charts' ) . '</div>';
			}

			$cached = cherry_charts_get_cache( $id );

			// enqueue charts JS
			wp_enqueue_script( 'charts' );
			wp_enqueue_script( 'charts-public' );

			if ( $cached ) {
				return $cached;
			}

			$chart = get_post( $id );

			if ( ! $chart ) {
				return '<div class="error">' . __( 'Chart does not exist', 'cherry-charts' ) . '</div>';
			}

			$type = cherry_charts_get_meta( $id, 'type', 'progress_bar' );

			$result  = '<div class="">';

			switch ( $type ) {
				case 'progress_bar':
					$content .= $this->chart_progress_bar( $id, false );
					break;

				case 'multi_progress':
					$content .= $this->chart_progress_bar( $id, true );
					break;

				case 'bar':
					$content .= $this->chart_bar( $id );
					break;

				default:
					$content .= $this->chart_pie( $id, $type );
					break;
			}

			$result .= '</div>';

			$result = sprintf(
				'<div class="cherry-chart chart-%1$s chart-id-%4$s %2$s">%3$s</div>',
				esc_attr( $type ),
				esc_attr( $custom_class ),
				$content,
				$id
			);

			cherry_charts_set_cache( $id, $result );

			return $result;
		}

		/**
		 * Get charts progress bar content
		 *
		 * @since  1.0.0
		 *
		 * @param  int    $id       Chart post ID.
		 * @param  bool   $is_multi is simple or muti progress bar.
		 * @return string           chart output
		 */
		function chart_progress_bar( $id, $is_multi = false ) {

			if ( true === $is_multi ) {
				$data_type = 'data_multi_progress';
				$bar_type  = 'horizontal';
			} else {
				$data_type = 'data_progress_bar';
				$bar_type  = cherry_charts_get_meta( $id, 'bar_type', 'radial' );
			}

			$width      = cherry_charts_get_meta( $id, 'width', 200 );
			$height     = cherry_charts_get_meta( $id, 'height', 200 );
			$data       = cherry_charts_get_meta( $id, $data_type, array() );
			$color      = cherry_charts_get_meta( $id, 'item_color_1', false );
			$opacity    = cherry_charts_get_meta( $id, 'items_opacity', 100 );
			$bg_color   = cherry_charts_get_meta( $id, 'bg_color', false );
			$bg_opacity = cherry_charts_get_meta( $id, 'bg_opacity', 100 );
			$color      = cherry_charts_maybe_to_rgba( $color, $opacity );
			$bg_color   = cherry_charts_maybe_to_rgba( $bg_color, $bg_opacity );
			$icon_data  = $this->get_chart_icon( $id );
			$icon       = $icon_data['icon'];
			$icon_style = $icon_data['icon_style'];

			if ( empty( $data ) ) {
				return '<div class="error">' . __( 'Chart data is empty', 'cherry-charts' ) . '</div>';
			}

			if ( ! $is_multi ) {

				$label    = isset( $data[1][0] ) ? $data[1][0] : '';
				$progress = isset( $data[1][1] ) ? $data[1][1] : 80;
				$total    = isset( $data[1][2] ) ? $data[1][2] : 100;
				$percent  = round( ( $progress * 100 / $total ), 0 );
				$left     = ( $total - $progress < 0 ) ? $progress : $total - $progress;

			}

			// Default bar area styles (the same for horizontal and vertical bars, for radial - rewrited below)
			$style_array = array(
				'width'            => $width . 'px',
				'height'           => $height . 'px',
				'background-color' => $bg_color
			);

			$border = cherry_charts_get_meta( $id, 'canvas_stroke', 0 );

			if ( $border != 0 ) {

				$border_color   = cherry_charts_get_meta( $id, 'canvas_stroke_color', '#bdc3c7' );
				$border_opacity = cherry_charts_get_meta( $id, 'canvas_stroke_opacity', 100 );

				$style_array['border-width'] = $border . 'px';
				$style_array['border-style'] = 'solid';
				$style_array['border-color'] = cherry_charts_maybe_to_rgba( $border_color, $border_opacity );

			}

			$style_att = cherry_charts_parse_css( $style_array );

			switch ( $bar_type ) {

				case 'radial':

					$cutout = cherry_charts_get_meta( $id, 'inner_cut', 50 );

					/**
					 * Filter custom scrip parameters. Pass to init via data attribue 'user-settings'
					 * and merged with default chart init
					 *
					 * @since  1.0.0
					 *
					 * @var    array
					 * @param  int  $id  chart ID
					 */
					$user_chart_settings = apply_filters( 'cherry_charts_progress_bar_user_settings', array(), $id );

					$data_atts = array(
						'percent'       => $percent,
						'value'         => $progress,
						'left'          => $left,
						'cutout'        => $cutout,
						'color'         => $color,
						'bg-color'      => $bg_color,
						'user-settings' => json_encode( $user_chart_settings )
					);

					$border_radius = ( $width > $height ) ? $width : $height;

					$style_array['border-radius'] = $border_radius . 'px';

					$data_atts = cherry_charts_parse_atts( $data_atts );
					$style_att = cherry_charts_parse_css( $style_array );

					$bar_format = sprintf(
						'<div class="cherry-charts-bar radial" %1$s><canvas width="%2$d" height="%3$d" style="%4$s"></canvas></div>',
						$data_atts, $width, $height, $style_att
					);
					break;

				default:

					$bar_style_array = array(
						'background-color' => $color
					);

					$bar_style_att = cherry_charts_parse_css( $bar_style_array );

					if ( ! $is_multi ) {
						$bar_format = sprintf(
							'<span class="cherry-charts-bar %5$s" data-animate="yes" data-percent="%1$d" data-value="%2$d" style="%3$s"><span class="cherry-charts-progress" style="%4$s"></span></span>',
							$percent, $progress, $style_att, $bar_style_att, $bar_type
						);
					} else {
						$multi_bars = $this->chart_multi_progress( $id, $data );
						$bar_format = sprintf(
							'<span class="cherry-charts-bar multi-bar" data-animate="yes" style="%1$s">%2$s</span>',
							$style_att, $multi_bars
						);
					}

					break;
			}

			// if is multi progress - we done
			if ( $is_multi ) {

				$show_title = cherry_charts_get_meta( $id, 'show_title', 'true' );
				$title      = '';

				if ( 'true' == $show_title ) {
					$title = get_the_title( $id );
				}

				return sprintf(
					apply_filters(
						'cherry_charts_multi_progress_format',
						'<div class="cherry-multiprogress"><h3 class="cherry-multiprogress_title">%1$s</h3>%2$s</div>'
					),
					$title, $bar_format
				);
			}

			$meta = compact(
				'bar_type', 'width', 'height', 'icon', 'data', 'color', 'opacity', 'bg_color', 'bg_opacity', 'border'
			);

			/**
			 * Filter default progress bar format
			 *
			 * @since 1.0.0
			 *
			 * @param string $bar_format default.
			 * @param int    $id         chart ID.
			 * @param string $bar_type   current progress bar type.
			 */
			$bar_format = apply_filters( 'cherry_charts_progress_bar_format', $bar_format, $id, $meta );

			$chart_data = array(
				'id'       => $id,
				'title'    => get_the_title( $id ),
				'label'    => $label,
				'progress' => $progress,
				'icon'     => $icon,
				'bar'      => $bar_format,
				'total'    => $total,
				'percent'  => $percent . '%',
				'piestyle' => apply_filters( 'cherry_charts_progress_pie_styles', $icon_style )
			);

			/**
			 * Filter progress bar template data
			 *
			 * @since 1.0.0
			 *
			 * @param array $chart_data default data
			 * @param int   $id         chart id
			 * @var   array
			 */
			$this->chart_data = apply_filters( 'cherry_charts_progress_bar_template_data', $chart_data, $id );

			$template = cherry_charts_get_meta( $id, 'template', 'default.tmpl' );

			$tpl_file = $this->get_template_path( $template, 'charts' );

			if ( ! $tpl_file ) {
				return '<div class="error">' . __( 'Template file does not exist', 'cherry-charts' ) . '</div>';
			}

			ob_start();
			require $tpl_file;
			$tpl = ob_get_contents();
			ob_end_clean();

			$content = preg_replace_callback( "/%%.+?%%/", array( $this, 'replace_callback' ), $tpl );

			$this->chart_data = array();

			return $content;
		}

		/**
		 * Get mnulti progress output
		 *
		 * @since  1.1.0
		 * @param  int   $id   chart ID.
		 * @param  array $data data values array.
		 * @return string
		 */
		public function chart_multi_progress( $id, $data ) {

			$i = 1;
			$item_format = '<span class="cherry-charts-multi-item" style="%3$s"><span class="cherry-charts-multi-label">%1$s</span><span class="cherry-charts-multi-val">%2$s<i>%%</i></span></span>';
			$style_format = 'width:%1$s%%;background-color:%2$s;z-index:%3$s;';

			$item_format = apply_filters( 'cherry_charts_multi_item_format', $item_format );
			$result      = '';

			foreach ( $data as $item ) {

				if ( ! is_array( $item ) ) {
					continue;
				}

				$label = esc_attr( $item[0] );
				$value = intval( $item[1] );

				if ( 100 < $value ) {
					$value = 100;
				}

				$z_index = 101 - $value;
				$opacity = cherry_charts_get_meta( $id, 'items_opacity', 100 );
				$color   = cherry_charts_get_meta( $id, 'item_color_' . $i, '' );
				$color   = cherry_charts_maybe_to_rgba( $color, $opacity );
				$style   = sprintf( $style_format, $value, $color, $z_index );

				$result .= sprintf( $item_format, $label, $value, $style );

				$i++;
			}

			return $result;

		}

		/**
		 * Get chart icon HTML and style
		 *
		 * @since  1.1.0
		 * @param  int $id chart ID.
		 * @return array
		 */
		public function get_chart_icon( $id ) {

			$icon        = cherry_charts_get_meta( $id, 'chart_icon', '' );
			$icon_style  = array();
			$icon_size   = cherry_charts_get_meta( $id, 'icon_size' );
			$icon_color  = cherry_charts_get_meta( $id, 'icon_color' );
			$icon_format = apply_filters( 'cherry_charts_icon_format', '<span class="flaticon-%1$s"></span>' );
			$height      = cherry_charts_get_meta( $id, 'height', 200 );

			if ( $icon ) {
				$icon = sprintf( $icon_format, $icon, $icon_style );
			}

			$icon_style['font-size']   = ! empty( $icon_size ) ? $icon_size . 'px' : false;
			$icon_style['line-height'] = $height . 'px';
			$icon_style['color']       = ! empty( $icon_color ) ? $icon_color : false;
			$icon_style['position']    = 'absolute';
			$icon_style['top']         = '0px';
			$icon_style['left']        = '0px';
			$icon_style['bottom']      = '0px';
			$icon_style['right']       = '0px';
			$icon_style['text-align']  = 'center';

			$icon_style = cherry_charts_parse_css( $icon_style );

			return array(
				'icon'       => $icon,
				'icon_style' => $icon_style,
			);

		}

		/**
		 * Replace callbaks for template file
		 *
		 *
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

			$key = strtolower( trim( $matches[0], '%%' ) );

			if ( ! isset( $this->chart_data[$key] ) ) {
				return '';
			}

			return $this->chart_data[$key];
		}

		/**
		 * Get charts bar content
		 *
		 * @since  1.0.0
		 *
		 * @param  int    $id  Chart post ID
		 * @return string      chart output
		 */
		function chart_bar( $id ) {
			$width       = cherry_charts_get_meta( $id, 'width', 200 );
			$height      = cherry_charts_get_meta( $id, 'height', 200 );
			$icon        = cherry_charts_get_meta( $id, 'chart_icon', '' );
			$data        = cherry_charts_get_meta( $id, 'data_bar', array() );
			$opacity     = cherry_charts_get_meta( $id, 'items_opacity', 100 );
			$bg_color    = cherry_charts_get_meta( $id, 'bg_color', false );
			$bg_opacity  = cherry_charts_get_meta( $id, 'bg_opacity', 100 );
			$border      = cherry_charts_get_meta( $id, 'canvas_stroke', 0 );
			$show_title  = cherry_charts_get_meta( $id, 'show_title', 'yes' );
			$show_labels = cherry_charts_get_meta( $id, 'show_labels', 'yes' );
			$show_legend = cherry_charts_get_meta( $id, 'show_legend', 'yes' );

			// fix labels triggers
			if ( 'true' == $show_title ) {
				$show_title = 'yes';
			}
			if ( 'true' == $show_labels ) {
				$show_labels = 'yes';
			}
			if ( 'true' == $show_legend ) {
				$show_legend = 'yes';
			}

			$bg_color = cherry_charts_maybe_to_rgba( $bg_color, $bg_opacity );

			if ( empty( $data ) ) {
				return __( 'No data to show', 'cherry-charts' );
			}

			$prepared_data = array();
			$labels        = array();

			foreach ( $data as $index => $value ) {

				if ( 0 == $index ) {
					foreach ( $value as $row_index => $row_value ) {
						if ( $row_index == 0 ) {
							continue;
						}
						$labels[] = $row_value;
					}
				}

				if ( 0 < $index ) {
					$color = cherry_charts_get_meta( $id, 'item_color_' . $index, '' );
					$color = cherry_charts_maybe_to_rgba( $color, $opacity );

					$pass_data = $value;
					array_splice($pass_data, 0, 1);

					$prepared_data[] = array(
						'label'     => !empty( $value[0] ) ? $value[0] : '',
						'fillColor' => $color,
						'data'      => $pass_data
					);
				}

			}

			$prepared_data = json_encode($prepared_data);
			$labels        = json_encode($labels);

			/**
			 * Filter custom scrip parameters. Pass to init via data attribue 'user-settings'
			 * and merged with default chart init
			 *
			 * @since  1.0.0
			 *
			 * @var    array
			 * @param  int  $id  chart ID
			 */
			$user_chart_settings = apply_filters( 'cherry_charts_bar_user_settings', array(), $id );

			$data_atts = array(
				'labels'        => $labels,
				'bar'           => $prepared_data,
				'show-labels'   => $show_labels,
				'show-legend'   => $show_legend,
				'user-settings' => json_encode( $user_chart_settings )
			);

			$data_atts = cherry_charts_parse_atts( $data_atts );

			$title = ( 'yes' == $show_title ) ? '<h3>' . get_the_title( $id ) . '</h3>' : '';

			$pie_format = sprintf(
				'%4$s<div class="cherry-charts-type-bar" %1$s><canvas width="%2$d" height="%3$d"></canvas></div>',
				$data_atts, $width, $height, $title
			);

			return apply_filters( 'cherry_charts_pie_format', $pie_format, $id );
		}

		/**
		 * Get charts pie and doughnut content
		 *
		 * @since  1.0.0
		 *
		 * @param  int    $id  Chart post ID
		 * @param  string $id  Chart type
		 * @return string      Chart output
		 */
		function chart_pie( $id, $type ) {

			$width       = cherry_charts_get_meta( $id, 'width', 200 );
			$height      = cherry_charts_get_meta( $id, 'height', 200 );
			$icon        = cherry_charts_get_meta( $id, 'chart_icon', '' );
			$data        = cherry_charts_get_meta( $id, 'data_' . $type, array() );
			$opacity     = cherry_charts_get_meta( $id, 'items_opacity', 100 );
			$bg_color    = cherry_charts_get_meta( $id, 'bg_color', false );
			$bg_opacity  = cherry_charts_get_meta( $id, 'bg_opacity', 100 );
			$border      = cherry_charts_get_meta( $id, 'canvas_stroke', 0 );
			$show_title  = cherry_charts_get_meta( $id, 'show_title', 'yes' );
			$show_labels = cherry_charts_get_meta( $id, 'show_labels', 'yes' );
			$show_legend = cherry_charts_get_meta( $id, 'show_legend', 'yes' );

			// fix labels triggers
			if ( 'true' == $show_title ) {
				$show_title = 'yes';
			}
			if ( 'true' == $show_labels ) {
				$show_labels = 'yes';
			}
			if ( 'true' == $show_legend ) {
				$show_legend = 'yes';
			}

			$bg_color = cherry_charts_maybe_to_rgba( $bg_color, $bg_opacity );

			if ( empty( $data ) ) {
				return __( 'No data to show', 'cherry-charts' );
			}

			$prepared_data = array();

			foreach ( $data as $index => $value ) {
				$color = cherry_charts_get_meta( $id, 'item_color_' . ( $index + 1), '' );
				$color = cherry_charts_maybe_to_rgba( $color, $opacity );
				$prepared_data[$index] = array(
					'value' => !empty( $value[1] ) ? intval( $value[1] ) : 0,
					'label' => !empty( $value[0] ) ? $value[0] : '',
					'color' => $color
				);
			}

			$prepared_data = json_encode($prepared_data);

			/**
			 * Filter custom scrip parameters. Pass to init via data attribue 'user-settings'
			 * and merged with default chart init
			 *
			 * @since  1.0.0
			 *
			 * @var    array
			 * @param  int  $id  chart ID
			 */
			$user_chart_settings = apply_filters( 'cherry_charts_pie_user_settings', array(), $id );

			$data_atts = array(
				$type           => $prepared_data,
				'show-labels'   => $show_labels,
				'show-legend'   => $show_legend,
				'user-settings' => json_encode( $user_chart_settings )
			);

			if ( 'doughnut' == $type ) {
				$data_atts['cutout'] = cherry_charts_get_meta( $id, 'inner_cut', 50 );
			}

			$data_atts = cherry_charts_parse_atts( $data_atts );

			$title = ( 'yes' === $show_title ) ? '<h3>' . get_the_title( $id ) . '</h3>' : '';

			$pie_format = sprintf(
				'%5$s<div class="cherry-charts-%4$s" %1$s><canvas width="%2$d" height="%3$d"></canvas></div>',
				$data_atts, $width, $height, $type, $title
			);

			return apply_filters( 'cherry_charts_pie_format', $pie_format, $id );
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
			$default    = CHERRY_CHARTS_DIR . 'templates/shortcodes/' . $shortcode . '/default.tmpl';
			$subdir     = 'templates/shortcodes/' . $shortcode . '/' . $template_name;
			$upload_dir = wp_upload_dir();
			$upload_dir = trailingslashit( $upload_dir['basedir'] );

			if ( file_exists( $upload_dir . $subdir ) ) {
				$file = $upload_dir . $subdir;
			} elseif ( file_exists( CHERRY_CHARTS_DIR . $subdir ) ) {
				$file = CHERRY_CHARTS_DIR . $subdir;
			} elseif ( file_exists( $default ) ) {
				$file = $default;
			}

			$file = apply_filters( 'cherry_shortcodes_get_template_path', $file, $template_name, $shortcode );

			return $file;
		}

	}

	new cherry_charts_shortcode();
}