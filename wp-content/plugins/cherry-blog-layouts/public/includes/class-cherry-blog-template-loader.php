<?php
/**
 * Cherry Blog Layouts template loader
 *
 * @package   Cherry_Blog_Layouts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2015 Cherry Team
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'Cherry_Blog_Template_Loader' ) ) {

	class Cherry_Blog_Template_Loader {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Temporary storage for main WP_Query during processing custom page template
		 *
		 * @since 1.0.0
		 * @var   boolean
		 */
		public static $temp_query = false;

		/**
		 * Store  custom templates in this property
		 *
		 * @since 1.0.0
		 * @var   array
		 */
		public $templates = array();

		function __construct() {

			// Rewrite default blog templates
			add_filter( 'template_include', array( $this, 'view_template' ), 1 );

		}

		/**
		 * Return custom template path by name/slug
		 *
		 * Searching priority:
		 * yourtheme/blog-layouts/$name-$slug.php
		 * yourtheme/blog-layouts/$name.php
		 * plugin/templates/$name-$slug.php
		 *
		 * @since 1.0.0
		 *
		 * @param string $slug template slug
		 * @param string $name template unique name
		 */
		public static function get_template( $slug, $name = null ) {

			$template = false;

			if ( $name ) {
				$template = locate_template( array( "blog-layouts/{$slug}-{$name}.php" ) );
			}

			if ( ! $template && $name && file_exists( CHERRY_BLOG_DIR . "templates/{$slug}-{$name}.php" ) ) {
				$template = CHERRY_BLOG_DIR . "templates/{$slug}-{$name}.php";
			}

			if ( ! $template ) {
				$template = locate_template( array( "blog-layouts/{$slug}.php" ) );
			}

			if ( ! $template && file_exists( CHERRY_BLOG_DIR . "templates/{$slug}.php" ) ) {
				$template = CHERRY_BLOG_DIR . "templates/{$slug}.php";
			}

			$template = apply_filters( 'cherry_blog_get_template', $template, $slug, $name );

			if ( ! $template ) {
				return false;
			}

			return $template;

		}

		/**
		 * Load custom tmpl file
		 *
		 * Searching priority:
		 * yourtheme/blog-layouts/$name-$slug.tmpl
		 * plugin/templates/$name-$slug.tmpl
		 * yourtheme/blog-layouts/$name.tmpl
		 * yourtheme/content/$name-$slug.tmpl
		 * framework/content/$name-$slug.tmpl
		 *
		 * @since 1.0.0
		 *
		 * @param string $slug template slug
		 * @param string $name template unique name
		 */
		public static function get_tmpl( $slug, $name = null ) {

			$template     = false;
			$tmpl_content = '';

			ob_start();

			$child_dir = get_stylesheet_directory();

			if ( file_exists( $child_dir . "/blog-layouts/tmpl/{$slug}-{$name}.tmpl" ) ) {
				$template = $child_dir . "/blog-layouts/tmpl/{$slug}-{$name}.tmpl";
			}

			if ( ! $template && $name && file_exists( CHERRY_BLOG_DIR . "templates/tmpl/{$slug}-{$name}.tmpl" ) ) {
				$template = CHERRY_BLOG_DIR . "templates/tmpl/{$slug}-{$name}.tmpl";
			}

			if ( ! $template && file_exists( $child_dir . "/blog-layouts/tmpl/{$slug}.tmpl" ) ) {
				$template = $child_dir . "/blog-layouts/tmpl/{$slug}.tmpl";
			}

			if ( ! $template && file_exists( CHERRY_BLOG_DIR . "templates/tmpl/{$slug}.tmpl" ) ) {
				$template = CHERRY_BLOG_DIR . "templates/tmpl/{$slug}.tmpl";
			}

			if ( ! $template && $name && file_exists( $child_dir . "/content/{$name}.tmpl" ) ) {
				$template = $child_dir . "/content/{$name}.tmpl";
			}

			if ( ! $template && $name && file_exists( get_template_directory() . "/content/{$name}.tmpl" ) ) {
				$template = get_template_directory() . "/content/{$name}.tmpl";
			}

			if ( $template ) {
				include $template;
				$tmpl_content = ob_get_clean();
			}

			if ( function_exists( 'cherry_do_content' ) ) {
				$output = preg_replace_callback( "/%%.+?%%/", 'cherry_do_content', $tmpl_content );
			}

			echo $output;

		}

		/**
		 * Include specific layout template file
		 *
		 * @since  1.0.0
		 * @param  string $template default template name
		 */
		function view_template( $template ) {

			// Check, if is posts listing page
			$blog_template = $this->get_blog_template();

			if ( false !== $blog_template ) {
				return $blog_template;
			}

			return $template;

		}

		/**
		 * Check if we need rewrite template for the blog and get it
		 *
		 * @since  1.0.0
		 *
		 * @return bool|string  boolean false if no need to rewrite or template path
		 */
		public function get_blog_template() {

			$parsed_options = Cherry_Blog_Layouts_Data::get_parsed_options();
			$is_enabled = $parsed_options['enabled'];

			if ( 'true' !== $is_enabled ) {
				return false;
			}

			$conditionals = Cherry_Blog_Layouts::conditionals();

			$allowed_pages = $parsed_options['pages'];

			$rewrite_template = false;

			foreach ( $conditionals as $conditional ) {
				if ( in_array( $conditional, $allowed_pages ) && call_user_func( $conditional ) ) {
					$rewrite_template = true;
					Cherry_Blog_Layouts::$is_custom_layout = true;
					break;
				}
			}

			$layout_type = $parsed_options['layout_type'];

			if ( true === $rewrite_template ) {
				return $this->get_template( 'layout', $layout_type );
			}

			return false;
		}

		/**
		 * Returns the instance.
		 *
		 * @since  1.0.0
		 * @return object
		 */
		public static function get_instance() {

			// If the single instance hasn't been set, set it now.
			if ( null == self::$instance )
				self::$instance = new self;

			return self::$instance;

		}

	}

	Cherry_Blog_Template_Loader::get_instance();

}