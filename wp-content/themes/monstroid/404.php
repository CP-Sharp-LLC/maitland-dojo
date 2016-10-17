<?php
/**
 * The template for displaying 404 pages (not found).
 *
 */
?>

<!-- 404 page view -->
<section class="error-404 not-found color-link">

	<?php $content_404 = cherry_get_option( 'content-404' );

	if ( empty( $content_404 ) || ! has_shortcode( $content_404, 'cherry_col' ) ) { ?>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-2">
				<img src="<?php echo CHILD_URI . '/assets/images/404.jpg'; ?>" alt="">
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h1><?php _e( 'Sorry', 'monstroid' ); ?></h1>
				<h2><?php _e( "It's not you. It's us.", 'monstroid' ); ?></h2>
				<p><?php _e( "The page you are looking for can't be found.", 'monstroid' ); ?></p>
				<a class="cherry-btn cherry-btn-danger cherry-btn-large cherry-btn-inline cherry-btn-fade" target="_self" href="<?php echo esc_url( home_url('/') ); ?>" data-text="<?php esc_html_e( 'Go Home!', 'monstroid' ); ?>"><?php _e( 'Go Home!', 'monstroid' ); ?></a>
			</div>
		</div>

	<?php } else {
		echo apply_filters( 'the_content', $content_404 );
	} ?>

</section>