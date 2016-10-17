<?php
/**
 * Flat skin functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.1.1
 */

// Enqueue flat skin js script
add_action( 'wp_enqueue_scripts', 'monstroid_flat_scripts', 11 );
function monstroid_flat_scripts() {
	wp_enqueue_script( 'flat-skin-scripts', CHILD_URI . '/assets/js/min/flat-script.min.js', array( 'jquery' ), MOSTROID_VERSION, true );
	wp_enqueue_style( 'flat-skin-styles', CHILD_URI . '/assets/css/masks.css', array(), MOSTROID_VERSION );
}

// Check if row has top/bottom paddings classes
add_filter('shortcode_atts_row', 'monstroid_row_paddings_correction', 11, 3);
function monstroid_row_paddings_correction($out, $pairs, $atts) {
	if ( isset( $atts['mp_style_classes'] ) ) {
		$out['mp_style_classes'] = $atts['mp_style_classes'];
		$padding_classes = '';

		preg_match_all('/[a-z]+[-]+[a-z]+/', $atts['mp_style_classes'], $padding_classes);

		foreach ($padding_classes as $key => $value) {
			$paddings = implode(' ', $value);
			$paddings = str_replace('padding-', '', $paddings);

			if ( ( strpos($paddings, 'top') !== false ) && ( strpos($paddings, 'bottom') !== false ) ) {} 
			elseif ( ( strpos($paddings, 'top') !== false ) && ( strpos($paddings, 'bottom') == false ) ) {
				$out['mp_style_classes'] .= ' only-top-padding ';
			} elseif ( ( strpos($paddings, 'top') == false ) && ( strpos($paddings, 'bottom') !== false ) ) {
				$out['mp_style_classes'] .= ' only-bottom-padding ';
			}
		}
	}
	return $out;
}

// Svg vars & display scripts
add_filter( 'cherry_shortcode_box_format', 'monstroid_flat_skin_functionality_boxes', 11, 2 );
function monstroid_flat_skin_functionality_boxes( $output, $atts ) {

	$coordinates = '';
	$colors = '';
	$svg = '';
	$height = '';

	$bodyBackground = cherry_get_option('body-background');
	if (isset($bodyBackground)) {
		$bodyBackground = cherry_get_option('body-background');
		$bodyBackground = $bodyBackground['color'];
	}

	// Preset variables
	switch($atts['preset']) {
		case 'gray':
			$colors = '#eeeeee';
			$coordinates = array(
				array( 'top' =>	 
					array(
						array(
							'0,0',
							'39,0',
							'0,100',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'39,0',
							'100,0',
							'100,63',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array( 'height' => 140 )
				),
				array( 'bottom' =>
					array( 
						array(
							'0,100',
							'0,75',
							'42,100',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						),
						array(
							'100,100',
							'74,100',
							'100,0',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						)
					), array( 'height' => 185 )
				),
			);
		break;

		case 'info':
			$colors = '#000000';
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'0,0',
							'66,0',
							'40,40',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						),
						array(
							'66,0',
							'100,0',
							'100,100',
							'bg' => $colors,
							'opacity' => 5,
							'dependColor' => false
						)
					), array( 'height' => 175 )
				),
				array( 'bottom' =>
					array(
						array(
							'0,0',
							'0,100',
							'24,100',
							'bg' => $colors,
							'opacity' => 5,
							'dependColor' => false
						)
					), array( 'height' => 170 )
				),
			);
		break;

		case 'warning':
			$colors = array( '#fbb44c', '#2abb9b' );
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'0,0',
							'49,0',
							'0,53',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						),
						array(
							'47,0',
							'100,0',
							'100,100',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array( 'height' => 160 )
				),
				array( 'bottom' =>
					array(
						array(
							'0,82',
							'0,100',
							'16,100',
							'bg' => $colors[0],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'60,100',
							'100,100',
							'100,0',
							'bg' => $colors[1],
							'opacity' => 100,
							'dependColor' => false
						)
					), array( 'height' => 760 )
				),
			);
		break;

		case 'danger':
			$colors = '#fbb44c';
			$coordinates = array(
				array( 'top' =>	 
					array(
						array(
							'0,0',
							'39,0',
							'0,100',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'39,0',
							'100,0',
							'100,63',
							'bg' => $bodyBackground,
							'opacity' => 45,
							'dependColor' => true
						)
					), array( 'height' => 110 )
				),
				array( 'bottom' =>
					array( 
						array(
							'0,100',
							'0,75',
							'42,100',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						),
						array(
							'100,100',
							'74,100',
							'100,0',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						)
					), array( 'height' => 125 )
				),
			);
		break;

		case 'success':
			$colors = '#fc797a';
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'0,0',
							'70,0',
							'34,51',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						),
						array(
							'70,0',
							'100,0',
							'100,100',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						)
					), array( 'height' => 175 )
				),
				array( 'bottom' =>
					array(
						array(
							'0,0',
							'0,100',
							'18,100',
							'bg' => $colors,
							'opacity' => 100,
							'dependColor' => false
						)
					), array( 'height' => 170 )
				),
			);
		break;

		case 'polygon-1':
			$colors = array('#fbb44c', '#2abb9b');
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'0,0',
							'39,0',
							'0,100',
							'bg' => $colors[0],
							'opacity' => 60,
							'dependColor' => false
						),
						array(
							'0,0',
							'100,0',
							'40,80',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 75)
				),
				array( 'bottom' =>
					array(
						array(
							'100,100',
							'34,100',
							'100,0',
							'bg' => $colors[1],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'0,100',
							'100,100',
							'34,10',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 70)
				),
			);
		break;

		case 'polygon-2':
			$colors = array('#2abb9b', '#fc797a');
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'0,0',
							'39,0',
							'0,100',
							'bg' => $colors[0],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'30,0',
							'100,0',
							'80,36',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 165)
				),
				array( 'bottom' =>
					array(
						array(
							'100,100',
							'88,100',
							'100,0',
							'bg' => $colors[1],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'0,100',
							'100,100',
							'100,78',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 275)
				),
			);
		break;

		case 'polygon-3':
			$colors = array('#2abb9b', '#fc797a');
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'100,0',
							'82,0',
							'100,80',
							'bg' => $colors[0],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'0,0',
							'82,0',
							'0,100',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 70)
				),
				array( 'bottom' =>
					array(
						array(
							'100,100',
							'30,100',
							'100,0',
							'bg' => $colors[1],
							'opacity' => 70,
							'dependColor' => false
						),
						array(
							'0,100',
							'30,100',
							'0,78',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 120)
				),
			);
		break;

		case 'polygon-4':
			$colors = array('#2abb9b', '#fc797a');
			$coordinates = array(
				array( 'top' => 
					array(
						array(
							'100,0',
							'82,0',
							'100,80',
							'bg' => $colors[0],
							'opacity' => 100,
							'dependColor' => false
						),
						array(
							'0,0',
							'82,0',
							'0,100',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 70)
				),
				array( 'bottom' =>
					array(
						array(
							'100,100',
							'30,100',
							'100,0',
							'bg' => $colors[1],
							'opacity' => 70,
							'dependColor' => false
						),
						array(
							'0,100',
							'30,100',
							'0,78',
							'bg' => $bodyBackground,
							'opacity' => 100,
							'dependColor' => true
						)
					), array('height' => 120)
				),
			);
		break;
	}

	if($coordinates !== '') {
		$svg = '<div class="masks">';
			for ( $i = 0; $i < count($coordinates); $i++) { 
				$align = key($coordinates[$i]);

				if($coordinates[$i][0]['height']) {
					$height = 'height="'.$coordinates[$i][0]['height'].'"';
					unset($coordinates[$i][0]['height']);
				}				

				$svg .= '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svgmask '.$align.'" '.$height.' viewBox="0 0 100 100" preserveAspectRatio="none">';
					foreach ($coordinates[$i] as $key => $value) {

						for ( $j = 0; $j < count($value); $j++) {
							$dependColor = ($value[$j]['dependColor'] == true) ? 'depend' : '';

							$svg .= '<polygon class="triangle '.$dependColor.'" fill="'.$value[$j]['bg'].'" opacity="'.($value[$j]['opacity'] / 100).'" points="';

							unset($value[$j]['bg']);
							unset($value[$j]['opacity']);
							unset($value[$j]['dependColor']);

							for( $k = 0; $k < count($value[$j]); $k++ ) {
								$svg .= $value[$j][$k].' ';
							}

							$svg .= '"/>';
						}
					}

				$svg .= '</svg>';
			}
		$svg .= '</div>';

		$output = '<div class="%s row-svg"><div class="%s">%s'.$svg.'</div></div>';
	}

	return $output;
}

// Check if row has top/bottom paddings classes
add_filter('shortcode_atts_parallax_image', 'monstroid_parallax_svg_class', 11, 3);
function monstroid_parallax_svg_class($out, $pairs, $atts) {
	$out['custom_class'] .= ' parallax-svg ';

	if ( isset( $atts['mp_style_classes'] ) ) {
		if ( !isset($out['custom_class']) ) {
			$out['custom_class'] .= $atts['custom_class'];
		}
		$padding_classes = '';

		preg_match_all('/[a-z]+[-]+[a-z]+/', $atts['mp_style_classes'], $padding_classes);

		foreach ($padding_classes as $key => $value) {
			$paddings = implode(' ', $value);
			$paddings = str_replace('padding-', '', $paddings);

			if ( ( strpos($paddings, 'top') !== false ) && ( strpos($paddings, 'bottom') !== false ) ) {} 
			elseif ( ( strpos($paddings, 'top') !== false ) && ( strpos($paddings, 'bottom') == false ) ) {
				$out['custom_class'] .= ' only-top-padding ';
			} elseif ( ( strpos($paddings, 'top') == false ) && ( strpos($paddings, 'bottom') !== false ) ) {
				$out['custom_class'] .= ' only-bottom-padding ';
			}
		}
	}

	return $out;
}

// Svg vars & display scripts
add_filter( 'cherry_shortcodes_output', 'monstroid_flat_skin_functionality_parallaxes', 11, 3 );
function monstroid_flat_skin_functionality_parallaxes( $output, $atts, $shortcode ) {
	if ( 'parallax_image' !== $shortcode ) {
		return $output;
	}
	
	$bodyBackground = cherry_get_option('body-background');
	if (isset($bodyBackground)) {
		$bodyBackground = cherry_get_option('body-background');
		$bodyBackground = $bodyBackground['color'];
	}

	$counter = count_parallaxes();


	if ($counter % 2) { // Check for even
		$height = '';
		$colors = array( '#fc797a', '#3a98d8', '#000000' );
		$coordinates = array(
			array( 'top' => 
				array(
					array(
						'100,0',
						'55,0',
						'100,100',
						'bg' => $colors[0],
						'opacity' => 100,
						'dependColor' => false
					),
					array(
						'0,0',
						'100,0',
						'45,26',
						'bg' => $bodyBackground,
						'opacity' => 100,
						'dependColor' => true
					),
				), array( 'height' => 186 )
			),
			array( 'bottom' =>
				array(
					array(
						'0,100',
						'45,77',
						'67,100',
						'bg' => $colors[1],
						'opacity' => 85,
						'dependColor' => true
					),
					array(
						'47,100',
						'100,0',
						'100,100',
						'bg' => $colors[2],
						'opacity' => 20,
						'dependColor' => false
					), 
				), array( 'height' => 455 )
			),
		);	
	} else { // Odd
		$height = '';
		$colors = array( '#3a98d8' );
		$coordinates = array(
			array( 'top' => 
				array(
					array(
						'100,0',
						'100,100',
						'47,0',
						'bg' => $bodyBackground,
						'opacity' => 100,
						'dependColor' => true
					),
				), array( 'height' => 97 )
			),
			array( 'bottom' =>
				array(
					array(
						'0,100',
						'40,61',
						'63,100',
						'bg' => $bodyBackground,
						'opacity' => 100,
						'dependColor' => true
					),
					array(
						'63,100',
						'100,0',
						'100,100',
						'bg' => $colors[0],
						'opacity' => 100,
						'dependColor' => false
					),
				), array( 'height' => 173 )
			),
		);
	}

	$svg = '<div class="masks">';

		for ( $i = 0; $i < count($coordinates); $i++) { 
			$align = key($coordinates[$i]);

			if($coordinates[$i][0]['height']) {
				$height = 'height="'.$coordinates[$i][0]['height'].'"';
				unset($coordinates[$i][0]['height']);
			}				

			$svg .= '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svgmask '.$align.'" '.$height.' viewBox="0 0 100 100" preserveAspectRatio="none">';
				foreach ($coordinates[$i] as $key => $value) {

					for ( $j = 0; $j < count($value); $j++) {
						$dependColor = ($value[$j]['dependColor'] == true) ? 'depend' : '';

						$svg .= '<polygon class="triangle '.$dependColor.'" fill="'.$value[$j]['bg'].'" opacity="'.($value[$j]['opacity'] / 100).'" points="';

						unset($value[$j]['bg']);
						unset($value[$j]['opacity']);
						unset($value[$j]['dependColor']);

						for( $k = 0; $k < count($value[$j]); $k++ ) {
							$svg .= $value[$j][$k].' ';
						}

						$svg .= '"/>';
					}
				}

			$svg .= '</svg>';
		}

	$svg .= '</div>';

	$search  = '<div class="parallax-bg"';
	$replace = $svg . $search;

	$_output = str_replace( $search, $replace, $output );

	return $_output;
}

function count_parallaxes() {
	static $counter = 0;
	++$counter;
	return $counter;
}
