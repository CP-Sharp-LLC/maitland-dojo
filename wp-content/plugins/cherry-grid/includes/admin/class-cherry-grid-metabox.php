<?php
/**
 * Handles custom post meta boxes for the public post types.
 *
 * @package   Cherry_Grid Admin
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

class Cherry_Grid_Meta_Boxes {

	/**
	 * Holds the instances of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Sets up the needed actions for adding and saving the meta boxes.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		add_action( 'admin_init', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_post' ), 10, 2 );

	}

	function add_meta_boxes() {

		$post_types = get_post_types( array( 'public' => true ) );

		foreach ( $post_types as $post_type ) {
			add_action( 'add_meta_boxes_' . $post_type, array( $this, 'add_single_box' ) );
		}

	}

	/**
	 * Adds the meta box container.
	 *
	 * @since 1.0.0
	 */
	public function add_single_box( $post ) {

		/**
		 * Filter the array of 'add_meta_box' parametrs.
		 *
		 * @since 1.0.0
		 */
		$metabox = apply_filters(
			'cherry_grid_metabox_params',
			array(
				'id'            => 'cherry-grid-options',
				'title'         => __( 'Grid Options', 'cherry-grid' ),
				'page'          => $post->post_type,
				'context'       => 'side',
				'priority'      => 'low',
				'callback_args' => array(
					'width' => array(
						'id'          => 'width',
						'type'        => 'select',
						'title'       => __('Width', 'cherry-grid'),
						'label'       => '',
						'description' => '',
						'value'       => 1,
						'options'     => array(
							1 => '1x',
							2 => '2x',
							3 => '3x',
							4 => '4x'
						)
					),
					'show_thumb' => array(
						'id'          => 'show_thumb',
						'type'        => 'select',
						'title'       => __('Show with image', 'cherry-grid'),
						'label'       => '',
						'description' => '',
						'value'       => 1,
						'options'     => array(
							'yes' => __( 'Yes', 'cherry-grid' ),
							'no' => __( 'No', 'cherry-grid' )
						)
					),
					'excerpt_length' => array(
						'id'          => 'excerpt_length',
						'type'        => 'text',
						'title'       => __('Excerpt length', 'cherry-grid'),
						'label'       => '',
						'description' => '',
						'value'       => 40
					),
					'item_background' => array(
						'id'          => 'item_background',
						'type'        => 'colorpicker',
						'title'       => __( 'Item background color', 'cherry-grid' ),
						'description' => '',
						'value'       => ''
					),
					'item_color' => array(
						'id'          => 'item_color',
						'type'        => 'colorpicker',
						'title'       => __( 'Item text color', 'cherry-grid' ),
						'description' => '',
						'value'       => ''
					),
					'css_class'     => array(
						'id'          => 'css_class',
						'type'        => 'text',
						'title'       => __('CSS class for post item', 'cherry-grid'),
						'label'       => '',
						'description' => '',
						'value'       => ''
					)

				)
			),
			$post
		);

		/**
		 * Add meta box to the administrative interface.
		 *
		 * @link http://codex.wordpress.org/Function_Reference/add_meta_box
		 */
		add_meta_box(
			$metabox['id'],
			$metabox['title'],
			array( $this, 'callback_metabox' ),
			$metabox['page'],
			$metabox['context'],
			$metabox['priority'],
			$metabox['callback_args']
		);
	}

	/**
	 * Prints the box content.
	 *
	 * @since 1.0.0
	 * @param object $post    Current post object.
	 * @param array  $metabox
	 */
	public function callback_metabox( $post, $metabox ) {

		if ( ! class_exists( 'Cherry_Interface_Builder' ) ) {
			return;
		}

		// open core UI wrappers
		echo '<div class="cherry-ui-core">';

		// Add an nonce field so we can check for it later.
		wp_nonce_field( plugin_basename( __FILE__ ), 'cherry_grid_options_meta_nonce' );

		$builder = new Cherry_Interface_Builder(
			array(
				'name_prefix' => CHERRY_GRID_POSTMETA,
				'pattern'     => 'inline',
				'class'       => array( 'section' => 'single-section' )
			)
		);

		$meta = get_post_meta( $post->ID, CHERRY_GRID_POSTMETA, true );

		foreach ( $metabox['args'] as $field ) {

			// Check if set the 'id' value for custom field. If not - don't add field.
			if ( ! isset( $field['id'] ) ) {
				continue;
			}

			$field['value'] = isset( $meta[$field['id']] ) ? $meta[$field['id']] : $field['value'];

			echo $builder->add_form_item( $field );

		}

		/**
		 * Fires after testimonial fields of metabox.
		 *
		 * @since 1.0.0
		 * @param object $post                 Current post object.
		 * @param array  $metabox
		 * @param string CHERRY_GRID_POSTMETA Name for 'meta_key' value in the 'wp_postmeta' table.
		 */
		do_action( 'cherry_grid_metabox_after', $post, $metabox, CHERRY_GRID_POSTMETA );

		// close core UI wrappers
		echo '</div>';
	}

	/**
	 * Save the meta when the post is saved.
	 *
	 * @since 1.0.0
	 * @param int    $post_id
	 * @param object $post
	 */
	public function save_post( $post_id, $post ) {

		// Verify the nonce.
		if (
			! isset( $_POST['cherry_grid_options_meta_nonce'] )
			|| ! wp_verify_nonce( $_POST['cherry_grid_options_meta_nonce'], plugin_basename( __FILE__ ) )
		) {
			return;
		}

		// If this is an autosave, our form has not been submitted, so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Get the post type object.
		$post_type = get_post_type_object( $post->post_type );

		// Check if the current user has permission to edit the post.
		if ( !current_user_can( $post_type->cap->edit_post, $post_id ) )
			return $post_id;

		// Don't save if the post is only a revision.
		if ( 'revision' == $post->post_type )
			return;

		// Array of new post meta value.
		$new_meta_value = array();

		// Check if $_POST have a needed key.
		if ( ! isset( $_POST[ CHERRY_GRID_POSTMETA ] ) || empty( $_POST[ CHERRY_GRID_POSTMETA ] ) ) {
			return;
		}

		foreach ( $_POST[ CHERRY_GRID_POSTMETA ] as $key => $value ) {

			// Sanitize the user input.
			$new_meta_value[ $key ] = $this->sanitize_meta( $key, $value );

		}

		// Check if nothing found in $_POST array.
		if ( empty( $new_meta_value ) ) {
			return;
		}

		update_post_meta( $post_id, CHERRY_GRID_POSTMETA, $new_meta_value );
	}

	/**
	 * Sanitize single socials array value
	 *
	 * @since  1.0.0
	 *
	 * @param  string &$item array value
	 * @param  string $key   array key
	 */
	public function sanitize_meta( $key, $value ) {

		switch ( $key ) {

			case 'width':
				$value = absint( $value );
				if ( 0 >= $value || 4 <= $value ) {
					$value = 1;
				}
				break;

			case 'show_thumb':
				$value = in_array( $value, array( 'yes', 'no' ) ) ? $value : 'no';
				break;

			case 'excerpt_length':
				$value = absint( $value );
				break;

			default:
				$value = esc_attr( $value );
				break;
		}

		return $value;

	}

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 * @return object
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}
}

Cherry_Grid_Meta_Boxes::get_instance();