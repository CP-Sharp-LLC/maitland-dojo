<?php
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
} ?>

<div id="cherry-chat-dialog" class="cherry-chat chat_box_wrap online order">

	<div class="chat_box_heading chat_out">
		<a href="#" class="cherry-chat-control"><i class="dashicons dashicons-arrow-up-alt2"></i></a>
		<span class="cherry-chat-title"><i class="dashicons dashicons-format-chat"></i><?php _e( 'Live Chat', 'cherry-live-chat' ); ?></span>
	</div>
	<div class="chat_box_heading chat_in">
		<a href="#" class="cherry-chat-control"><i class="dashicons dashicons-arrow-down-alt2"></i></a>
		<span class="cherry-chat-title"><i class="dashicons dashicons-format-chat"></i><?php _e( 'Live Chat', 'cherry-live-chat' ); ?></span>
	</div>

	<div class="chat_box_body">

		<div class="cherry-chat-accordion">
			<div class="cherry-chat-accordion-item first-item">
				<div>
					<form action="" method="POST" role="form" class="cherry-chat-form">
						<legend class="form-group-alt"><?php _e( 'Please feel free to ask another question', 'cherry-live-chat' ); ?></legend>
						<div class="legend">
							<legend><?php _e( 'Thanks for contacting us!', 'cherry-live-chat' ); ?></legend>
							<p><?php _e( 'To better serve you, please provide your order id.', 'cherry-live-chat' ); ?></p>
						</div>
						<div class="form-group form-group-preloader">
							<input type="text" name="chat-order-id" id="chat-order-id" class="required-field" placeholder="<?php _e( 'Enter Your Order ID', 'cherry-live-chat' ); ?>" tabindex="1">
							<span class="preloader"></span>
						</div>
						<div id="pr-type-group" class="form-group hidden"></div>
						<div class="form-group">
							<input type="button" name="chat-start" value="<?php _e( 'Start Chat', 'cherry-live-chat' ); ?>" class="start_chat disabled" tabindex="3" disabled>
							<input type="button" name="chat-start-order" value="<?php _e( 'Start Chat', 'cherry-live-chat' ); ?>" class="start_chat_order disabled" tabindex="3" disabled>
						</div>
					</form>
				</div>
			</div>

			<div class="order-id-switch-wrap">
				<strong><?php _e( "Have an order ID", 'cherry-live-chat' ); ?></strong> <a href="#" class="order-id-switch"><?php _e( 'Click here', 'cherry-live-chat' ); ?></a>
			</div>
			<strong><?php _e( "New client or can't find your order ID?", 'cherry-live-chat' ); ?> <a href="#" class="order-id-switch order-id-switch-alt"><?php _e( 'Click here', 'cherry-live-chat' ); ?></a></strong>

			<div class="cherry-chat-accordion-item second-item">
				<div>
					<form action="" method="POST" role="form" class="cherry-chat-form">
						<div class="legend">
							<p><?php _e( 'To better serve you, please fill out the short form.', 'cherry-live-chat' ); ?></p>
						</div>
						<div class="form-group">
							<input type="text" name="chat-nick" id="chat-nick" placeholder="<?php _e( 'Name', 'cherry-live-chat' ); ?>" required tabindex="1">
						</div>
						<div class="form-group">
							<input type="text" name="chat-email" id="chat-email" placeholder="<?php _e( 'Email', 'cherry-live-chat' ); ?>" required tabindex="2">
						</div>
						<div class="form-group">
							<input type="button" name="chat-start" value="<?php _e( 'Start Chat', 'cherry-live-chat' ); ?>" class="start_chat disabled" tabindex="3" disabled>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="status-group">
			<i class="status-marker"></i><span class="chat_operator_status"><?php _e( 'operator is online', 'cherry-live-chat' ); ?></span>
		</div>
	</div>

</div>