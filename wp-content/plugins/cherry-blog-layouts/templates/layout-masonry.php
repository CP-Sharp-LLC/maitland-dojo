<?php
/**
 * Grid Layout type template
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

?>
<div class="<?php echo apply_filters( 'cherry_blog_layout_wrapper_class', 'masonry-layout', 'masonry' ); ?>"<?php echo Cherry_Blog_Layouts_Tools::wrapper_attrs() ?>>
	<?php
	Cherry_Blog_Layouts::enqueue_scripts();
	$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();
	echo Cherry_Blog_Layouts_Data::filter_render( $parsed_options['filter_type'] ); ?>
	<div class="masonry-wrapper">
		<?php
			while ( have_posts() ) : the_post();
				$template_file = Cherry_Blog_Template_Loader::get_template( 'layout-masonry', 'content' );
				include $template_file;
			endwhile;
		?>
	</div>
</div>
<?php
	$args = array(
		'prev_text'	=> ( isset( $parsed_options['pagination_previous_label'] ) ) ? $parsed_options['pagination_previous_label'] : '&laquo;',
		'next_text'	=> ( isset( $parsed_options['pagination_next_label'] ) ) ? $parsed_options['pagination_next_label'] : '&raquo;',
	);
	the_posts_pagination( $args );
?>