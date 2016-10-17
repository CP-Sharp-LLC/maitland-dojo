<?php
/**
 * Single Product Image
 *
 * @author 		Cherry Team
 * @package 	Cherry Woocommerce Package/Templates
 * @version     2.0.14
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $post, $woocommerce, $product;

?>
<div class="product-images">
	<?php
		$thumbnails  = $product->get_gallery_attachment_ids();
		if ( has_post_thumbnail() ) {
			$thumbnails = array_merge( array( get_post_thumbnail_id() ), $thumbnails );
		}
		$thumb_count = count( $thumbnails );
		$thumb_class = '';
		$controls    = '';
		if ( $thumb_count > 0 ) {
	?>
		<div class="product-large-image">
		<?php
			if ( has_post_thumbnail() ) {

				$product_title  = get_the_title( $product->id );
				$image_link  	= wp_get_attachment_url( get_post_thumbnail_id() );
				$thumb_link     = wp_get_attachment_image_src( get_post_thumbnail_id(), 'shop_single' );
				$thumb_link     = $thumb_link[0];
				$product_url 	= get_permalink( $post->id );
				$image       	= get_the_post_thumbnail( $post->ID, 'shop_single', array(
					'itemprop'        => 'image',
					'data-zoom-image' => $image_link,
					'title'           => $product_title,
					'alt'             => $product_title
					) );

				if(is_single()) {
					printf(
						'<a href="%1$s" data-initial-thumb="%2$s" data-initial-thumb-large="%1$s">%3$s</a>',
						esc_url( $image_link ), $thumb_link, $image, $product_url
					);
				} else {
					printf(
						'<a href="%1$s" data-initial-thumb="%2$s" data-initial-thumb-large="%1$s">%3$s</a>',
						esc_url( $image_link ), $thumb_link, $image
					);
				}
			} else {
				echo apply_filters( 'woocommerce_single_product_image_html', sprintf( '<img src="%s" alt="%s" />', wc_placeholder_img_src(), __( 'Placeholder', 'monstroid' ) ), $post->ID );

			}
		?>
		</div>

		<script type="text/javascript">
			jQuery(document).ready(function() {
				jQuery('.product-thumbnails_list').magnificPopup({
					delegate: 'a',
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						preload: [0,1] // Will preload 0 - before current, and 1 after the current image
					},
					closeBtnInside: false,
					type: 'image' 
				});
				jQuery('.product-large-image > a').magnificPopup({
					type: 'image',
					closeOnContentClick: true,
					closeBtnInside: false
				})
			});
		</script>

		<div class="product-thumbnails">
			<ul class="product-thumbnails_list<?php echo $thumb_class; ?>" data-allow-wrap=false>
				<?php
				foreach ( $thumbnails as $thumb_id ) {
					$image_link = wp_get_attachment_url( $thumb_id );
					if ( ! $image_link ) {
						continue;
					}
					$product_title  = get_the_title( $product->id );
					$image_large = wp_get_attachment_image_src( $thumb_id, 'shop_single' );
					$image = wp_get_attachment_image( $thumb_id, 'shop_thumbnail' );

					echo '<li class="product-thumbnails_item" data-original-img="' . esc_url( $image_link ) . '" data-large-img="' . esc_url( $image_large[0] ) . '"><a alt="'.$product_title.'" href="'.esc_url($image_link).'" target="_blank">' . $image . '</a></li>';
				}
				/*if ($thumb_count < 5) {
					cherry_woocommerce_get_missed_thumb($thumb_count);
				}*/
				?>
			</ul>
			<div class="clear"></div>
			<?php echo $controls; ?>
		</div>

	<?php } else {
		//cherry_woocommerce_placeholder();
	} ?>
</div>