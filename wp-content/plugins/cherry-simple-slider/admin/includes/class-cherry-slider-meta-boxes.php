<?php
/**
 * Handles custom post meta boxes for the 'simple-slider' post type.
 *
 * @package   Cherry_Slider_Admin
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

/**
 * Class for Simple Slider custom post meta boxes.
 *
 * @since 1.0.0
 */
class Cherry_Simple_Slider_Meta_Boxes {

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
		add_action( 'add_meta_boxes_' . CHERRY_SLIDER_NAME, array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post',      array( $this, 'save_post' ), 10, 2 );
	}

	/**
	 * Adds the meta box container.
	 *
	 * @since 1.0.0
	 * return
	 */
	public function add_meta_boxes() {
		$post_id = get_the_ID();
		$format = get_post_format( $post_id );
		$format = ( empty( $format ) ) ? 'standart' : $format;

		/**
		 * Filter the array of 'add_meta_box' parametrs.
		 *
		 * @since 1.0.0
		 */

		// post format settings
		$post_format_settings = $this->format_settings( $format );

		$this->metabox_format = apply_filters( 'cherry_slider_metabox_params', array(
			'id'            => 'cherry-slider-post-format-options',
			'title'         => __( 'Post format options', 'cherry-slider' ),
			'post_type'     => CHERRY_SLIDER_NAME,
			'context'       => 'normal',
			'priority'      => 'high',
			'callback_args' => $post_format_settings,
		));

		/**
		 * Add meta box to the administrative interface.
		 *
		 * @link http://codex.wordpress.org/Function_Reference/add_meta_box
		 */
		add_meta_box(
			$this->metabox_format['id'],
			$this->metabox_format['title'],
			array( $this, 'callback_metabox' ),
			$this->metabox_format['post_type'],
			$this->metabox_format['context'],
			$this->metabox_format['priority'],
			$this->metabox_format['callback_args']
		);
	}

	/**
	 * Prints the box content.
	 *
	 * @since 1.0.0
	 * @param object $post Current post object.
	 * @param array  $metabox Current metabox object.
	 */
	public function callback_metabox( $post, $metabox ) {
		$output = '';

		// Add an nonce field so we can check for it later.
		wp_nonce_field( plugin_basename( __FILE__ ), 'cherry_slider_options_meta_nonce' );

		foreach ( $metabox['args'] as $settings ) :
			// Get current post meta data.
			$post_meta  = get_post_meta( $post->ID, CHERRY_SLIDER_POSTMETA, true );

			if ( ! empty( $post_meta ) && isset( $post_meta[ $settings['id'] ] ) ) {
				$field_value = $post_meta[ $settings['id'] ];
			} else {
				$field_value = $settings['value'];
			}
			$settings['value'] = $field_value;

			$builder = new Cherry_Interface_Builder( array(
				'name_prefix'	=> CHERRY_SLIDER_POSTMETA,
				'pattern'		=> 'inline',
				'class'			=> array( 'section' => 'single-section' ),
			) );

			$builder->enqueue_builder_scripts();
			$builder->enqueue_builder_styles();

			$output .= $builder->add_form_item( $settings );
		endforeach;

		printf( '<div class="%1$s cherry-ui-core">%2$s</div>', 'settings-item', $output );
	}

	/**
	 * Post Format settings.
	 *
	 * @since 1.0.0
	 *
	 * @param string $format post format.
	 */
	public function format_settings( $format = 'standart' ) {
		$post_format_settings = array();

		switch ( $format ) {
			case 'standart':
				/**
				 * Filter base settings for standart format options.
				 *
				 * @since 1.0.0
				 * @param array with base settings for standart format options.
				 */
				$post_format_settings = apply_filters( 'cherry-slider-standart-format-settings', array(
					// Content settings
					array(
						'id'			=> 'slider-standart-content-width',
						'type'			=> 'text',
						'label'			=> __( 'Content width', 'cherry-slider' ),
						'decsription'	=> __( 'Content width', 'cherry-slider' ),
						'value'			=> '50%',
					),
					array(
						'id'			=> 'slider-standart-content-vertical',
						'type'			=> 'text',
						'label'			=> __( 'Content vertical', 'cherry-slider' ),
						'decsription'	=> __( 'Content vertical', 'cherry-slider' ),
						'value'			=> '40%',
					),
					array(
						'id'			=> 'slider-standart-content-position',
						'type'			=> 'select',
						'label'			=> __( 'Content Position', 'cherry-slider' ),
						'decsription'	=> __( 'Select content position', 'cherry-slider' ),
						'class'			=> 'width-full',
						'value'			=> 'topCenter',
						'options'		=> array(
							'topLeft'		=> __( 'topLeft position', 'cherry-slider' ),
							'topCenter'		=> __( 'topCenter position', 'cherry-slider' ),
							'topRight'		=> __( 'topRight position', 'cherry-slider' ),
							'bottomLeft'	=> __( 'bottomLeft position', 'cherry-slider' ),
							'bottomCenter'	=> __( 'bottomCenter position', 'cherry-slider' ),
							'bottomRight'	=> __( 'bottomRight position', 'cherry-slider' ),
							'centerLeft'	=> __( 'centerLeft position', 'cherry-slider' ),
							'centerRight'	=> __( 'centerRight position', 'cherry-slider' ),
							'centerCenter'	=> __( 'centerCenter position', 'cherry-slider' ),
						),
					),
					array(
						'id'			=> 'slider-standart-content-show-transition',
						'type'			=> 'select',
						'label'			=> __( 'Content show transition', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the transition of the layer when it appears in the slide. Can be set to left, right, up or down, these values describe the direction in which the layer will move when it appears.', 'cherry-slider' ),
						'class'			=> 'width-full',
						'value'			=> 'left',
						'options'		=> array(
							'left'		=> __( 'Left transition', 'cherry-slider' ),
							'right'		=> __( 'Right transition', 'cherry-slider' ),
							'up'		=> __( 'Up transition', 'cherry-slider' ),
							'down'		=> __( 'Down transition', 'cherry-slider' ),
						),
					),
					array(
						'id'			=> 'slider-standart-content-show-duration',
						'type'			=> 'slider',
						'label'			=> __( 'Content show duration', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the duration of the show transition.', 'cherry-slider' ),
						'max_value'		=> 10000,
						'min_value'		=> 100,
						'value'			=> 500,
					),
					array(
						'id'			=> 'slider-standart-content-show-delay',
						'type'			=> 'slider',
						'label'			=> __( 'Content show delay', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the delay of the show transition.', 'cherry-slider' ),
						'max_value'		=> 10000,
						'min_value'		=> 100,
						'value'			=> 400,
					),
					array(
						'id'			=> 'slider-standart-content-hide-transition',
						'type'			=> 'select',
						'label'			=> __( 'Content hide transition', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the transition of the layer when it disappears from the slide. Can be set to left, right, up or down, these values describe the direction in which the layer will move when it disappears.', 'cherry-slider' ),
						'class'			=> 'width-full',
						'value'			=> 'left',
						'options'		=> array(
							'left'		=> __( 'Left transition', 'cherry-slider' ),
							'right'		=> __( 'Right transition', 'cherry-slider' ),
							'up'		=> __( 'Up transition', 'cherry-slider' ),
							'down'		=> __( 'Down transition', 'cherry-slider' ),
						),
					),
					array(
						'id'			=> 'slider-standart-content-hide-duration',
						'type'			=> 'slider',
						'label'			=> __( 'Content hide duration', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the duration of the hide transition.', 'cherry-slider' ),
						'max_value'		=> 10000,
						'min_value'		=> 100,
						'value'			=> 500,
					),
					array(
						'id'			=> 'slider-standart-content-hide-delay',
						'type'			=> 'slider',
						'label'			=> __( 'Content hide delay', 'cherry-slider' ),
						'decsription'	=> __( 'Sets the delay of the hide transition.', 'cherry-slider' ),
						'max_value'		=> 10000,
						'min_value'		=> 100,
						'value'			=> 200,
					),
					array(
						'id'			=> 'slider-standart-content-wrapper',
						'type'			=> 'switcher',
						'label'			=> __( 'Content wrapper', 'cherry-slider' ),
						'decsription'	=> __( 'Using content wrapper', 'cherry-slider' ),
						'value'			=> 'true',
						'toggle'		=> array(
							'true_toggle'	=> __( 'Yes', 'cherry-slider' ),
							'false_toggle'	=> __( 'No', 'cherry-slider' ),
						),
					),
				));
				break;

			case 'image':
				/**
				 * Filter base settings for image format options.
				 *
				 * @since 1.0.0
				 * @param array with base settings for image format options.
				 */
				$post_format_settings = apply_filters( 'cherry-slider-image-format-settings', array(
					array(
						'id'			=> 'slider-image-format-crop-image',
						'type'			=> 'switcher',
						'label'			=> __( 'Crop image', 'cherry-slider' ),
						'decsription'	=> __( 'Using cropped image', 'cherry-slider' ),
						'value'			=> 'true',
						'toggle'		=> array(
							'true_toggle'	=> __( 'Yes', 'cherry-slider' ),
							'false_toggle'	=> __( 'No', 'cherry-slider' ),
						),
					),
				));
				break;

			case 'audio':
				/**
				 * Filter base settings for audio format options.
				 *
				 * @since 1.0.0
				 * @param array with base settings for audio format options.
				 */
				$post_format_settings = apply_filters( 'cherry-slider-audio-format-settings', array(
					array(
						'id'				=> 'slider-audio-src',
						'type'				=> 'media',
						'label'				=> __( 'Audio source', 'cherry-slider' ),
						'decsription'		=> __( 'Enter audio source( mp3, m4a, ogg, wav, wma )', 'cherry-slider' ),
						'value'				=> '',
						'display_image'		=> true,
						'multi_upload'		=> true,
						'library_type'		=> 'audio',
					),
				));
				break;
			case 'video':
				/**
				 * Filter base settings for video format options.
				 *
				 * @since 1.0.0
				 * @param array with base settings for video format options.
				 */
				$post_format_settings = apply_filters( 'cherry-slider-video-format-settings', array(
					array(
						'id'			=> 'slider-video-type',
						'type'			=> 'radio',
						'label'			=> __( 'Video type', 'cherry-slider' ),
						'decsription'	=> __( 'Choose video type', 'cherry-slider' ),
						'value'			=> 'slider-video-type-embed',
						'options'		=> array(
							'slider-video-type-embed' => array(
								'label' => __( 'Embed video type', 'cherry-slider' ),
								'img_src' => '',
							),
							'slider-video-type-html5' => array(
								'label' => __( 'HTML5 video type', 'cherry-slider' ),
								'img_src' => '',
							),
						),
					),
					array(
						'id'			=> 'slider-embed-video-src',
						'type'			=> 'text',
						'label'			=> __( 'Embed video source', 'cherry-slider' ),
						'decsription'	=> __( 'Enter source for embed video', 'cherry-slider' ),
						'value'			=> 'https://www.youtube.com/watch?v=2kodXWejuy0',
					),
					array(
						'id'				=> 'slider-mp4-video-id',
						'type'				=> 'media',
						'label'				=> __( 'MP4 video source', 'cherry-slider' ),
						'decsription'		=> __( 'Enter source for MP4 video', 'cherry-slider' ),
						'value'				=> '',
						'multi_upload'		=> false,
						'library_type'		=> 'video',
					),
					array(
						'id'				=> 'slider-ogv-video-id',
						'type'				=> 'media',
						'label'				=> __( 'OGV video source', 'cherry-slider' ),
						'decsription'		=> __( 'Enter source for OGV video', 'cherry-slider' ),
						'value'				=> '',
						'multi_upload'		=> false,
						'library_type'		=> 'video',
					),
				));
			break;
		}

		return $post_format_settings;
	}

	/**
	 * Post format metabox form renderer.
	 *
	 * @param  int    $post_id Post id number.
	 * @param  string $format  selected post format.
	 * @return void
	 */
	public function format_metabox_builder( $post_id = null, $format = 'standart' ) {
		$output = '';
		$settings_field = $this->format_settings( $format );

		foreach ( $settings_field as $settings ) :

			// Get current post meta data.
			$post_meta  = get_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, true );

			if ( ! empty( $post_meta ) && isset( $post_meta[ $settings['id'] ] ) ) {
				$field_value = $post_meta[ $settings['id'] ];
			} else {
				$field_value = $settings['value'];
			}

			$settings['value'] = $field_value;

			$builder = new Cherry_Interface_Builder( array(
				'name_prefix'	=> CHERRY_SLIDER_POSTMETA,
				'pattern'		=> 'inline',
				'class'			=> array( 'section' => 'single-section' ),
			) );

			$output .= $builder->add_form_item( $settings );

		endforeach;

		printf( '<div class="%1$s cherry-ui-core">%2$s</div>', 'settings-item ' . $format . '-post-format-settings', $output );
	}

	/**
	 * Save the meta when the post is saved.
	 *
	 * @since 1.0.0
	 * @param int    $post_id post id.
	 * @param object $post post object.
	 */
	public function save_post( $post_id, $post ) {

		// Verify the nonce.
		if ( ! isset( $_POST['cherry_slider_options_meta_nonce'] ) || ! wp_verify_nonce( $_POST['cherry_slider_options_meta_nonce'], plugin_basename( __FILE__ ) ) ) {
			return;
		}

		// If this is an autosave, our form has not been submitted, so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Get the post type object.
		$post_type = get_post_type_object( $post->post_type );

		// Check if the current user has permission to edit the post.
		if ( ! current_user_can( $post_type->cap->edit_post, $post_id ) ) {
			return $post_id;
		}

		// Don't save if the post is only a revision.
		if ( 'revision' == $post->post_type ) {
			return;
		}

		// Array of new post meta value.
		$new_meta_value = array();

		// Check if $_POST have a needed key.
		if ( isset( $_POST[ CHERRY_SLIDER_POSTMETA ] ) && ! empty( $_POST[ CHERRY_SLIDER_POSTMETA ] ) ) {

			foreach ( $_POST[ CHERRY_SLIDER_POSTMETA ] as $key => $value ) {

				// Sanitize the user input.
				$new_meta_value[ $key ] = sanitize_text_field( $value );
			}
		}

		// Check if nothing found in $_POST array.
		if ( empty( $new_meta_value ) ) {
			return;
		}

		// Get current post meta data.
		$meta_value = get_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, true );

		// If a new meta value was added and there was no previous value, add it.
		if ( $new_meta_value && '' == $meta_value ) {
			add_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, $new_meta_value, true );
		} elseif ( $new_meta_value && $new_meta_value != $meta_value ) {

			// If the new meta value does not match the old value, update it.
			$new_meta_value = array_merge( $meta_value, $new_meta_value );
			update_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, $new_meta_value );
		} elseif ( '' == $new_meta_value && $meta_value ) {

			// If there is no new meta value but an old value exists, delete it.
			delete_post_meta( $post_id, CHERRY_SLIDER_POSTMETA, $meta_value );
		}
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

Cherry_Simple_Slider_Meta_Boxes::get_instance();
