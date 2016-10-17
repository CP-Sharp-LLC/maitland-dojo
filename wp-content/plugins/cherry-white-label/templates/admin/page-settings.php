<h1><?php _e('White Label'); ?></h1>
<br/>

<?php if ( isset($error_message['error_message']) && !empty($error_message['error_message']) ) : ?>
	<div id="message" class="updated notice error is-dismissible below-h2">
		<p><?php _e($error_message['error_message']); ?></p>
		<button type="button" class="notice-dismiss">
			<span class="screen-reader-text"><?php _e('Dismiss this notice.'); ?></span>
		</button>
	</div>
<?php endif; ?>

<?php if ( isset($success_message) ): ?>
	<div id="message" class="updated notice notice-success is-dismissible below-h2">
		<p><?php _e($success_message); ?></p>
		<button type="button" class="notice-dismiss">
			<span class="screen-reader-text"><?php _e('Dismiss this notice.'); ?></span>
		</button>
	</div>
<?php endif; ?>

<form method="POST" action="">

	<h2><?php _e('Tab brand'); ?></h2>
	<hr/>

	<div class="white-label-form-wrapper">

		<h3 class="title"><?php _e( 'Admin bar' ); ?></h3>
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e( 'Hide Admin Bar logo:' ); ?></lable></td>
				<td>
					<input type="checkbox" <?php echo ( isset( $data['visible-wp-logo'] ) && 'on' == $data['visible-wp-logo'] ) ? 'checked="checked"' : ''; ?> name="visible-wp-logo"/>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e( 'Upload your Logo 16x16px:' ); ?></lable></td>
				<td>
					<div class="form-element">
						<div class="form-image">
							<?php if ( isset( $data['wp-logo-admin'] ) && ! empty( $data['wp-logo-admin'] ) ) { ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $data['wp-logo-admin']; ?>" height="<?php echo $height_image; ?>px"/>
							<?php } else { ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $image_src; ?>" height="<?php echo $height_image; ?>px"/>
							<?php } ?>
						</div>
						<button type="button" class="upload_image_button button button-primary" data-browse="wp-logo-admin"><?php _e( 'Browse' ); ?></button>
						<?php if ( isset( $data['wp-logo-admin'] ) && ! empty( $data['wp-logo-admin'] ) ) { ?>
							<button type="button" class="remove_image_button button button-cancel"><?php _e( 'Remove' ); ?></button>
						<?php } ?>
						<input type="hidden" name="wp-logo-admin" id="wp-logo-admin" value="<?php echo isset( $data['wp-logo-admin'] ) && ! empty( $data['wp-logo-admin'] ) ? $data['wp-logo-admin'] : ''; ?>"/>
					</div>
				</td>
			</tr>
			</tbody>
		</table>

		<h3 class="title"><?php _e( 'Welcome Panel settings' ); ?></h3>
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e('Add Welcome Panel logo:'); ?></lable></td>
				<td>
					<div class="form-element">
						<div class="form-image">
							<?php if (isset($data['welcome-panel-logo']) && !empty($data['welcome-panel-logo'])){ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $data['welcome-panel-logo']; ?>" height="<?php echo $height_image; ?>px" />
							<?php }else{ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $image_src; ?>" height="<?php echo $height_image; ?>px" />
							<?php } ?>
						</div>
						<button type="button" class="upload_image_button button button-primary" data-browse="welcome-panel-logo"><?php _e('Browse'); ?></button>
						<?php if (isset($data['welcome-panel-logo']) && !empty($data['welcome-panel-logo'])){ ?>
							<button type="button" class="remove_image_button button button-cancel"><?php _e('Remove'); ?></button>
						<?php } ?>
						<input type="hidden" name="welcome-panel-logo" id="welcome-panel-logo" value="<?php echo isset($data['welcome-panel-logo']) && !empty($data['welcome-panel-logo']) ? $data['welcome-panel-logo'] : '' ; ?>" />
					</div>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Welcome Panel heading:'); ?></lable></td>
				<td>
					<input type="text" name="welcome-panel-heading" <?php echo isset($data['welcome-panel-heading']) && !empty($data['welcome-panel-heading']) ? 'value="' . $data['welcome-panel-heading'] . '"' : '' ; ?> />
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Welcome Panel text:'); ?></lable></td>
				<td>
					<textarea name="welcome-panel-text"><?php echo isset($data['welcome-panel-text']) && !empty($data['welcome-panel-text']) ? $data['welcome-panel-text'] : '' ; ?></textarea>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Add your own Welcome Panel?:'); ?></lable></td>
				<td>
					<input type="checkbox" name="visible-welcome-panel" <?php echo isset($data['visible-welcome-panel']) && 'on' == $data['visible-welcome-panel'] ? 'checked="checked"' : '' ; ?> />
				</td>
			</tr>
			<tr id="visible-to" <?php echo (!isset($data['visible-welcome-panel'])) ? 'style="display:none;"' : '' ; ?>>
				<td><lable><?php _e('Visible To:'); ?></lable></td>
				<td>
					<?php if (isset($roles) && !empty($roles)){ ?>
						<select multiple size="5" name="visible-welcome-group[]">
							<?php foreach($roles as $role => $role_info){ ?>
								<option value="<?php echo $role; ?>" <?php echo (isset($role_info['selected']) && FALSE !== $role_info['selected']) ? 'selected="selected"' : '' ; ?>><?php _e($role_info['name']); ?></option>
							<?php } ?>
						</select>
					<?php } ?>
				</td>
			</tr>
			</tbody>
		</table>

		<h3 class="title"><?php _e( 'Footer' ); ?></h3>
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e('Hide Wordpress version:'); ?></lable></td>
				<td>
					<input type="checkbox" name="visible-wp-version" <?php echo isset($data['visible-wp-version']) && 'on' == $data['visible-wp-version'] ? 'checked="checked"' : '' ; ?> />
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Developer Website Name:'); ?></lable></td>
				<td>
					<input type="text" name="dev-website-name" <?php echo isset($data['dev-website-name']) && !empty($data['dev-website-name']) ? 'value="' . $data['dev-website-name'] . '"' : '' ; ?> />
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Developer Website URL:'); ?></lable></td>
				<td>
					<div class="form-element-wrapper">
						<input type="text" name="dev-website-url" <?php echo isset($data['dev-website-url']) && !empty($data['dev-website-url']) ? 'value="' . $data['dev-website-url'] . '"' : '' ; ?> />
						<p class="description" id="tagline-description"><?php _e('Example: http://your-website.com'); ?></p>
					</div>
				</td>
			</tr>
			</tbody>
		</table>

		<h3 class="title"><?php _e( 'Login' ); ?></h3>
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e('Custom login logo:'); ?></lable></td>
				<td>
					<div class="form-element">
						<div class="form-image">
							<?php if (isset($data['custom-wp-login-logo']) && !empty($data['custom-wp-login-logo'])){ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $data['custom-wp-login-logo']; ?>" height="<?php echo $height_image; ?>px" />
							<?php }else{ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $image_src; ?>" height="<?php echo $height_image; ?>px" />
							<?php } ?>
						</div>
						<button type="button" class="upload_image_button button button-primary" data-browse="custom-wp-login-logo"><?php _e('Browse'); ?></button>
						<?php if (isset($data['custom-wp-login-logo']) && !empty($data['custom-wp-login-logo'])){ ?>
							<button type="button" class="remove_image_button button button-cancel"><?php _e('Remove'); ?></button>
						<?php } ?>
						<input type="hidden" name="custom-wp-login-logo" id="custom-wp-login-logo" value="<?php echo isset($data['custom-wp-login-logo']) && !empty($data['custom-wp-login-logo']) ? $data['custom-wp-login-logo'] : '' ; ?>" />
					</div>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Login page Background:'); ?></lable></td>
				<td>
					<div class="form-element">
						<div class="form-image">
							<?php if (isset($data['background-wp-login-page']) && !empty($data['background-wp-login-page'])){ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $data['background-wp-login-page']; ?>" height="<?php echo $height_image; ?>px" />
							<?php }else{ ?>
								<img data-src="<?php echo $no_image; ?>" src="<?php echo $image_src; ?>" height="<?php echo $height_image; ?>px" />
							<?php } ?>
						</div>
						<button type="button" class="upload_image_button button button-primary" data-browse="background-wp-login-page"><?php _e('Browse'); ?></button>
						<?php if (isset($data['background-wp-login-page']) && !empty($data['background-wp-login-page'])){ ?>
							<button type="button" class="remove_image_button button button-cancel"><?php _e('Remove'); ?></button>
						<?php } ?>
						<input type="hidden" name="background-wp-login-page" id="background-wp-login-page" value="<?php echo isset($data['background-wp-login-page']) && !empty($data['background-wp-login-page']) ? $data['background-wp-login-page'] : '' ; ?>" />
					</div>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Custom login css:'); ?></lable></td>
				<td>
					<textarea name="custom-login-css"><?php echo isset($data['custom-login-css']) && !empty($data['custom-login-css']) ? $data['custom-login-css'] : '' ; ?></textarea>
				</td>
			</tr>
			</tbody>
		</table>

	</div>

	<h2><?php _e('Dashboard settings'); ?></h2>
	<hr/>
	<div class="white-label-form-wrapper">
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e('Hide Help Box:'); ?></lable></td>
				<td>
					<div class="form-element-wrapper">
						<input type="checkbox" name="visible-help-box" <?php echo isset($data['visible-help-box']) && 'on' == $data['visible-help-box'] ? 'checked="checked"' : '' ; ?> />
						<?php _e('This setting will hide "help box" bar on dashboard section'); ?>
					</div>
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Hide Screen Options:'); ?></lable></td>
				<td>
					<input type="checkbox" name="visible-screen-options" <?php echo isset($data['visible-screen-options']) && 'on' == $data['visible-screen-options'] ? 'checked="checked"' : '' ; ?> />
					<?php _e('This setting will hide "screen option" bar on dashboard section'); ?>
				</td>
			</tr>
			</tbody>
		</table>
	</div>

	<h2><?php _e('Authorization settings'); ?></h2>
	<hr/>
	<div class="white-label-form-wrapper">
		<h3 class="title"><?php _e( '' ); ?></h3>
		<table class="form-table">
			<tbody>
			<tr>
				<td><lable><?php _e('Change Admin Panel Slug:'); ?></lable></td>
				<td>
					<input type="text" name="admin-panel-slug" <?php echo isset($data['admin-panel-slug']) && !empty($data['admin-panel-slug']) ? 'value="' . $data['admin-panel-slug'] . '"' : '' ; ?> />
				</td>
			</tr>
			<tr>
				<td><lable><?php _e('Change Forgot Password Slug:'); ?></lable></td>
				<td>
					<input type="text" name="forgot-password-slug" <?php echo isset($data['forgot-password-slug']) && !empty($data['forgot-password-slug']) ? 'value="' . $data['forgot-password-slug'] . '"' : '' ; ?> />
				</td>
			</tr>
			</tbody>
		</table>
	</div>

	<hr/>
	<div>
		<?php wp_nonce_field('cherry-white-label-settings','cherry-white-label-settings-value'); ?>
		<input type="submit" class="button button-primary" value="<?php _e('Save Change'); ?>s">
	</div>
</form>