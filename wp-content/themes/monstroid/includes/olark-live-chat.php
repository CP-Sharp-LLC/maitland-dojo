<?php
/**
 * Add logic for a `Olark Live Chat`.
 */
add_filter( 'cherry_defaults_settings', 'monstroid_add_olark_chat_options',    11 );
add_action( 'wp_footer',                'monstroid_print_olark_chat_code',   9999 );
add_filter( 'body_class',               'monstroid_add_olark_chat_body_class', 99 );

function monstroid_add_olark_chat_options( $sections_array ) {
	$options = array();

	$options['olark-chat-switcher'] = array(
		'type'        => 'switcher',
		'title'       => __( 'Enable Olark live chat', 'monstroid' ),
		'description' => __( 'Enable Olark live chat (frontend only).', 'monstroid' ),
		'value'       => 'false',
		'toggle'      => array(
			'true_toggle'  => __( 'Enabled', 'monstroid' ),
			'false_toggle' => __( 'Disabled', 'monstroid' ),
			'true_slave'   => 'olark-chat-switcher-true-slave',
			'false_slave'  => 'olark-chat-switcher-false-slave',
		),
	);
	$options['olark-chat-id'] = array(
		'type'        => 'text',
		'title'       => __( 'Olark live chat ID', 'monstroid' ),
		'description' => __( 'To enable Olark live chat enter your live chat account ID here.', 'monstroid' ) . sprintf( " <a href='http://www.olark.com/?r=ad8fbsj2' target='_blank'>%s</a>", __( 'Get own account ID.', 'monstroid' ) ),
		'value'       => '',
		'master'      => 'olark-chat-switcher-true-slave',
	);

	$sections_array['olark-chat-section'] = array(
		'name'         => __( 'Olark Live Chat', 'monstroid' ),
		'icon'         => 'dashicons dashicons-format-status',
		'priority'     => 125,
		'options-list' => apply_filters( 'monstroid_olark_chat_options_list', $options ),
	);

	return $sections_array;
}


function monstroid_print_olark_chat_code() {
	$chat_status = cherry_get_option( 'olark-chat-switcher', 'false' );

	if ( 'false' === $chat_status ) {
		return;
	}

	$chat_id = cherry_get_option( 'olark-chat-id' );

	if ( ! $chat_id ) {
		return;
	} ?>
	<script data-cfasync="false" type='text/javascript'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){
	f[z]=function(){
	(a.s=a.s||[]).push(arguments)};var a=f[z]._={
	},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){
	f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={
	0:+new Date};a.P=function(u){
	a.p[u]=new Date-a.p[0]};function s(){
	a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){
	hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){
	return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){
	b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{
	b.contentWindow[g].open()}catch(w){
	c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{
	var t=b.contentWindow[g];t.write(p());t.close()}catch(x){
	b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({
	loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
	/* custom configuration goes here (www.olark.com/documentation) */
	olark.identify('<?php echo esc_attr( $chat_id ); ?>');/*]]>*/</script><noscript><a href="https://www.olark.com/site/<?php echo $chat_id; ?>/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>
	<?php
}

function monstroid_add_olark_chat_body_class( $classes ) {
	$chat_status = cherry_get_option( 'olark-chat-switcher', 'false' );

	if ( 'false' === $chat_status ) {
		return $classes;
	}

	$chat_id = cherry_get_option( 'olark-chat-id' );

	if ( ! $chat_id ) {
		return $classes;
	}

	$classes[] = 'olark-live-chat-support';

	return $classes;
}