<?php
/**
 * Define callback functions for templater
 *
 * @package   Cherry_Grid Shortcode
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
	die;
}

/**
 * Callbcks for grid shortcode templater
 *
 * @since  1.0.0
 */
class Cherry_Grid_Shortcode_Callbacks {

	/**
	 * Shortcode attributes array
	 * @var array
	 */
	public $atts = array();

	/**
	 * Current post grid-related meta
	 * @var array
	 */
	public $grid_meta = array();

	/**
	 * Grid data
	 * @var array
	 */
	public $grid_data = array();

	function __construct( $atts ) {
		$this->atts = $atts;
	}

	/**
	 * Clear post data after loop iteration
	 *
	 * @since  1.0.3
	 * @return void
	 */
	public function clear_data() {
		$this->grid_meta = array();
		$this->grid_data = array();
	}

	/**
	 * Get post meta
	 *
	 * @since 1.0.3
	 */
	public function get_meta() {
		if ( null == $this->grid_meta ) {
			global $post;
			$this->grid_meta = get_post_meta( $post->ID, '_cherry_grid', true );
		}
		return $this->grid_meta;
	}

	/**
	 * Get post title
	 *
	 * @since  1.0.3
	 * @return string
	 */
	public function post_title() {
		if ( ! isset( $this->grid_data['title'] ) ) {
			$this->grid_data['title'] = get_the_title();
		}
		return $this->grid_data['title'];
	}

	/**
	 * Get post permalink
	 *
	 * @since  1.0.3
	 * @return string
	 */
	public function post_permalink() {
		if ( ! isset( $this->grid_data['permalink'] ) ) {
			$this->grid_data['permalink'] = get_permalink();
		}
		return $this->grid_data['permalink'];
	}

	/**
	 * Get post terms by taxonomy name
	 *
	 * @since  1.0.0
	 * @param  string $taxonomy taxonomy name to get it
	 */
	public function get_tax( $taxonomy = 'category' ) {
		global $post;
		$terms = get_the_term_list( $post->ID, $taxonomy, '', ', ', '' );
		return $terms;
	}

	/**
	 * Get post title
	 * @since  1.0.0
	 */
	public function get_title() {
		$format = '<h3 class="cherry-grid_title"><a href="%2$s">%1$s</a></h3>';
		return sprintf( $format, $this->post_title(), $this->post_permalink() );
	}

	/**
	 * Get post title
	 * @since  1.0.0
	 */
	public function get_image() {

		global $post;

		$post_type = get_post_type( $post->ID );

		if ( ! post_type_supports( $post_type, 'thumbnail' ) ) {
			return;
		}

		if ( ! has_post_thumbnail() ) {
			return;
		}

		$grid_meta = $this->get_meta();

		if ( isset( $grid_meta['show_thumb'] ) && 'no' == $grid_meta['show_thumb'] ) {
			return;
		}

		$format = '<figure class="cherry-grid_thumb"><a href="%2$s">%1$s</a></figure>';
		$image  = get_the_post_thumbnail(
			$post->ID,
			array( $this->atts['thumbnail_size'], $this->atts['thumbnail_size'] ),
			array( 'alt' => $this->post_title() )
		);

		return sprintf( $format, $image, $this->post_permalink() );
	}

	/**
	 * Get post author link
	 * @since  1.0.0
	 */
	public function get_author() {

		$format     = '<span class="cherry-grid_author vcard"><a href="%2$s" rel="author">%1$s</a></span>';
		$author     = get_the_author();
		$author_url = get_author_posts_url( get_the_author_meta( 'ID' ) );

		return sprintf( $format, $author, $author_url );

	}

	/**
	 * Get post publishing date
	 * @since  1.0.0
	 */
	public function get_date( $date_format = null ) {

		if ( null == $date_format ) {
			$date_format = get_option( 'date_format' );
		}

		$format  = '<time class="cherry-grid_date" datetime="%2$s">%1$s</time>';
		$date    = get_the_date( $date_format );
		$ux_date = esc_attr( get_the_date( 'c' ) );

		return sprintf( $format, $date, $ux_date );

	}

	/**
	 * Get post comments
	 * @since 1.0.0
	 */
	public function get_comments() {

		global $post;

		$post_type = get_post_type( $post->ID );

		if ( ! post_type_supports( $post_type, 'comments' ) ) {
			return;
		}

		$comments = ( comments_open() || get_comments_number() ) ? get_comments_number() : '';

		if ( ! $comments ) {
			return;
		}

		$format        = '<span class="cherry-grid_comments"><a href="%2$s">%1$s</a></span>';
		$comments_link = esc_url( get_comments_link() );

		return sprintf( $format, $comments, $comments_link );

	}

	/**
	 * Get post exerpt
	 * @since 1.0.0
	 */
	public function get_excerpt() {

		global $post;

		$post_type = get_post_type( $post->ID );

		$excerpt = has_excerpt( $post->ID ) ? apply_filters( 'the_excerpt', get_the_excerpt() ) : '';

		if ( ! $excerpt ) {

			$grid_meta = $this->get_meta();

			$excerpt_length = ( false != $grid_meta && ! empty( $grid_meta['excerpt_length'] ) )
								? $grid_meta['excerpt_length']
								: 20;

			$content = get_the_content();
			$excerpt = strip_shortcodes( $content );
			$excerpt = str_replace( ']]>', ']]&gt;', $excerpt );
			$excerpt = wp_trim_words( $excerpt, $excerpt_length, '' );

		}

		$format = '<div class="cherry-grid_excerpt">%s</div>';

		return sprintf( $format, $excerpt );

	}

	/**
	 * Get post content
	 * @since  1.0.0
	 */
	public function get_content() {

		$content = apply_filters( 'the_content', get_the_content() );

		if ( ! $content ) {
			return;
		}

		$format = '<div class="post-content">%s</div>';

		return sprintf( $format, $content );
	}

	/**
	 * Get read more button
	 * @since  1.0.0
	 */
	public function get_button( $class = 'cherry-btn cherry-btn-primary' ) {

		$format = '<a href="%2$s" class="%3$s">%1$s</a>';
		$text   = $this->atts['button_text'];
		$class  = esc_attr( $class );
		$url    = $this->post_permalink();

		return sprintf( $format, $text, $url, $class );

	}

}