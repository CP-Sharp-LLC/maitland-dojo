<?php
/**
 * Cherry Slider.
 *
 * @package   Cherry_Slider
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for Slider data.
 *
 * @since 1.0.0
 */
class Cherry_Slider_Data {

	/**
	 * The array of arguments for query.
	 *
	 * @since 1.0.0
	 * @var   array
	 */
	private $query_args = array();

	/**
	 * Result query posts.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	private $posts_query = '';

	/**
	 * Sets up our actions/filters.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		/**
		 * Fires when you need to display slider.
		 *
		 * @since 1.0.0
		 */
		add_action( 'cherry_get_slider', array( $this, 'the_slider' ) );
	}

	/**
	 * Display or return HTML-formatted slider items.
	 *
	 * @since  1.0.0
	 * @param  string|array $options     Default options.
	 * @param  string|array $query_args  Query arguments.
	 * @return string
	 */
	public function the_slider( $options = '', $query_args = '' ) {
		/**
		 * Filter the array of default options.
		 *
		 * @since 1.0.0
		 * @param array options.
		 * @param array The 'the_slider_items' function argument.
		 */
		$default_options = apply_filters( 'cherry_the_slider_default_options', Slider_Options::$options );

		// default options marge
		$options = wp_parse_args( $options, $default_options );

		$html = '';

		// The Query.
		$posts_query = $this->get_query_slider_items( $options );

		if ( ! is_wp_error( $posts_query ) ) {
			$uniq_id = 'slider-pro-'.uniqid();
			$slider_html_attr = 'data-id="' . $uniq_id . '"';
			$slider_html_attr .= 'data-width="' . $options['slider_width'] . '"';
			$slider_html_attr .= 'data-height="' . $options['slider_height'] . '"';
			$slider_html_attr .= 'data-992-breakpoint-height="' . $options['slider_992_breakpoint_height'] . '"';
			$slider_html_attr .= 'data-768-breakpoint-height="' . $options['slider_768_breakpoint_height'] . '"';
			$slider_html_attr .= 'data-visible-size="' . $options['slider_visible_size'] . '"';
			$slider_html_attr .= 'data-force-size="' . $options['slider_force_size'] . '"';
			$slider_html_attr .= 'data-orientation="' . $options['slider_orientation'] . '"';
			$slider_html_attr .= 'data-slide-distance="' . $options['slider_slide_distance'] . '"';
			$slider_html_attr .= 'data-slide-duration="' . $options['slider_slide_duration'] . '"';
			$slider_html_attr .= 'data-slide-fade="' . $options['slider_slide_fade'] . '"';
			$slider_html_attr .= 'data-navigation="' . $options['slider_navigation'] . '"';
			$slider_html_attr .= 'data-fade-navigation="' . $options['slider_fade_navigation'] . '"';
			$slider_html_attr .= 'data-pagination="' . $options['slider_pagination'] . '"';
			$slider_html_attr .= 'data-autoplay="' . $options['slider_autoplay'] . '"';
			$slider_html_attr .= 'data-fullScreen="' . $options['slider_fullScreen'] . '"';
			$slider_html_attr .= 'data-shuffle="' . $options['slider_shuffle'] . '"';
			$slider_html_attr .= 'data-loop="' . $options['slider_loop'] . '"';
			$slider_html_attr .= 'data-thumbnails-arrows="' . $options['slider_thumbnails_arrows'] . '"';
			$slider_html_attr .= 'data-thumbnails-position="' . $options['slider_thumbnails_position'] . '"';
			$slider_html_attr .= 'data-thumbnails-width="' . $options['slider_thumbnails_width'] . '"';
			$slider_html_attr .= 'data-thumbnails-height="' . $options['slider_thumbnails_height'] . '"';
			$slider_html_attr .= 'data-reach-video-action="' . $options['slider_reach_video_action'] . '"';

			$html .= '<div class="slider-container" ' . $slider_html_attr . '>';
				$html .= '<div id="' . $uniq_id . '" class="slider-pro">';
					$html .= '<div class="sp-slides">';
						$html .= $this->get_slider_loop( $posts_query );
					$html .= '</div>';
					if ( 'true' == $options['slider_thumbnails'] ) {
						$html .= '<div class="sp-thumbnails">';
							$html .= $this->get_slider_thumbnails( $posts_query );
						$html .= '</div>';
					}
				$html .= '</div>';
			$html .= '</div>';

			wp_enqueue_script( 'cherry-slider-script' );
		}

		return $html;
	}

	/**
	 * Get slider items.
	 *
	 * @since  1.0.0
	 * @param  array|string $query_args Arguments to be passed to the query.
	 * @return array|bool         Array if true, boolean if false.
	 */
	public function get_query_slider_items( $query_args = '' ) {
		$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1 ;

		$slider_name = $query_args['cherry_slider_sliders'];

		$tax_query_args = '';
		if ( ! empty( $slider_name ) ) {

			$defaults_tax_query_args = apply_filters( 'cherry_the_slider_default_tax_query_args', array(
				'taxonomy' => CHERRY_SLIDER_NAME . '_sliders',
				'field'    => 'slug',
				'terms'    => '',
			) );

			$tax_query_args = wp_parse_args( array( 'terms' => $slider_name ) , $defaults_tax_query_args );

		}

		$defaults_query_args = apply_filters( 'cherry_the_slider_default_query_args', array(
			'post_type'      => CHERRY_SLIDER_NAME,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'posts_per_page' => -1,
			'paged'          => $paged,
			'offset'         => 0,
			'tax_query'      => array( $tax_query_args ),
		) );

		$query_args = wp_parse_args( $query_args, $defaults_query_args );
		$query_args = array_intersect_key( $query_args, $defaults_query_args );

		// The Query.
		$posts_query = new WP_Query( $query_args );
		$this->posts_query = $posts_query;

		if ( ! is_wp_error( $posts_query ) ) {
			return $posts_query;
		} else {
			return false;
		}
	}

	/**
	 * Get thumbnails images list.
	 *
	 * @param  object $posts_query   Result post query.
	 * @return string $html
	 */
	public function get_slider_thumbnails( $posts_query ) {
		$html = '';

			if ( $posts_query->have_posts() ) {
				while ( $posts_query->have_posts() ) : $posts_query->the_post();
					$post_id = $posts_query->post->ID;
					$title = get_the_title( $post_id );
					$thumb_id = get_post_thumbnail_id();

					$placeholder_args = apply_filters( 'cherry_slider_placeholder_args',
						array(
							'width'			=> Slider_Options::$options['slider_thumbnails_width'],
							'height'		=> Slider_Options::$options['slider_thumbnails_height'],
							'background'	=> 'f62e46',
							'foreground'	=> 'fff',
							'title'			=> $title,
							'class'			=> Slider_Options::$options['image_class'],
						)
					);

					// Get img URL
					$img_url = wp_get_attachment_url( $thumb_id ,'full' );
					$image = $this->get_crop_image( $img_url, Slider_Options::$options['slider_thumbnails_width'], Slider_Options::$options['slider_thumbnails_height'], 'sp-thumbnail-image' );

					$html .= '<div class="sp-thumbnail">';
						$html .= '<div class="sp-thumbnail-image-container">';
							$html .= $image;
						$html .= '</div>';
					$html .= '</div>';

				endwhile;
			} else {
				echo '<h4>' . __( 'Slides not found', 'cherry-slider' ) . '</h4>';
			}

		// Reset the query.
		wp_reset_postdata();

		return $html;
	}

	/**
	 * Get slider items.
	 *
	 * @since  1.0.0
	 * @param  array $posts_query      List of WP_Post objects.
	 * @return string
	 */
	public function get_slider_loop( $posts_query ) {

		$html = '';

			if ( $posts_query->have_posts() ) {

				while ( $posts_query->have_posts() ) : $posts_query->the_post();
					$post_id    = $posts_query->post->ID;
					$post_meta  = get_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, true );
					$date       = get_the_date();
					$post_type  = get_post_type( $post_id );
					$permalink  = get_permalink();
					$title      = get_the_title( $post_id );
					$video_type = ( isset( $post_meta['slider-video-type'] ) ) ? $post_meta['slider-video-type'] : false ;
					$video_embed = ( isset( $post_meta['slider-embed-video-src'] ) ) ? $post_meta['slider-embed-video-src'] : false ;
					$video_mp4_id = ( isset( $post_meta['slider-mp4-video-id'] ) ) ? $post_meta['slider-mp4-video-id'] : false ;
					$video_ogv_id = ( isset( $post_meta['slider-ogv-video-id'] ) ) ? $post_meta['slider-ogv-video-id'] : false ;

					$content_width = ( isset( $post_meta['slider-standart-content-width'] ) ) ? $post_meta['slider-standart-content-width'] : '50%';
					$content_vertical = ( isset( $post_meta['slider-standart-content-vertical'] ) ) ? $post_meta['slider-standart-content-vertical'] : '40%';
					$content_position = ( isset( $post_meta['slider-standart-content-position'] ) ) ? $post_meta['slider-standart-content-position'] : 'topCenter';
					$content_show_transition = ( isset( $post_meta['slider-standart-content-show-transition'] ) ) ? $post_meta['slider-standart-content-show-transition'] : 'left';
					$content_show_duration = ( isset( $post_meta['slider-standart-content-show-duration'] ) ) ? $post_meta['slider-standart-content-show-duration'] : 500;
					$content_show_delay = ( isset( $post_meta['slider-standart-content-show-delay'] ) ) ? $post_meta['slider-standart-content-show-delay'] : 400;
					$content_hide_transition = ( isset( $post_meta['slider-standart-content-hide-transition'] ) ) ? $post_meta['slider-standart-content-hide-transition'] : 'left';
					$content_hide_duration = ( isset( $post_meta['slider-standart-content-hide-duration'] ) ) ? $post_meta['slider-standart-content-hide-duration'] : 500;
					$content_hide_delay = ( isset( $post_meta['slider-standart-content-hide-delay'] ) ) ? $post_meta['slider-standart-content-hide-delay'] : 200;
					$content_wrapper = ( isset( $post_meta['slider-standart-content-wrapper'] ) ) ? $post_meta['slider-standart-content-wrapper'] : 'true';

					$thumb_id = get_post_thumbnail_id();
					$format = get_post_format( $post_id );
					$format = ( empty( $format ) ) ? 'post-format-standart' : 'post-format-' . $format ;

					$placeholder_args = apply_filters( 'cherry_slider_placeholder_args',
						array(
							'width'			=> Slider_Options::$options['image_crop_width'],
							'height'		=> Slider_Options::$options['image_crop_height'],
							'background'	=> 'f62e46',
							'foreground'	=> 'fff',
							'title'			=> $title,
							'class'			=> Slider_Options::$options['image_class'],
						)
					);

					if ( 'true' === Slider_Options::$options['is_image_crop'] ) {

						// Get img URL
						$img_url = wp_get_attachment_url( $thumb_id ,'full' );
						$image = $this->get_crop_image( $img_url, Slider_Options::$options['image_crop_width'], Slider_Options::$options['image_crop_height'] );
					} else {
						$image = $this->get_image( $post_id, Slider_Options::$options['image_size'], $placeholder_args );
					}

					switch ( $format ) {
						case 'post-format-image':
							$html .= '<div class="sp-slide">';
								$html .= $image;
							$html .= '</div>';
							break;
						case 'post-format-video':
							switch ( $video_type ) {
								case 'slider-video-type-embed':
									$html .= '<div class="sp-slide">';
										$html .= '<div class="sp-layer">';
											$html .= '<a class="sp-video" href="' . $video_embed . '">';
												$html .= $image;
											$html .= '</a>';
										$html .= '</div>';
									$html .= '</div>';
									break;
								case 'slider-video-type-html5':
									$imageUrl = $this->get_image( $post_id, Slider_Options::$options['image_size'], $placeholder_args, true );
									$html .= '<div class="sp-slide">';
										$html .= '<video class="sp-video" data-fill-mode="fill" poster="' . $imageUrl . '" controls="controls" preload="none">';
											$html .= '<source src="' . wp_get_attachment_url( $video_mp4_id ) . '" type="video/mp4"/>';
											$html .= '<source src="' . wp_get_attachment_url( $video_ogv_id ) . '" type="video/ogg"/>';
										$html .= '</video>';
									$html .= '</div>';
									break;
							}
							break;
						default:
							$html .= '<div class="sp-slide">';
								$html .= $image;
								( 'true' == $content_wrapper ) ? $content_wrap_class = ' sp-black sp-padding' : $content_wrap_class = '' ;
								$title_content_attr = 'class="sp-layer' . $content_wrap_class . '"';
								$title_content_attr .= 'data-width="' . $content_width . '"';
								$title_content_attr .= 'data-position="' . $content_position . '"';
								$title_content_attr .= 'data-vertical="' . $content_vertical . '"';
								$title_content_attr .= 'data-show-transition="' . $content_show_transition . '"';
								$title_content_attr .= 'data-show-duration="' . $content_show_duration . '"';
								$title_content_attr .= 'data-show-delay="' . $content_show_delay .'"';
								$title_content_attr .= 'data-hide-transition="' . $content_hide_transition .'"';
								$title_content_attr .= 'data-hide-duration="' . $content_hide_duration . '"';
								$title_content_attr .= 'data-hide-delay="' . $content_hide_delay .'"';

								$html .= sprintf( '<div %1$s>%2$s</div>', apply_filters( 'cherry_slider_item_content_attr', $title_content_attr ), do_shortcode( get_the_content() ) );
							$html .= '</div>';
							break;
					}

				endwhile;
			} else {
				echo '<h4>' . __( 'Posts not found', 'cherry-slider' ) . '</h4>';
			}

		// Reset the query.
		wp_reset_postdata();

		return $html;
	}

	/**
	 * Get post attached image.
	 *
	 * @param  int          $id               Image id.
	 * @param  string|array $size             Image size.
	 * @param  array        $placeholder_attr Placeholder settings.
	 * @param  boolean      $only_url         Only url status.
	 * @return string                         renered img tag
	 */
	public function get_image( $id, $size, $placeholder_attr, $only_url = false ) {

		// place holder defaults attr
		$default_placeholder_attr = apply_filters( 'cherry_slider_placeholder_default_args',
			array(
				'width'			=> 900,
				'height'		=> 500,
				'background'	=> '000',
				'foreground'	=> 'fff',
				'title'			=> '',
				'class'			=> '',
			)
		);

		$placeholder_attr = wp_parse_args( $placeholder_attr, $default_placeholder_attr );

		$image = '';

		// Check the attached image, if not attached - function replaces on the placeholder.
		if ( has_post_thumbnail( $id ) ) {
			$thumbnail_id = get_post_thumbnail_id( intval( $id ) );
			$attachment_image = wp_get_attachment_image_src( $thumbnail_id, $size );

			if ( $only_url ) {
				return $attachment_image[0];
			}

			$image_html_attrs = 'class="sp-image"';
			$image_html_attrs .= 'src="' . CHERRY_SLIDER_URI . 'public/assets/css/images/blank.gif"';
			$image_html_attrs .= 'data-src="' . $attachment_image[0] . '"';
			$image = sprintf( '<img %s alt="">', $image_html_attrs );
		} else {
			$placeholder_link = 'http://fakeimg.pl/' . $placeholder_attr['width'] . 'x' . $placeholder_attr['height'] . '/'. $placeholder_attr['background'] .'/'. $placeholder_attr['foreground'] . '/?text=' . $placeholder_attr['title'] . '';
			$image = '<img class="sp-image ' . $placeholder_attr['class'] . '" src="' . $placeholder_link . '" alt="" title="' . $placeholder_attr['title'] . '">';
		}

		return $image;
	}

	/**
	 * Get cropped image.
	 *
	 * @since  1.0.0
	 *
	 * @param  string  $img_url      full image url.
	 * @param  integer $width        new image width.
	 * @param  integer $height       new image height.
	 * @param  string  $custom_class custom image class.
	 * @param  string  $alt_value    alt label text.
	 * @return string                croped umage url
	 */
	public function get_crop_image( $img_url = '', $width = 100, $height = 100, $custom_class = '', $alt_value = '' ) {
		$attachment_id = $this->get_attachment_id_from_src( $img_url );

		// Check if $attachment_id exist.
		if ( null == $attachment_id ) {
			return false;
		}

		$image = '';

		// Resize & crop image.
		$croped_image_url = aq_resize( $img_url, $width, $height, true );

		// Get $pathinfo.
		$pathinfo = pathinfo( $croped_image_url );

		// Get $attachment metadata.
		$attachment_metadata = wp_get_attachment_metadata( $attachment_id );

		// Create new custom size.
		$attachment_metadata['sizes'][ 'croped-image-' . $width . '-' . $height ] = array(
			'file'			=> $pathinfo['basename'],
			'width'			=> $width,
			'height'		=> $height,
			'mime-type'		=> get_post_mime_type( $attachment_id ),
		);

		// WP update attachment metadata.
		wp_update_attachment_metadata( $attachment_id, $attachment_metadata );

		$ratio_value = $height / $width;
		$image .= '<img class="image croped-image ' . $custom_class . '" data-ratio="' . $ratio_value . '" width="' . $width . '" height="' . $height .'" src="' . $croped_image_url . '" alt="'. $alt_value .'">';

		return $image;
	}

	/**
	 * Get attachment id using image src.
	 *
	 * @param  string $image_src image source url.
	 * @return int $id image uri source.
	 */
	public function get_attachment_id_from_src( $image_src ) {
		global $wpdb;

		$query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
		$id = $wpdb->get_var( $query );

		return $id;
	}
}
