<?php
/**
 * Class for render and saving custom sidebars.
 *
 * @package   Cherry_Custom_Sidebar
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 **/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Cherry_Custom_Sidebar' ) ) {

	/**
	 * Class for render and saving custom sidebars.
	 *
	 * @since 1.0.0
	 */
	class Cherry_Custom_Sidebar {

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

			require_once( trailingslashit( CHERRY_CUSTOM_SIDEBARS_DIR ) . 'admin/views/ui-select/ui-select.php' );

			// Add the `Layout` meta box on the 'add_meta_boxes' hook.
			add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ), 10, 2 );

			// Saves the post format on the post editing page.
			add_action( 'save_post', array( $this, 'save_post' ), 10, 2 );
		}

		/**
		 * Adds the meta box if the post type supports 'cherry-post-style' and the current user has
		 * permission to edit post meta.
		 *
		 * @since  1.0.0
		 * @param  string $post_type The post type of the current post being edited.
		 * @param  object $post      The current post object.
		 * @return void
		 */
		public function add_meta_boxes( $post_type, $post ) {
			$allowed_post_type = apply_filters( 'cherry_sidebar_post_type', array( 'page', 'post', 'portfolio', 'testimonial', 'service', 'team' ) );

			if ( in_array( $post_type, $allowed_post_type )
					&& ( current_user_can( 'edit_post_meta', $post->ID )
					|| current_user_can( 'add_post_meta', $post->ID )
					|| current_user_can( 'delete_post_meta', $post->ID ) )
				) {

				/**
				 * Filter the array of 'add_meta_box' parametrs.
				 *
				 * @since 1.0.0
				 */
				$metabox = apply_filters( 'cherry_custom_sidebar', array(
					'id'            => 'cherry-sidebar-manager',
					'title'         => __( 'Post Sidebars', 'cherry' ),
					'page'          => $post_type,
					'context'       => 'side',
					'priority'      => 'default',
					'callback_args' => false,
				) );

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
		}

		/**
		 * Displays a meta box of radio selectors on the post editing screen, which allows theme users to select
		 * the layout they wish to use for the specific post.
		 *
		 * @since  1.0.0
		 * @param  object $post    The post object currently being edited.
		 * @param  array  $metabox Specific information about the meta box being loaded.
		 * @return void
		 */
		public function callback_metabox( $post, $metabox ) {
			wp_nonce_field( basename( __FILE__ ), 'cherry-sidebar-nonce' );

			global $wp_registered_sidebars;

			$Cherry_Custom_Sidebars_Methods = new Cherry_Custom_Sidebars_Methods();
			$cusotm_sidebar_array = $Cherry_Custom_Sidebars_Methods->get_custom_sidebar_array();

			unset( $cusotm_sidebar_array['cherry-sidebar-manager-counter'] );
			$wp_registered_sidebars = array_merge( $wp_registered_sidebars, $cusotm_sidebar_array );

			$select_sidebar = $this->get_post_sidebar( $post->ID );

			$sidebars = array(
				'cherry-post-main-sidebar'			=> array(
					'title'	=> __( 'Main Sidebar:', 'cherry-sidebar-manager' ),
					'id'	=> 'cherry-post-main-sidebar',
					'value'	=> ( isset( $select_sidebar['cherry-post-main-sidebar'] ) && is_array( $select_sidebar ) ) ? $select_sidebar['cherry-post-main-sidebar'] : '',
				),
				'cherry-post-secondary-sidebar'	=> array(
					'title'	=> __( 'Secondary Sidebar:', 'cherry-sidebar-manager' ),
					'id'	=> 'cherry-post-secondary-sidebar',
					'value'	=> ( isset( $select_sidebar['cherry-post-secondary-sidebar'] ) && is_array( $select_sidebar ) ) ? $select_sidebar['cherry-post-secondary-sidebar'] : '',
				),
			);

			$select_options = array( '' => __( 'Sidebar not selected', 'cherry-sidebar-manager' ) );

			foreach ( $wp_registered_sidebars as $sidebar => $sidebar_value ) {
				$sidebar_id = $sidebar_value['id'];
				$sidebar_name = $sidebar_value['name'];
				$select_options[ $sidebar_id ] = $sidebar_name;
			}

			/**
			 * Filter for editing all sidebars list.
			 *
			 * @var array
			 */
			$select_options = apply_filters( 'cherry_all_sidebars_list', $select_options );

			foreach ( $sidebars as $sidebar => $sidebar_value ) {

				$output = '<p><strong>' . $sidebar_value['title'] . '</strong></p>';

				$UI_Select = new UI_Select(
					array(
						'id' => $sidebar_value['id'],
						'name' => $sidebar_value['id'],
						'value' => $sidebar_value['value'],
						'options' => $select_options,
					)
				);

				$output .= $UI_Select->render();

				echo $output;
			};

			?>
				<p class="howto"><?php printf( __( 'You can choose page sidebars or create a new sidebar on %swidgets page%s .', 'cherry-sidebar-manager' ), '<a href="widgets.php" target="_blank" title="' . __( 'Widgets Page', 'cherry-sidebar-manager' ) . '">', '</a>' )?></p>
			<?php
		}

		/**
		 * Saves the post style metadata if on the post editing screen in the admin.
		 *
		 * @since  1.0.0
		 * @param  int    $post_id The ID of the current post being saved.
		 * @param  object $post    The post object currently being saved.
		 * @return void|int
		 */
		public function save_post( $post_id, $post = '' ) {

			if ( ! is_object( $post ) ) {
				$post = get_post();
			}

			// Verify the nonce for the post formats meta box.
			if ( ! isset( $_POST['cherry-sidebar-nonce'] )
				|| ! wp_verify_nonce( $_POST['cherry-sidebar-nonce'], basename( __FILE__ ) )
				) {
				return $post_id;
			}

			// Get the meta key.
			$meta_key = 'post_sidebar';

			// Get the all submitted `page-sidebar-manager` data.
			$sidebar_id = array( 'cherry-post-main-sidebar' => $_POST['cherry-post-main-sidebar'], 'cherry-post-secondary-sidebar' => $_POST['cherry-post-secondary-sidebar'] );

			update_post_meta( $post_id, $meta_key, $sidebar_id );
		}

		/**
		 * Function get post or page sidebar.
		 *
		 * @since  1.0.0
		 * @param  int $post_id         The ID of the current post being saved.
		 * @return string $post_sidebar Sidebar id value.
		 */
		public function get_post_sidebar( $post_id ) {

			// Get the $post_sidebar.
			$post_sidebar = get_post_meta( $post_id, 'post_sidebar', true );

			return $post_sidebar;
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

	Cherry_Custom_Sidebar::get_instance();
}
?>
