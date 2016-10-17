<?php
/**
 * Content Grid Layout type template
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

global $post;

$post_id = $post->ID;
$format = get_post_format( $post_id );

if ( ! $format ) {
	$format = 'standard';
}

switch ( $parsed_options['grid_column'] ) {
	case 'grid-2':
		$columns = 2;
		break;
	case 'grid-3':
		$columns = 3;
		break;
	case 'grid-4':
		$columns = 4;
		break;
	case 'grid-6':
		$columns = 6;
		break;
}

if( $post_counter === $columns ){
	?></div><?php
	$post_counter = 0;
}
if( $post_counter === 0 ){
	?><div class="row"><?php
}

$post_counter++;
$post_format = $format . '-post-format';
?><article class="<?php echo Cherry_Blog_Layouts_Tools::item_class( 'grid-layout-item', $parsed_options['grid_column'] );?> <?php echo $post_format ?>"><?php
	$name = apply_filters( 'cherry_blog_layout_template_name', $format, 'grid' );

	$prefix = ( !empty( $parsed_options['template_type'] ) ) ? '-'.$parsed_options['template_type'] : '';

	Cherry_Blog_Template_Loader::get_tmpl( 'layout-grid'.$prefix, $name );
?></article>
