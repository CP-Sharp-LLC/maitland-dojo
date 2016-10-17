<?php if (!defined('ABSPATH')) exit;?>
<div class="mpsl-layer-settings-wrapper mpsl_layers_wrapper">
    <table class="table widefat">
        <thead>
            <th colspan="3"><?php _e('Layer Settings', 'motopress-slider');?></th>
        </thead>
        <tbody>
            <?php $generalLayerOptions = $this->layerOptions['general']['options'];?>
            <tr data-group="general">
                <td class="position" width="190">
                    <div class="mpsl-option-wrapper mpsl-hidden">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['type']); ?>
                    </div>
                    <div class="mpsl-option-wrapper mpsl-hidden">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['private_styles']); ?>
                    </div>
<!--                    <div class="mpsl-option-wrapper mpsl-hidden">-->
<!--                        --><?php //MPSLOptionsFactory::addControl($generalLayerOptions['id']); ?>
<!--                    </div>-->
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['align']); ?>
                    </div>

                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['width']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['html_width']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
	                    <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['white-space']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['white-space']); ?>
                    </div>

                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_width']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_height']); ?>
                    </div>
                    <div class="mpsl-hide-resize-wrapper">
                        <div class="mpsl-option-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['resizable']); ?>
                        </div>
                        <div class="mpsl-option-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['dont_change_position']); ?>
                        </div>
                        <div class="mpsl-option-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['hide_width']); ?>
                        </div>
                    </div>
                </td>
                <td class="animation" width="280">
                    <div class="mpsl-group-animation-wrappers">
                        <div class="mpsl-option-wrapper mpsl-animation-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['start_animation']); ?>
                            <div class="mpsl-easing-duration-wrapper">
                                <?php MPSLOptionsFactory::addControl($generalLayerOptions['start_timing_function']); ?>
                                <?php MPSLOptionsFactory::addControl($generalLayerOptions['start_duration']); ?>
                            </div>
                        </div>

                        <div class="mpsl-option-wrapper ">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['start_animation_group']); ?>
                        </div>
                    </div>
                    <div class="mpsl-group-animation-wrappers">
                        <div class="mpsl-option-wrapper mpsl-animation-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['end_animation']); ?>
                            <div class="mpsl-easing-duration-wrapper">
                                <?php MPSLOptionsFactory::addControl($generalLayerOptions['end_timing_function']); ?>
                                <?php MPSLOptionsFactory::addControl($generalLayerOptions['end_duration']); ?>
                            </div>
                        </div>
                        <div class="mpsl-option-wrapper ">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['end_animation_group']); ?>
                        </div>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="mpsl-hide-display-wrapper">
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['start']); ?>
                            <?php MPSLOptionsFactory::addControl($generalLayerOptions['end']); ?>
                        </div>
                    </div>



                    <div class="mpsl-option-wrapper">
                        <div class="mpsl-duration-info">
                            <?php echo "Slide duration (ms): " . $this->slider->options['main']['options']['slider_delay']['value']; ?>
                        </div>
                    </div>
                </td>
                <td class="type" width="320">
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['text']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['text']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['button_text']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['button_text']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['button_link']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['button_link']); ?>
                    </div>
                    <?php if(isset($generalLayerOptions['button_autolink'])){?>
	                <div class="mpsl-option-wrapper">
<!--                        <div class="label-wrapper">-->
<!--                            --><?php //MPSLOptionsFactory::addLabel($generalLayerOptions['button_autolink']); ?>
<!--                        </div>-->
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['button_autolink']); ?>
                    </div>
                    <?php }?>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['button_target']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_id']); ?>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_url']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_type']);?>
                    </div>
                    <!--<div class="mpsl-option-wrapper">-->
                        <?php // MPSLOptionsFactory::addControl($generalLayerOptions['video_id']);?>
                    <!--</div>-->
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_src_mp4']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_src_mp4']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_src_webm']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_src_webm']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_src_ogg']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_src_ogg']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['vimeo_src']);?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['youtube_src']);?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_preview_image']); ?>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_preview_image']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_autoplay']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_autoplay']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
						<?php MPSLOptionsFactory::addControl($generalLayerOptions['video_loop']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_loop']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_mute']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_mute']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_html_hide_controls']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_html_hide_controls']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_youtube_hide_controls']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_youtube_hide_controls']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['video_disable_mobile']); ?>
						<?php MPSLOptionsFactory::addLabel($generalLayerOptions['video_disable_mobile']); ?>
                    </div>
	                <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['image_link']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_link']); ?>
                    </div>
                    <?php if(isset($generalLayerOptions['image_autolink'])){ ?>
                    <div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_autolink']); ?>
                    </div>
                    <?php }?>
					<div class="mpsl-option-wrapper">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_target']); ?>
                    </div>
	                <div class="mpsl-option-wrapper mpsl-option-wrapper-preset">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['preset']); ?>
                    </div>
                    <div class="mpsl-option-wrapper mpsl-hidden">
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['private_preset_class']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['classes']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['classes']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['image_link_classes']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['image_link_classes']); ?>
                    </div>

	                <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['html_style']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['html_style']); ?>
                    </div>
                    <div class="mpsl-option-wrapper">
                        <div class="label-wrapper">
                            <?php MPSLOptionsFactory::addLabel($generalLayerOptions['button_style']); ?>
                        </div>
                        <?php MPSLOptionsFactory::addControl($generalLayerOptions['button_style']); ?>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!--<div class="mpsl-layers-list-wrapper mpsl-col-md-4">-->
<div class="mpsl-layers-list-wrapper">
    <table class="widefat mpsl-layers-table-head">
        <thead>
        <tr>
            <th colspan="2"><?php _e('Layers Sorting (drag to set an order)', 'motopress-slider'); ?></th>
        </tr>
        </thead>
    </table>

    <div class="mpsl-layers-list-child-wrapper">
        <table class="widefat mpsl-layers-table">
            <tbody></tbody>
        </table>
    </div>
</div>