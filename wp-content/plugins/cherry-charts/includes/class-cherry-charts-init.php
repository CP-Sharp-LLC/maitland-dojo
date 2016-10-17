<?php

/**
 * Init class for charts - register post type etc.
 *
 * @package   cherry_charts
 * @author    Cherry Team
 * @license   GPL-2.0+
 * @link      http://www.cherryframework.com/
 * @copyright 2014 Cherry Team
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // disable direct access
}

if ( !class_exists( 'cherry_charts_init' ) ) {

	/**
	 * cherry charts init class
	 *
	 * @since  1.0.0
	 */
	class cherry_charts_init {

		function __construct() {

			add_action( 'init', array( $this, '_register_post_type' ) );

			if ( is_admin() ) {
				add_action( 'current_screen', array( $this, 'meta_boxes' ), 99 );
				add_action( 'admin_enqueue_scripts', array( $this, 'admin_assets' ) );
			}

			add_action( 'wp_enqueue_scripts', array( $this, 'public_assets' ) );
			add_filter( 'cherry_compiler_static_css', array( $this, 'add_style_to_compiler' ) );

		}

		/**
		 * Register post type for charts
		 *
		 * @since 1.0.0
		 */
		function _register_post_type() {

			$labels = array(
				'name'               => __( 'Charts', 'cherry-chart' ),
				'singular_name'      => __( 'Chart', 'cherry-chart' ),
				'menu_name'          => __( 'Charts', 'admin menu', 'cherry-chart' ),
				'name_admin_bar'     => __( 'Charts', 'add new on admin bar', 'cherry-chart' ),
				'add_new'            => __( 'Add New Chart', 'cherry-chart' ),
				'add_new_item'       => __( 'Add New Chart', 'cherry-chart' ),
				'new_item'           => __( 'New Chart', 'cherry-chart' ),
				'edit_item'          => __( 'Edit Chart', 'cherry-chart' ),
				'view_item'          => __( 'View Chart', 'cherry-chart' ),
				'all_items'          => __( 'All Charts', 'cherry-chart' ),
				'search_items'       => __( 'Search Charts', 'cherry-chart' ),
				'parent_item_colon'  => __( 'Parent Charts:', 'cherry-chart' ),
				'not_found'          => __( 'No Charts found.', 'cherry-chart' ),
				'not_found_in_trash' => __( 'No Charts found in Trash.', 'cherry-chart' )
			);

			$args = array(
				'labels'               => $labels,
				'public'               => false,
				'publicly_queryable'   => false,
				'show_ui'              => true,
				'show_in_menu'         => true,
				'exclude_from_search'  => true,
				'menu_icon'            => 'dashicons-chart-pie',
				'query_var'            => true,
				'rewrite'              => false,
				'capability_type'      => 'post',
				'has_archive'          => false,
				'hierarchical'         => false,
				'menu_position'        => 20,
				'supports'             => array( 'title', 'author' )
			);

			register_post_type( 'chart', apply_filters( 'cherry_chart_post_type_args', $args ) );

		}

		/**
		 * Attach metaboxes
		 *
		 * @since 1.0.0
		 *
		 * @param object  $post  post object
		 */
		function meta_boxes() {

			global $current_screen;

			if ( 'chart' != $current_screen->id ) {
				return;
			}

			require_once 'admin/class-cherry-charts-meta-boxes.php';
			new cherry_charts_meta();
		}

		/**
		 * Enqueue admin assets
		 *
		 * @since  1.0.0
		 *
		 * @param  string  $hook  admin page hook
		 */
		function admin_assets( $hook ) {

			global $typenow, $current_screen;
			if ( 'post' != $current_screen->base || 'chart' != $current_screen->id ) {
				return;
			}

			// scripts
			wp_enqueue_script( 'handsontable', CHERRY_CHARTS_URI . 'assets/admin/js/jquery.handsontable.js', array( 'jquery' ), CHERRY_CHARTS_VERSION, true );
			wp_enqueue_script( 'cherry-charts', CHERRY_CHARTS_URI . 'assets/admin/js/script.js', array( 'jquery' ), CHERRY_CHARTS_VERSION, true );

			$progress_data = array(
				array( '', __( 'Done', 'cherry-charts' ), __( 'Total', 'cherry-charts' ) ),
				array( __( 'Value', 'cherry-charts' ), 80, 100 )
			);
			$pie_data = array(
				array( "Kia", 30 ),
				array( "Nissan", 20 ),
				array( "Toyota", 40 ),
				array( "Honda", 25 )
			);
			$bar_data = array(
				array( "", "2012", "2013", "2014", "2015" ),
				array( "Kia", 10, 11, 12, 25 ),
				array( "Nissan", 20, 15, 14, 15 ),
				array( "Toyota", 30, 15, 12, 20 ),
				array( "Honda", 25, 12, 16, 20 ),
			);

			$data = array(
				'progress_bar'   => $progress_data,
				'multi_progress' => $pie_data,
				'pie'            => $pie_data,
				'doughnut'       => $pie_data,
				'bar'            => $bar_data,
			);

			wp_localize_script( 'cherry-charts', 'cherry_charts_default', $data );

			// styles
			wp_enqueue_style(
				'cherry-ui-elements',
				CHERRY_CHARTS_URI . 'assets/css/cherry-ui.css', array(), '1.0.0' );
			wp_enqueue_style(
				'handsontable',
				CHERRY_CHARTS_URI . 'assets/admin/css/jquery.handsontable.css', array(), CHERRY_CHARTS_VERSION, 'all'
			);
			wp_enqueue_style(
				'charts-style',
				CHERRY_CHARTS_URI . 'assets/admin/css/style.css', array(), CHERRY_CHARTS_VERSION, 'all'
			);
		}

		/**
		 * Include frontend assets
		 *
		 * @since 1.0.0
		 */
		function public_assets() {
			// Scripts
			wp_register_script(
				'charts',
				CHERRY_CHARTS_URI . 'assets/public/js/min/chart.min.js', array( 'jquery' ), CHERRY_CHARTS_VERSION, true
			);
			wp_register_script(
				'charts-public',
				CHERRY_CHARTS_URI . 'assets/public/js/min/script.min.js', array( 'jquery' ), CHERRY_CHARTS_VERSION, true
			);
			// Styles
			wp_enqueue_style(
				'cherry-charts',
				CHERRY_CHARTS_URI . 'assets/public/css/cherry-charts.css', array(), CHERRY_CHARTS_VERSION
			);
		}

		/**
		 * Pass chart style handle to CSS compiler
		 *
		 * @since  1.0.0
		 *
		 * @param  array $handles CSS handles to compile
		 */
		function add_style_to_compiler( $handles ) {
			$handles = array_merge(
				array( 'cherry-charts' => CHERRY_CHARTS_URI . 'assets/public/css/cherry-charts.css' ),
				$handles
			);

			return $handles;
		}

	}

	new cherry_charts_init();
}