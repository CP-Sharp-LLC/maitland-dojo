<?php
/**
 * contentTimeline Layout type template
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}
global $post;

$post_id = $post->ID;
$format  = get_post_format( $post_id );
$date_format = $parsed_options['timeline_breakpoint_date_format'];

if ( ! $format ) {
	$format = 'standard';
}

switch ( $parsed_options['timeline_breakpoint'] ) {
	case 'year':
		$current_date = get_the_date('Y');
		$date_format = 'Y';
		break;
	case 'month':
		$current_date = get_the_date('F Y');
		break;
	case 'day':
		$current_date = get_the_date('d F Y');
		break;
}
$current_date_format = get_the_date( $date_format );

if ( 'true' === $parsed_options['use_timeline_breakpoint'] ) {
	if( !$break_point_date ){?>
		<div class="timeline-breakpiont"><?php echo $current_date_format ?></div><section class="timeline-group">
		<?php $break_point_date = $current_date;
	} elseif ( strtotime( $break_point_date ) > strtotime( $current_date ) ) {
		?><div class="clear"></div></section><div class="timeline-breakpiont"><?php echo $current_date_format ?></div><section class="timeline-group"><?php
		$break_point_date = $current_date;
		$post_counter = 0;
	}
}

( $post_counter % 2 == 0 ) ? $even = ' odd' : $even = ' even';

$break_index = apply_filters( 'cherry_blog_layout_timeline_break_index', 5 );

$item_index_class = ' item-'.$index_counter;
?> <article class="<?php echo apply_filters( 'cherry_blog_layout_item_class', 'timeline-layout-item', 'masonry' ); echo $even; echo $item_index_class;?>">
	<div class="inner">
<?php

$marker_date = ( 'true' === $parsed_options['show_marker_date'] ) ? get_the_date( $parsed_options['timeline_marker_date_format'] ) : '' ;

echo apply_filters( 'cherry_blog_layout_timeline_marker', '<div class="marker"><span>' . $marker_date . '</span></div>', 1 );
echo apply_filters( 'cherry_blog_layout_timeline_arrow', '<div class="arrow"><span></span></div>' );

$name = apply_filters( 'cherry_blog_layout_template_name', $format, 'timeline' );


$prefix = ( !empty( $parsed_options['template_type'] ) ) ? '-'.$parsed_options['template_type'] : '';
Cherry_Blog_Template_Loader::get_tmpl( 'layout-timeline'.$prefix, $name );

?> </div></article> <?php

$post_counter++;
( $index_counter == $break_index ) ? $index_counter = 0 : $index_counter++ ;