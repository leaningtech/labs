<?php
/*
Plugin Name:  Leaning Technologies Global Navbar
Plugin URI:   https://labs.leaningtech.com
Description:  Adds the global navbar from labs to the top of the body
*/

add_action('init', 'global_navbar_init');
function global_navbar_init() {
	wp_register_style('global-navbar-css', plugins_url('dist/server/style.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'global_navbar_enqueue_scripts');
function global_navbar_enqueue_scripts() {
	wp_enqueue_style( 'global-navbar-css' );
}

add_action('wp_head', 'global_navbar_inject_head');
function global_navbar_inject_head() {
	include 'dist/server/head.html';
}

add_action('wp_body_open', 'global_navbar_inject_body');
function global_navbar_inject_body() {
	$target_id = json_encode("global-navbar");
	$js = json_encode(plugins_url('dist/client/index.js', __FILE__));

	echo "<div id='$target_id' style='display: contents'>";
	include 'dist/server/body.html';
	echo '</div>';

	// https://svelte.dev/docs/client-side-component-api
	echo "<script type='module' defer>";
	echo     "import Nav from $js;";
	echo     "new Nav({";
	echo         "target: document.getElementById($target_id),";
	echo 				 "hydrate: true,";
	echo     "});";
	echo "</script>";
}

?>
