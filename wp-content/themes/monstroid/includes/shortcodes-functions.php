<?php
/**
 * Customized shortcodes functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

// Register shortcode for returns the current logo.
add_shortcode( 'image_logo', 'monstroid_logo_shortcode' );
function monstroid_logo_shortcode( $atts ) {

	if ( 'image' !== cherry_get_option( 'logo-type' ) ) {
		return;
	}

	$logo_url = wp_get_attachment_image_src( cherry_get_option( 'logo-image-path' ), 'full' );

	if ( false === $logo_url ) {
		return;
	}

	return '<img src="' . esc_url( $logo_url[0] ) . '">';
}

// Group add new options in cherryshortcodes
add_filter( 'cherry_shortcodes/data/shortcodes', 'monstroid_add_theme_uri_shortcode_other_options', 999 );
function monstroid_add_theme_uri_shortcode_other_options( $shortcodes ) {

	//Adds a `Theme URI` shortcode to the `Cherry Shortcodes` plugin.
	$shortcodes['theme_uri'] = array(
		'name'  => __( 'Theme URI', 'monstroid' ), // Shortcode name.
		'desc'  => __( 'This is a Theme URI Shortcode', 'monstroid' ),
		'type'  => 'single', // Can be 'wrap' or 'single'.
		'group' => 'content', // Can be 'content', 'box', 'media' or 'other'.
		'atts'  => array( // List of shortcode params (attributes).
			'custom_class' => array(
				'default' => '',
				'name'    => __( 'Class', 'monstroid' ),
				'desc'    => __( 'Extra CSS class', 'monstroid' ),
			),
		),
		'icon'     => 'link', // Custom icon (font-awesome).
		'function' => 'monstroid_theme_uri_callback' // Name of shortcode function.
	);

	// Box options
	$shortcodes['box']['atts']['preset']['values'] = array(
		'primary'          => __( 'Primary', 'monstroid' ),
		'secondary'        => __( 'Secondary', 'monstroid' ),
		'simple'           => __( 'Simple', 'monstroid' ),
		'vertical_align'   => __( 'Vertical align', 'monstroid' ),
	);
	$shortcodes['box_inner']['atts']['preset']['values'] = array(
		'primary'          => __( 'Primary', 'monstroid' ),
		'secondary'        => __( 'Secondary', 'monstroid' ),
		'simple'           => __( 'Simple', 'monstroid' ),
		'vertical_align'   => __( 'Vertical align', 'monstroid' ),
	);

	// Title box options
	$shortcodes['title_box']['atts']['align'] = array(
		'type'   => 'select',
		'values' => array(
			'left'   => __( 'Left', 'monstroid' ),
			'right'  => __( 'Right', 'monstroid' ),
			'center' => __( 'Center', 'monstroid' ),
		),
		'default' => 'left',
		'name'    => __( 'Align', 'monstroid' ),
		'desc'    => __( 'Titles alignment', 'monstroid' ),
	);
	$shortcodes['title_box']['atts']['title_priority'] = array(
		'type'   => 'select',
		'values' => array(
			'title_subtitle'   => __( 'Title > Subtitle', 'monstroid' ),
			'subtitle_title'   => __( 'Subtitle > Title', 'monstroid' )
		),
		'default' => 'title_subtitle',
		'name'    => __( 'Title or subtitle be first?', 'monstroid' ),
		'desc'    => __( 'Subtitle after title or title after subtitle', 'monstroid' ),
	);
	$shortcodes['title_box']['atts']['title_size'] = array(
		'type'   => 'select',
		'values' => array(
			'normal'   	=> __( 'Style 1 (normal)', 'monstroid' ),
			'smaller'   => __( 'Style 2 (smaller)', 'monstroid' ),
			'bigger'    => __( 'Style 3 (bigger)', 'monstroid' )
		),
		'default' => 'big',
		'name'    => __( 'Title size', 'monstroid' ),
		'desc'    => __( 'Choose default size of title', 'monstroid' ),
	);

	// Icon options
	$shortcodes['icon']['atts']['background'] = array(
		'type'    => 'color',
		'values'  => array(),
		'default' => '',
		'name'    => __( 'Background Color', 'monstroid' ),
		'desc'    => __( 'Select background color', 'monstroid' ),
	);
	$shortcodes['icon']['atts']['border'] = array(
		'type'    => 'border',
		'default' => 'none',
		'name'    => __( 'Border', 'monstroid' ),
		'desc'    => __( 'Setup border', 'monstroid' ),
	);
	$shortcodes['icon']['atts']['type'] = array(
		'type'   => 'select',
		'values' => array(
			'normal'   	=> __( 'Normal', 'monstroid' ),
			'square'   	=> __( 'Square', 'monstroid' ),
			'round'  	=> __( 'Round', 'monstroid' ),
		),
		'default' => 'normal',
		'name'    => __( 'Geometric type', 'monstroid' ),
		'desc'    => __( 'Choose geometric type', 'monstroid' ),
	);

	if ( isset( $shortcodes['follow'] ) ) {

		// Social (sharing, follow) options
		$shortcodes['follow']['atts']['style'] = array(
			'type'   => 'select',
			'values' => array(
				'normal'   	=> __( 'Normal', 'monstroid' ),
				'only-logos'=> __( 'Only Logos', 'monstroid' ),
			),
			'default' => 'normal',
			'name'    => __( 'Style of social icons', 'monstroid' ),
			'desc'    => __( 'Choose style of icons', 'monstroid' ),
		);
	}

	$shortcodes['sharing']['atts']['style'] = array(
		'type'   => 'select',
		'values' => array(
			'normal'     => __( 'Normal', 'monstroid' ),
			'only-logos' => __( 'Only Logos', 'monstroid' ),
		),
		'default' => 'normal',
		'name'    => __( 'Style of social icons', 'monstroid' ),
		'desc'    => __( 'Choose style of icons', 'monstroid' ),
	);

	return $shortcodes;
}

function monstroid_theme_uri_callback( $atts ) {
	return CHILD_URI;
}

// Adds extra HTML markup for radial progress bars.
add_filter( 'cherry_charts_progress_bar_format', 'monstroid_extend_circle_bar', 10, 3 );
function monstroid_extend_circle_bar( $output, $id, $meta ) {

	if ( 'radial' != $meta['bar_type'] ) {
		return $output;
	}

	if ( ! isset( $meta['border'] ) || ! $meta['border'] ) {
		return $output;
	}

	if ( ! function_exists( 'cherry_charts_get_meta' ) || ! function_exists( 'cherry_charts_maybe_to_rgba' ) ) {
		return $output;
	}

	$border_color   = cherry_charts_get_meta( $id, 'canvas_stroke_color', '#bdc3c7' );
	$border_opacity = cherry_charts_get_meta( $id, 'canvas_stroke_opacity', 100 );

	$color = cherry_charts_maybe_to_rgba( $border_color, $border_opacity );
	$style = 'style="background-color:' . $color . '"';

	$output .= '<div class="chart-marker" ' . $style . '><span ' . $style . '></span></div>';

	return $output;

}

// Extends charts admin metaboxes for Monstroid.
add_filter( 'cherry_charts_settins_meta_fields', 'monstroid_extend_charts_meta' );
function monstroid_extend_charts_meta( $fields ) {

	$fields['is_triangle_bar'] = array(
		'id'            => 'is_triangle_bar',
		'type'          => 'switcher',
		'label'         => __( 'Triangle progress bar', 'monstroid' ),
		'description'   => '',
		'value'         => 'true',
		'chart_group' => 'progress_bar-group depend-group',
	);

	return $fields;
}

// Triangle Chart
add_filter( 'cherry_charts_progress_bar_format', 'monstroid_triangle_progress', 10, 3 );
function monstroid_triangle_progress( $output, $id, $meta ) {

	if ( 'vertical' != $meta['bar_type'] ) {
		return $output;
	}

	if ( ! function_exists( 'cherry_charts_get_meta' ) ) {
		return $output;
	}

	$is_triangle = cherry_charts_get_meta( $id, 'is_triangle_bar', 'true' );

	if ( ! $is_triangle || 'false' == $is_triangle ) {
		return $output;
	}

	$label    = isset( $meta['data'][1][0] ) ? $meta['data'][1][0] : '';
	$progress = isset( $meta['data'][1][1] ) ? $meta['data'][1][1] : 80;
	$total    = isset( $meta['data'][1][2] ) ? $meta['data'][1][2] : 100;
	$percent  = round( ($progress*100/$total), 0 );
	$left     = ( $total - $progress < 0 ) ? $progress : $total - $progress;

	$style_array['width']  = absint( $meta['width'] ) . 'px';
	$style_array['height'] = absint( $meta['height'] ) . 'px';

	if ( 0 != $meta['border'] ) {

		$border_color   = cherry_charts_get_meta( $id, 'canvas_stroke_color', '#bdc3c7' );
		$border_opacity = cherry_charts_get_meta( $id, 'canvas_stroke_opacity', 100 );

		$style_array['border-width'] = $meta['border'] . 'px';
		$style_array['border-style'] = 'solid';

		if ( function_exists( 'cherry_charts_maybe_to_rgba' ) ) {
			$style_array['border-color'] = cherry_charts_maybe_to_rgba( $border_color, $border_opacity );
		}

	}

	if ( ! function_exists( 'cherry_charts_parse_css' ) ) {
		return $output;
	}

	$style_att = cherry_charts_parse_css( $style_array );

	$bar_w = absint( $style_array["width"]/2 );
	$bar_h = absint( $style_array["height"] ) * ( $percent / 100 );

	$bar_style_array = array(
		'border-style' => 'solid',
		'border-width' => '0 ' . $bar_w . 'px ' . $bar_h . 'px ' . $bar_w . 'px',
		'border-color' => 'transparent transparent ' . cherry_charts_maybe_to_rgba( $meta["color"], $meta["opacity"] ) . ' transparent'
	);

	$bar_style_att = cherry_charts_parse_css( $bar_style_array );

	$bar_format = sprintf(
		'<span class="cherry-charts-bar vertical" data-percent="%1$d" data-animate="no" data-value="%2$d" style="%3$s"><span class="cherry-charts-progress" style="%4$s"></span></span>',
		$percent, $bar_h, $style_att, $bar_style_att, '%'
	);

	return $bar_format;
}

// Add Position metabox in testi
add_filter( 'cherry_testimonials_metabox_params', 'monstroid_profession_metabox', 10, 2 );
function monstroid_profession_metabox( $metabox ) {
	$testiProfessionArray = array(
		array(
			'name' => __( 'Profession:', 'monstroid' ),
			'desc' => __( 'Enter a profession.', 'monstroid' ),
			'id'   => 'profession',
			'std'  => '',
		));
	$metabox['callback_args'] = array_merge( $metabox['callback_args'], $testiProfessionArray );
	return $metabox;
}

// Add testi rate function
add_filter( 'cherry_testimonials_metabox_after', 'monstroid_testi_rate', 10, 2 );
function monstroid_testi_rate( $metabox ) {
	$testi_rate = array(
		'name' => __( 'Rate:', 'monstroid' ),
		'desc' => __( 'Rate testimonal', 'monstroid' ),
		'id'   => 'rating',
		'std'  => '',
	);
	$field_id = CHERRY_TESTI_POSTMETA . '_' . $testi_rate['id'];
	$field_name = CHERRY_TESTI_POSTMETA . '[' . $testi_rate['id'] . ']';
	$field_desc = ( isset( $testi_rate['desc'] ) ) ? $testi_rate['desc'] : '';
	$field_std  = ( isset( $testi_rate['std'] ) ) ? $testi_rate['std'] : '';

	$post_meta = get_post_meta( get_the_ID(), CHERRY_TESTI_POSTMETA, true );

	if ( !empty( $post_meta ) && isset( $post_meta[ $testi_rate['id'] ] ) ) {
		$field_value = $post_meta[ $testi_rate['id'] ];
	} else {
		$field_value = $field_std;
	}
	echo '<p>';
	echo '<label for="'.esc_attr( $field_id ).'">' . esc_html( $testi_rate['name'] ) . '</label><br>';
	echo '<select name="'. esc_attr( $field_name ) .'" id="'. esc_attr( $field_id ) .'">';
	echo '<option value="one" '. selected( $field_value, 'one', false ) .'>Rate 1</option>';
	echo '<option value="two" '. selected( $field_value, 'two', false ) .'>Rate 2</option>';
	echo '<option value="three" '. selected( $field_value, 'three', false ) .'>Rate 3</option>';
	echo '<option value="four" '. selected( $field_value, 'four', false ) .'>Rate 4</option>';
	echo '<option value="five" '. selected( $field_value, 'five', false ) .'>Rate 5</option>';
	echo '</select><br>';

	echo '<small>' . esc_html( $field_desc ) . '</small>';
	echo '</p>';

	return $metabox;
}

// Add Department metabox in team
add_filter( 'cherry_team_metabox_params', 'monstroid_testimonals_department_metabox', 10, 2 );
function monstroid_testimonals_department_metabox( $metabox ) {
	$teamDepartmentArray = array(
		'department' => array(
			'id'          => 'department',
			'type'        => 'text',
			'title'       => __( 'Department:', 'monstroid' ),
			'label'       => '',
			'description' => '',
			'value'       => '',
		));
	$metabox['callback_args'] = array_merge( $metabox['callback_args'], $teamDepartmentArray );
	return $metabox;
}

// Testi raiting into testi shortcode & unset native position
add_filter( 'cherry_templater_macros_buttons', 'monstroid_testi_buttons', 20, 2 );
function monstroid_testi_buttons($buttons, $shortcode) {
	if ( 'testimonials' != $shortcode ) {
		return $buttons;
	}

	$buttons['testi_author_profession'] = array(
		'id'    => 'testi_author_profession',
		'value' => __( 'Profession', 'monstroid' ),
		'open'  => '%%TESTIPROFESSION%%',
		'close' => ''
	);
	$buttons['testi_author_rating'] = array(
		'id'    => 'testi_author_rating',
		'value' => __( 'Rating', 'monstroid' ),
		'open'  => '%%TESTIRATING%%',
		'close' => ''
	);

	unset($buttons['position']);

	return $buttons;
}

// Unset native testi position from carousel shortcode
add_filter( 'cherry_shortcodes_add_carousel_macros', 'monstroid_testi_buttons_carousel', 20, 1 );
function monstroid_testi_buttons_carousel($buttons) {
	unset($buttons['testi_position']);

	return $buttons;
}

// Testi Buttons in Grid Shortcode Templ
add_filter( 'cherry_templater_macros_buttons', 'monstroid_grid_macros', 10, 2 );
add_filter( 'cherry_grid_shortcode_data_callbacks', 'monstroid_testi_callbacks', 10, 2 );
add_filter( 'cherry_shortcodes_data_callbacks', 'monstroid_testi_callbacks', 10, 2 );
add_filter( 'cherry_testimonials_data_callbacks', 'monstroid_testi_callbacks', 12, 2);

// Add testi author macros button to shortcode templater
function monstroid_grid_macros( $buttons, $shortcode ) {
	if ( 'grid' != $shortcode && 'swiper_carousel' != $shortcode ) {
		return $buttons;
	}
	$buttons['testi_author'] = array(
		'id'    => 'testi_author',
		'value' => __( 'Author (Testimonials only)', 'monstroid' ),
		'open'  => '%%TESTIAUTHOR%%',
		'close' => ''
	);
	$buttons['testi_author_profession'] = array(
		'id'    => 'testi_author_profession',
		'value' => __( 'Profession (Testimonials only)', 'monstroid' ),
		'open'  => '%%TESTIPROFESSION%%',
		'close' => ''
	);
	$buttons['testi_author_rating'] = array(
		'id'    => 'testi_author_rating',
		'value' => __( 'Rating (Testimonials only)', 'monstroid' ),
		'open'  => '%%TESTIRATING%%',
		'close' => ''
	);
	return $buttons;
}

// Add callback function for testi customs
function monstroid_testi_callbacks( $data, $atts ) {
	$data['testiauthor'] = 'monstroid_get_testi_author';
	$data['testiprofession'] = 'monstroid_get_testi_profession';
	$data['testirating'] = 'monstroid_get_testi_rating';

	return $data;
}

// Get tesimonials custom taxonomies
function monstroid_get_testi_author() {
	global $post;
	$meta      = get_post_meta( $post->ID, '_cherry_testimonial', true );
	if ( empty( $meta['name'] ) ) {
		return false;
	}
	$format = '%1$s';
	$name   = $meta['name'];
	return sprintf( $name );
}
function monstroid_get_testi_profession() {
	global $post;
	$meta      = get_post_meta( $post->ID, '_cherry_testimonial', true );
	if ( empty( $meta['profession'] ) ) {
		return false;
	}
	$format = '%1$s';
	$profession   = $meta['profession'];

	return sprintf( $profession );
}
function monstroid_get_testi_rating() {
	global $post;
	$meta      = get_post_meta( $post->ID, '_cherry_testimonial', true );
	if ( empty( $meta['rating'] ) ) {
		return false;
	}
	$rating   = $meta['rating'];
	return sprintf( '<div class="rating-wrap"><div class="rating"><div class="stars %1$s"></div></div></div>', $rating );
}

// Moto Default paddings
add_action( 'mp_library', 'monstroid_extend_row_paddings_classes', 11, 1 );
function monstroid_extend_row_paddings_classes( $motopressCELibrary ) {

	if ( ! defined( 'CHERRY_SHORTCODES_PREFIX' ) ) {
		return;
	}

	if (isset($motopressCELibrary)) {

		$rowObj = &$motopressCELibrary->getObject( CHERRY_SHORTCODES_PREFIX . 'row');

		if ($rowObj) {
			$styleClasses = &$rowObj->getStyle('mp_style_classes');
			$styleClasses['predefined']['padding'] = array(
				'label'         => __('Paddings', 'monstroid'),
				'allowMultiple' => true,
				'values' => array(
					'padding-top-20' => array(
						'class' => 'padding-top-20',
						'label' => __('Padding top 20px', 'monstroid'),
					),
					'padding-top-40' => array(
						'class' => 'padding-top-40',
						'label' => __('Padding top 40px', 'monstroid'),
					),
					'padding-top-60' => array(
						'class' => 'padding-top-60',
						'label' => __('Padding top 60px', 'monstroid'),
					),
					'padding-top-80' => array(
						'class' => 'padding-top-80',
						'label' => __('Padding top 80px', 'monstroid'),
					),
					'padding-top-100' => array(
						'class' => 'padding-top-100',
						'label' => __('Padding top 100px', 'monstroid'),
					),
					'padding-top-120' => array(
						'class' => 'padding-top-120',
						'label' => __('Padding top 120px', 'monstroid'),
					),
					'padding-top-140' => array(
						'class' => 'padding-top-140',
						'label' => __('Padding top 140px', 'monstroid'),
					),
					'padding-top-160' => array(
						'class' => 'padding-top-160',
						'label' => __('Padding top 160px', 'monstroid'),
					),
					'padding-bottom-20' => array(
						'class' => 'padding-bottom-20',
						'label' => __('Padding bottom 20px', 'monstroid'),
					),
					'padding-bottom-40' => array(
						'class' => 'padding-bottom-40',
						'label' => __('Padding bottom 40px', 'monstroid'),
					),
					'padding-bottom-60' => array(
						'class' => 'padding-bottom-60',
						'label' => __('Padding bottom 60px', 'monstroid'),
					),
					'padding-bottom-80' => array(
						'class' => 'padding-bottom-80',
						'label' => __('Padding bottom 80px', 'monstroid'),
					),
					'padding-bottom-100' => array(
						'class' => 'padding-bottom-100',
						'label' => __('Padding bottom 100px', 'monstroid'),
					),
					'padding-bottom-120' => array(
						'class' => 'padding-bottom-120',
						'label' => __('Padding bottom 120px', 'monstroid'),
					),
					'padding-bottom-140' => array(
						'class' => 'padding-bottom-140',
						'label' => __('Padding bottom 140px', 'monstroid'),
					),
					'padding-bottom-160' => array(
						'class' => 'padding-bottom-160',
						'label' => __('Padding bottom 160px', 'monstroid'),
					),
				)
			);
		}
	}
}

// Tabs default styles
add_filter('cherry_shortcodes_tabs_styles', 'monstroid_shortcodes_tabs_styles');
function monstroid_shortcodes_tabs_styles( $settings ) {
	$settings = array(
		'default'  => __( 'Style-1', 'monstroid' ),
		'style-2'  => __( 'Style-2', 'monstroid' ),
		'pills-1'  => __( 'Pills-1', 'monstroid' ),
		'pills-2'  => __( 'Pills-2', 'monstroid' ),
		'pills-3'  => __( 'Pills-3', 'monstroid' ),
		'pills-4'  => __( 'Pills-4', 'monstroid' ),
		'pills-5'  => __( 'Pills-5', 'monstroid' ),
		'pills-6'  => __( 'Pills-6', 'monstroid' ),
		'simple-1' => __( 'Simple-1', 'monstroid' ),
		'simple-2' => __( 'Simple-2', 'monstroid' ),
		'simple-3' => __( 'Simple-3', 'monstroid' ),
		'simple-4' => __( 'Simple-4', 'monstroid' ),
		'simple-5' => __( 'Simple-5', 'monstroid' ),
		'simple-6' => __( 'Simple-6', 'monstroid' ),
	);
	return $settings;
}

// Row default styles
add_filter('custom_cherry_shortcodes_bg_atts', 'monstroid_shortcodes_row_style', 11, 2);
function monstroid_shortcodes_row_style( $atts, $bg_type ) {
	if ('image' === $bg_type) {
		$atts['preset']['values'] = array(
			'default'		=> __( 'Default', 'monstroid' ),
			'primary'		=> __( 'Primary', 'monstroid' ),
			'secondary'		=> __( 'Secondary', 'monstroid' ),
			'success'		=> __( 'Success', 'monstroid' ),
			'info'			=> __( 'Info', 'monstroid' ),
			'warning'		=> __( 'Warning', 'monstroid' ),
			'danger'		=> __( 'Danger', 'monstroid' ),
			'gray'			=> __( 'Gray', 'monstroid' ),
			'polygon-1'		=> __( 'Polygonal 1', 'monstroid' ),
			'polygon-2'		=> __( 'Polygonal 2', 'monstroid' ),
			'polygon-3'		=> __( 'Polygonal 3', 'monstroid' ),
			'polygon-4'		=> __( 'Polygonal 4', 'monstroid' ),
		);
		$atts['bg_color']['default'] = '';
	}
	return $atts;
}

// Add image class on row if in box use ordinary image (not parallax)
add_filter('shortcode_atts_box', 'monstroid_box_image_background_atts', 11, 3);
function monstroid_box_image_background_atts($out, $pairs, $atts) {

	if (isset($atts['bg_image']) && $atts['bg_image'] !== '') {
		$out['class'] .= ' image-bg ';
	}
	return $out;
}

// Add new args to title_box
add_filter('shortcode_atts_title_box', 'monstroid_new_title_box_attribute', 11, 3);
function monstroid_new_title_box_attribute($out, $pairs, $atts) {
	$out['align'] 			= 'left';
	$out['title_priority']  = 'title_subtitle';
	$out['title_size'] 		= 'normal';

	if (isset($atts['align'])) {
		switch ($atts['align']) {
			case 'center':
				$out['class'] .= ' center ';
				break;

			case 'right':
				$out['class'] .= ' right ';
				break;
		}
	}
	if (isset($atts['title_size'])) {
		switch ($atts['title_size']) {
			case 'smaller':
				$out['class'] .= ' smaller ';
				break;

			case 'bigger':
				$out['class'] .= ' bigger ';
				break;
		}
	}
	if (isset($atts['title_priority'])) {
		$out['title_priority']	= $atts['title_priority'];
	}

	return $out;
}

// Add new args to icons
add_filter('shortcode_atts_icon', 'monstroid_new_icons_attribute', 11, 3);
function monstroid_new_icons_attribute($out, $pairs, $atts) {
	$out['background'] 	= '';
	$out['border']  	= '';
	$out['type']  		= 'normal';

	if (isset($atts['background'])) {
		$out['background']	= $atts['background'];
	}
	if (isset($atts['border'])) {
		$out['border']		= $atts['border'];
	}
	if (isset($atts['type'])) {
		$out['type']		= $atts['type'];
	}

	return $out;
}

// New title_box format
add_filter('cherry_shortcodes_title_box_format','monstroid_new_title_box_format', 11, 3);
function monstroid_new_title_box_format($output, $atts) {
	if ( empty( $atts['title_priority'] ) ) {
       return $output;
    }

	$output['global'] = '<div class="%4$s"><div class="title-box_content"><div class="icon-title-wrap">%3$s<div><h2 class="title-box_title">%1$s</h2></div></div>%2$s</div></div>';
	$output['subtitle'] = '<h5 class="title-box_subtitle">%s</h5>';

	if ( $atts['title_priority'] !== 'title_subtitle' ) {
		$output['global'] = '<div class="%4$s"><div class="title-box_content">%2$s<div class="icon-title-wrap">%3$s<div><h2 class="title-box_title">%1$s</h2></div></div></div></div>';
	}

	return $output;
}

// New icon format
add_filter( 'cherry_shortcodes_output', 'monstroid_posts_shortcode', 11, 3 );
function monstroid_posts_shortcode( $output, $atts, $shortcode_tag ) {
	if ( 'icon' == $shortcode_tag ) {

		$border = '';
		$borderClass = '';
		$borderStyle = '';
		$borderWidth = '';
		$backgroundClass = '';
		$backgroundStyle = '';
		$widthHeightStyle = '';
		$miniClass = '';
		$decorations = '';

		if( $atts['border'] ) {
			preg_match('/^\d{1,3}/', $atts['border'], $borderWidth);

			if ( isset( $borderWidth[0] ) && $borderWidth[0] != 0 ){
				$borderClass = 'with-border';
				$borderStyle = 'border: '.$atts['border'].'; ';

				$border = $borderWidth[0];
			}
		}

		if( $atts['background'] ) {
			$backgroundClass = 'with-background';
			$backgroundStyle = 'background-color:'.$atts['background'].'; ';
		}

		if ($atts['size'] < 30) {
			$miniClass = 'mini';
		}

		if( ($borderClass != '') || ($backgroundClass != '') ) {
			$multiple = 2.55;

			if ($atts['size'] < 30) {
				$multiple = 2.95;
			}

			$decorations = 'decor';

			$factor = round($atts['size'] * $multiple) + $border;
			$widthHeightStyle = 'width: '.$factor.'px; height: '.$factor.'px; line-height: '.$factor.'px; ';
		}

		$output = '<span style="'.$widthHeightStyle.$backgroundStyle.$borderStyle.'" class="box-icon-wrap '.$atts['type'].' '.$borderClass.' '.$backgroundClass.'">'.$output.'</span>';

		if ($atts['align'] !== 'none') {
			$output = sprintf( '<div class="icon-align %1$s %2$s %3$s">%4$s</div>', $atts['align'], $miniClass, $decorations, $output );
		}
	}

	return $output;
}

// Add js support on some templates
add_filter( 'cherry_shortcodes_output', 'monstroid_posts_shortcode_addons', 11, 3 );
function monstroid_posts_shortcode_addons( $output, $atts, $shortcode_tag ) {
	if ( 'posts' == $shortcode_tag ) {
		if ( ! empty( $atts['template'] ) && ( 'default.tmpl' != $atts['template'] ) ) {
			wp_enqueue_script( 'cherry-shortcodes-init' );
			wp_enqueue_script( 'monstroid-tmpl-posts-scripts', CHILD_URI . '/assets/js/min/tmpl-posts-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
		}
	}
	if ( 'banner' == $shortcode_tag ) {
		if ( ! empty( $atts['template'] ) && ( 'default.tmpl' != $atts['template'] ) ) {
			wp_enqueue_script( 'monstroid-tmpl-banner-scripts', CHILD_URI . '/assets/js/min/tmpl-banner-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
		}
	}
	return $output;
}

add_filter( 'cherry_team_html', 'monstroid_team_shortcode_addons', 11, 3 );
function monstroid_team_shortcode_addons( $output, $atts ) {
	wp_enqueue_script( 'monstroid-tmpl-team-scripts', CHILD_URI . '/assets/js/min/tmpl-team-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
	return $output;
}

add_filter( 'cherry_grid_shortcode_data_callbacks', 'monstroid_grid_shortcode_addons', 11, 3 );
function monstroid_grid_shortcode_addons( $output, $atts ) {
	wp_enqueue_script( 'monstroid-tmpl-grid-testi-scripts', CHILD_URI . '/assets/js/min/tmpl-grid-testi-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );

	return $output;
}

add_filter( 'cherry_services_html', 'monstroid_services_shortcode_addons', 11, 3 );
function monstroid_services_shortcode_addons( $output, $atts ) {
	wp_enqueue_script( 'monstroid-tmpl-services-scripts', CHILD_URI . '/assets/js/min/tmpl-services-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );

	return $output;
}

add_filter( 'cherry_testimonials_html', 'monstroid_testi_shortcode_addons', 11, 3 );
function monstroid_testi_shortcode_addons( $output, $atts ) {
	wp_enqueue_script( 'monstroid-tmpl-testi-scripts', CHILD_URI . '/assets/js/min/tmpl-testi-scripts.min.js', array( 'jquery' ), MOSTROID_VERSION, true );

	return $output;
}

add_filter( 'cherry_portfolio_html', 'monstroid_portfolio_shortcode_addons', 11, 3 );
function monstroid_portfolio_shortcode_addons( $output, $posts_query, $options ) {
	wp_register_script( 'monstroid-circle-thumbnails', CHILD_URI . '/assets/js/min/circle-thumbnails.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
	wp_enqueue_script( 'monstroid-circle-thumbnails' );

	return $output;
}

add_filter( 'cherry_shortcodes_output', 'monstroid_blog_shortcodes_addons', 11, 3 );
function monstroid_blog_shortcodes_addons( $output, $atts, $shortcode_tag ) {
	if ( 'blog' == $shortcode_tag ) {
		wp_enqueue_script( 'monstroid-equal-height', CHILD_URI . '/assets/js/min/equal_height.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
	}

	return $output;
}

add_filter( 'wpcf7_form_elements', 'monstroid_contact_form_load', 11, 3 );
function monstroid_contact_form_load( $shortcode ) {
	if ( function_exists( 'wpcf7_enqueue_scripts' ) ) {
		wp_enqueue_script( 'fancyform', CHILD_URI . '/assets/js/min/jquery.fancyform.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
	}
	if ( function_exists( 'wpcf7_enqueue_styles' ) ) {
		wp_enqueue_style( 'monstroid-wpcf7', CHILD_URI . '/assets/css/wpcf7.css', array(), MOSTROID_VERSION );
	}
	return $shortcode;
}

// Change contact form7 loader
add_filter('wpcf7_ajax_loader', 'mostroid_wpcf7_ajax_loader');
function mostroid_wpcf7_ajax_loader () {
	return CHILD_URI . '/assets/images/loading-spin.svg';
}

// Add class on default tinyMCE ul lists
add_filter( 'wp_insert_post_data', 'monstroid_add_ul_class_on_insert' );
function monstroid_add_ul_class_on_insert( $postarr ) {
	$postarr['post_content'] = str_replace('<ul>', '<ul class="default-lists">', $postarr['post_content'] );

	return $postarr;
}

// Hide megamenu sidebar from sidebar manager lists
add_filter( 'cherry_all_sidebars_list', 'monstroid_hide_megamenu_sidebar' );
function monstroid_hide_megamenu_sidebar( $sidebars ) {
	unset($sidebars['cherry-mega-menu']);
	return $sidebars;
}

// Add new args to icons
add_filter('shortcode_atts_cherry_follow', 'monstroid_new_social_follow_attributes', 12, 3);
function monstroid_new_social_follow_attributes($out, $pairs, $atts) {
	$out['style'] = '';

	if (isset($atts['style']) && $atts['style'] === 'only-logos') {
		$out['custom_class'] .= ' only-logos ';
	}

	return $out;
}
add_filter('shortcode_atts_cherry_sharing', 'monstroid_new_social_sharing_attributes', 12, 3);
function monstroid_new_social_sharing_attributes($out, $pairs, $atts) {
	$out['style'] = '';

	if (isset($atts['style']) && $atts['style'] === 'only-logos') {
		$out['custom_class'] .= ' only-logos ';
	}

	return $out;
}
add_filter('cherry_social_get_follows_item_format', 'monstroid_follow_skype_link_support', 12, 3);
function monstroid_follow_skype_link_support($format, $item_class, $url) {

	if ($item_class == 'skype-item') {
		$url = str_replace('http://', '', $url);
		$format = '<li class="cherry-follow_item %1$s"><a class="cherry-follow_link" href="callto:'.$url.'" target="_blank" rel="nofollow" title="%3$s">%4$s<span class="cherry-follow_label">%3$s</span></a></li>';
	}
	return $format;
}
