<?php
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
} ?>

<div id="cherry-chat-dialog" class="cherry-chat chat_box_wrap form-order-id offline">
	<div class="chat_box_heading chat_out">
		<a href="#" class="cherry-chat-control"><i class="dashicons dashicons-arrow-up-alt2"></i></a>
		<span class="cherry-chat-title"><i class="dashicons dashicons-editor-help"></i><?php _e( 'Ask Your Question', 'cherry-cherry-chat' ); ?></span>
	</div>
	<div class="chat_box_heading chat_in">
		<a href="#" class="cherry-chat-control"><i class="dashicons dashicons-arrow-down-alt2"></i></a>
		<span class="cherry-chat-title"><i class="dashicons dashicons-editor-help"></i><?php _e( 'Ask Your Question', 'cherry-cherry-chat' ); ?></span>
	</div>

	<div class="chat_box_body">
		<div class="cherry-chat-msg cherry-chat-msg-success">
			<i class="dashicons dashicons-yes"></i>
			<div class="extra-wrap">
				<?php _e( 'Your message has been sent.<br> We will reply to you shortly.' , 'cherry-cherry-chat' ); ?>
			</div>
		</div>
		<div class="cherry-chat-msg cherry-chat-msg-error">
			<i class="dashicons dashicons-yes"></i>
			<div class="extra-wrap">
				<?php _e( 'Sorry, but your message has not been sent.' , 'cherry-cherry-chat' ); ?>
			</div>
		</div>
		<form action="" method="POST" role="form" class="cherry-chat-form">
			<div class="message-after-send">
				<legend class="form-group"><?php _e( 'Please feel free to ask another question', 'cherry-cherry-chat' ); ?></legend>
			</div>
			<div class="message-before-send">
				<legend class="form-group"><?php _e( 'Thanks for contacting us!', 'cherry-cherry-chat' ); ?></legend>
				<p><?php _e( 'To better serve you, please fill out the short form.', 'cherry-cherry-chat' ); ?></p>
			</div>
			<div class="form-group">
				<input type="text" name="chat-nick" id="chat-nick" value="" placeholder="<?php _e( 'Name', 'cherry-cherry-chat' ); ?>" required tabindex="1">
			</div>
			<div class="form-group">
				<input type="text" name="chat-email" id="chat-email" value="" placeholder="<?php _e( 'Email', 'cherry-cherry-chat' ); ?>" required tabindex="2">
			</div>
			<div class="form-group form-group-preloader">
				<input type="text" name="chat-order-id" id="chat-order-id" class="LV_valid_field" value="" placeholder="<?php _e( 'Order ID', 'cherry-cherry-chat' ); ?>" tabindex="3">
				<span class="optional"><?php _e( 'Optional', 'cherry-cherry-chat' ); ?></span>
				<span class="preloader"></span>
			</div>
			<div class="form-group full-width">
				<input type="text" name="chat-subject" id="chat-subject" value="" placeholder="<?php _e( 'Subject', 'cherry-cherry-chat' ); ?>" required tabindex="4">
			</div>
			<div class="form-group full-width">
				<textarea name="chat-message" id="chat-message" placeholder="<?php _e( 'Message', 'cherry-cherry-chat' ); ?>" required tabindex="5"></textarea>
			</div>
			<div class="form-group">
				<input type="button" name="chat-start" value="<?php _e( 'Submit', 'cherry-cherry-chat' ); ?>" class="start_chat disabled" tabindex="6" disabled>
			</div>
			<div class="status-group">
				<i class="status-marker"></i><span class="chat_operator_status"><?php _e( 'operator is offline', 'cherry-cherry-chat' ); ?></span>
			</div>
		</form>
	</div>

</div>