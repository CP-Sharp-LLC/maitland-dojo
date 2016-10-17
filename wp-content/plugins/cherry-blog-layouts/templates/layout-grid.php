<?php
/**
 * Grid Layout type template
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

?>
<div class="<?php echo apply_filters( 'cherry_blog_layout_wrapper_class', 'grid-layout', 'grid' ); ?>" <?php echo Cherry_Blog_Layouts_Tools::wrapper_attrs() ?>>
	<?php
	Cherry_Blog_Layouts::enqueue_scripts();
	$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();
	echo Cherry_Blog_Layouts_Data::filter_render( $parsed_options['filter_type'] ); ?>

	<?php
		$post_counter = 0;
		$columns = Cherry_Blog_Layouts::get_option( 'blog-layout-columns', 3 );
		while ( have_posts() ) : the_post();
			$template_file = Cherry_Blog_Template_Loader::get_template( 'layout-grid', 'content' );
			include $template_file;
		endwhile;
	?>
</div>
<?php
	$args = array(
		'prev_text'	=> ( isset( $parsed_options['pagination_previous_label'] ) ) ? $parsed_options['pagination_previous_label'] : '&laquo;',
		'next_text'	=> ( isset( $parsed_options['pagination_next_label'] ) ) ? $parsed_options['pagination_next_label'] : '&raquo;',
	);
	the_posts_pagination( $args );
?>