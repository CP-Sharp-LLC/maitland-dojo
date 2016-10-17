<?php
/**
 * Blog functionality for Monstroid.
 *
 * @package WordPress
 * @subpackage Monstroid
 * @since 1.0.0
 */

// Changed a comment gravatar size.
add_filter( 'cherry_comment_list_args',              'monstroid_comment_list_args' );

// Changed a post gravatar size.
add_filter( 'cherry_get_the_post_avatar_defaults',   'monstroid_get_the_post_avatar_defaults' );

// Changed a gallery post.
add_filter( 'cherry_get_the_post_gallery_args',      'monstroid_get_gallery_html', 11 );

// Adds a medium thumbnail size.
add_filter( 'cherry_blog_options_list',              'monstroid_add_blog_options' );

// Adds a video size for video post.
add_filter( 'cherry_get_the_post_video',             'monstroid_get_the_post_video' );

// Removed audio duplicate.
add_filter( 'cherry_pre_get_post_audio',             'monstroid_pre_get_post_audio' );

// Filters a author position.
add_filter( 'cherry_pre_get_the_post_author_pos',    'monstroid_the_post_author_pos', 11, 2 );

// Changed a related posts title.
add_filter( 'cherry_related_posts_output_args',      'monstroid_related_posts_output_args' );

// Changed a comment title.
add_filter( 'cherry_title_comments',                 'monstroid_title_comments', 11, 2 );

// Changed a link format.
add_action( 'wp_loaded',                             'monstroid_post_format_link' );

// Changed a post title.
add_filter( 'cherry_get_the_post_title_defaults',    'monstroid_get_the_post_title_defaults' );

// Changed a sidebar title.
add_filter( 'cherry_sidebar_defaults',               'monstroid_sidebar_defaults' );

// Changed a search form structure.
add_filter( 'get_search_form',                       'monstroid_search_form' );

// Changed a respond form structure with active sidebar.
add_filter( 'cherry_related_posts_args',             'monstroid_related_posts_args', 11 );

// Changed a blog layouts templates.
add_filter( 'cherry_blog_layout_shortcode_settings', 'monstroid_blog_layout_shortcode_settings' );

// Changed a blog layouts templates on blog page.
add_filter('cherry_blog_layout_options_list',        'monstroid_blog_layout_options_list');

// Changed author info.
add_action( 'show_user_profile',        'monstroid_add_custom_user_profile_fields' );
add_action( 'edit_user_profile',        'monstroid_add_custom_user_profile_fields' );
add_action( 'personal_options_update',  'monstroid_save_custom_user_profile_fields' );
add_action( 'edit_user_profile_update', 'monstroid_save_custom_user_profile_fields' );

// Changed a respond form structure.
add_filter( 'comment_form_defaults', 'monstroid_modify_comment_form' );
add_action( 'comment_form_before',   'monstroid_comment_form_before' );
add_action( 'comment_form_after',    'monstroid_comment_form_after' );


function monstroid_comment_list_args( $defaults ) {
	$defaults['avatar_size'] = 116;
	$defaults['callback']    = 'monstroid_comments_rebuild';

	return $defaults;
}

function monstroid_get_the_post_avatar_defaults( $defaults ) {
	$defaults['size'] = '188';

	return $defaults;
}

function monstroid_get_gallery_html( $args ) {

	if ( !is_singular() ) {
		$args['size']            = cherry_get_option( 'blog-featured-images-size' );
		$args['container_class'] = 'post-gallery '. cherry_get_option( 'blog-featured-images-align' ) . ' ' .cherry_get_option( 'blog-featured-images-size') . ' post-gallery';
	}

	return $args;
}

function monstroid_add_blog_options( $args ) {
	$args['blog-featured-images-size'] = array(
		'type'  => 'select',
		'title' => __( 'Featured Image Size', 'monstroid' ),
		'hint'  => array(
			'type'    => 'text',
			'content' => __( 'Set dimensions for post featured images.', 'monstroid' ),
		),
		'class'       => 'width-full',
		'description' => __( 'Set dimensions for post featured images.', 'monstroid' ),
		'value'       => 'cherry-thumb-l',
		'options'     => array(
			'cherry-thumb-s' => __( 'Small', 'monstroid' ),
			'cherry-thumb-m' => __( 'Medium', 'monstroid' ),
			'cherry-thumb-l' => __( 'Large', 'monstroid' ),
		)
	);

	return $args;
}

function monstroid_get_the_post_video( $result ) {

	if ( 'full' == cherry_get_option( 'blog-content-type' ) ) {
		$result = sprintf( '<div class="entry-video '. cherry_get_option( 'blog-featured-images-align' ) .' ' .cherry_get_option( 'blog-featured-images-size' ) . '">%s</div>', $result );
	}

	return $result;
}

function monstroid_pre_get_post_audio( $result ) {

	if ( 'full' == cherry_get_option('blog-content-type') ) {
		return;
	}

	return $result;
}

// Changed a comments structure.
function monstroid_comments_rebuild( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	extract( $args, EXTR_SKIP );

	if ( 'div' == $args['style'] ) {
		$tag = 'div';
		$add_below = 'comment';
	} else {
		$tag = 'li';
		$add_below = 'div-comment';
	} ?>

	<<?php echo $tag ?> <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ) ?> id="comment-<?php comment_ID() ?>">
	<?php if ( 'div' != $args['style'] ) : ?>
		<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
	<?php endif; ?>

	<div class="comment-author vcard">

		<?php if ( $args['avatar_size'] != 0 ) {
			echo get_avatar( $comment, $args['avatar_size'] );
		} ?>

		<div class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ); ?>">
			<?php
				/* translators: 1: date, 2: time */
				printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time() ); ?></a><?php edit_comment_link( __( '(Edit)' ), '  ', '' );
			?>
			</div>

		<?php printf( __( '<h5><cite class="fn">%s</cite></h5>' ), get_comment_author_link() ); ?>

		<div class="reply">
		<?php comment_reply_link( array_merge( $args, array( 'add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
		</div>
	</div>

	<?php if ( $comment->comment_approved == '0' ) : ?>
		<em class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'monstroid' ); ?></em>
		<br />
	<?php endif; ?>
	<div class="comment-content">
		<?php comment_text(); ?>
	</div>
	<?php if ( 'div' != $args['style'] ) : ?>
	</div>
	<?php endif;
}

function monstroid_add_custom_user_profile_fields( $user ) { ?>
	<table class="form-table">
		<tr>
			<th>
				<label for="address"><?php _e( 'User Position', 'monstroid' ); ?></label>
			</th>
			<td>
				<input type="text" name="user_position" id="user_position" value="<?php echo esc_attr( get_the_author_meta( 'user_position', $user->ID ) ); ?>" class="regular-text" /><br />
				<span class="description"><?php _e( 'Please enter your position.', 'monstroid' ); ?></span>
			</td>
		</tr>
	</table>
<?php }

function monstroid_save_custom_user_profile_fields( $user_id ) {

	if ( !current_user_can( 'edit_user', $user_id ) ) {
		return false;
	}

	update_usermeta( $user_id, 'user_position', $_POST['user_position'] );
}

function monstroid_the_post_author_pos( $output, $attr ) {
	$output = get_the_author_meta( 'user_position' );

	return $output;
}

function monstroid_related_posts_output_args( $default_args ) {
	$default_args['format_title'] = '<h2 class="related-posts_title">%1$s</h2>';

	return $default_args;
}

function monstroid_title_comments( $output, $title_comments ) {
	return '<h4 class="comments-title">' . $title_comments . '</h4>';
}

function monstroid_post_format_link() {
	remove_filter( 'the_title',                          'cherry_get_the_link_title', 10 );
	remove_filter( 'cherry_get_the_post_title_defaults', 'cherry_get_the_link_url',   10 );
}

function monstroid_get_the_post_title_defaults( $defaults ) {
	$defaults['tag'] = 'h4';

	if ( ! current_theme_supports( 'post-formats', 'link' ) ) {
		return $defaults;
	}

	if ( ! has_post_format( 'link') ) {
		return $defaults;
	}

	$defaults['wrap'] ='<%1$s class="%2$s">%3$s</%1$s><a class="post-link" href="' . cherry_get_post_format_url() . '">' . cherry_get_post_format_url() . '</a>';

	return $defaults;
}

function monstroid_sidebar_defaults( $defaults ) {
	$defaults['before_title'] = '<h5 class="widget-title">';
	$defaults['after_title']  = '</h5>';

	return $defaults;
}

function monstroid_modify_comment_form( $arg ) {
	$arg = wp_parse_args( $arg );

	if ( ! isset( $arg['format'] ) ) {
		$arg['format'] = current_theme_supports( 'html5', 'comment-form' ) ? 'html5' : 'xhtml';
	}

	$req       = get_option( 'require_name_email' );
	$aria_req  = ( $req ? " aria-required='true'" : '' );
	$html_req  = ( $req ? " required='required'" : '' );
	$html5     = 'html5' === $arg['format'];
	$commenter = wp_get_current_commenter();

	$arg['class_submit']     = 'submit cherry-btn cherry-btn-default cherry-btn-medium cherry-btn-inline cherry-btn-fade';
	$arg['fields']['author'] = '<p class="comment-form-author"><input id="author" name="author" type="text" placeholder="' . __( 'Name:', 'monstroid' ) . '" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . $html_req . ' />';
	$arg['fields']['email']  = '<p class="comment-form-email"><input id="email" name="email" ' . ( $html5 ? 'type="email"' : 'type="text"' ) . ' placeholder="' . __( 'E-mail:', 'monstroid' ) . '" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30" aria-describedby="email-notes"' . $aria_req . $html_req  . ' /></p>';
	$arg['fields']['url']    =  '<p class="comment-form-url"><input id="url" name="url" ' . ( $html5 ? 'type="url"' : 'type="text"' ) . ' placeholder="' . __( 'Website:', 'monstroid' ) . '" value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30" /></p>';
	$arg['comment_field']    = '<p class="comment-form-comment"><textarea id="comment" name="comment" placeholder="' . __( 'Comment:', 'monstroid' ) . '" cols="45" rows="8" aria-describedby="form-allowed-tags" aria-required="true" required="required"></textarea></p>';
	$arg['submit']           = '<p class="comment-form-comment"><textarea id="comment" name="comment" placeholder="' . __( 'Comment:', 'monstroid' ) . '" cols="45" rows="8" aria-describedby="form-allowed-tags" aria-required="true" required="required"></textarea></p>';

	return $arg;
}

function monstroid_comment_form_before() {
	ob_start();
}

function monstroid_comment_form_after() {
	$html = ob_get_clean();
	$html = preg_replace(
		'/<h3 id="reply-title"(.*)>(.*)<\/h3>/',
		'<h4 id="reply-title"\1>\2</h4>',
		$html
	);
	echo $html;
}

function monstroid_search_form( $form ) {
	$form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url( '/' ) . '" >
	<div><label class="screen-reader-text" for="s">' . __( 'Search for:' ) . '</label>
	<input placeholder="Search" type="text" value="' . get_search_query() . '" name="s" id="s" />
	<button type="submit" class="search-submit">' . esc_attr_x( 'Search', 'submit button' ) . '</button>
	</div>
	</form>';

	return $form;
}

function monstroid_related_posts_args( $args ) {

	if ( cherry_display_sidebar( apply_filters( 'cherry_get_main_sidebar', 'sidebar-main' ) ) ) {
		$args['num'] = 2;
	}

	return $args;
}

function monstroid_blog_layout_shortcode_settings( $settings ) {
	$settings['atts']['template_type'] = array(
		'type'     => 'select',
		'values'   => array(
			'default' => __( 'Default', 'monstroid' ),
			'type-1'  => __( 'Type 1', 'monstroid' ),
			'type-2'  => __( 'Type 2', 'monstroid' ),
			'type-3'  => __( 'Type 3', 'monstroid' ),
		),
		'default' => '',
		'name'    => __( 'Template', 'monstroid' ),
		'desc'    => __( 'Select template to show posts from', 'monstroid' ),
	);

	return $settings;
}

function monstroid_blog_layout_options_list( $settings ){
	$settings['blog-layout-template-type'] = array(
		'type'        => 'select',
		'title'       => __( 'Template type', 'monstroid' ),
		'label'       => '',
		'description' => __( 'Select template type for blog posts', 'monstroid' ),
		'value'       => 'default',
		'class'       => '',
		'options'     => array(
			'default' => __( 'Default', 'monstroid' ),
			'type-1'  => __( 'Type 1', 'monstroid' ),
			'type-2'  => __( 'Type 2', 'monstroid' ),
		)
	);

	return $settings;
}