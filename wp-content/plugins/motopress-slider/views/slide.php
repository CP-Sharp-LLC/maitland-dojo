<?php
if (!defined('ABSPATH')) exit;

$menuUrl = menu_page_url($mpsl_settings['plugin_name'], false);?>

<!-- Slide options -->
<h3><?php _e('Slide Settings', 'motopress-slider'); ?></h3>
<?php
$sliderTypeClass = 'mpsl-slider-type-'. $this->slider->getSliderType();

?>
<div id="mpsl-slide-settings-tabs" class="mpsl-slide-settings-wrapper mpsl_options_wrapper <?php echo $sliderTypeClass; ?>">
    <?php $slideSettingsPrefix = 'mpsl-slide-settings-';?>
    <ul>
        <?php
            foreach($options as $groupKey=>$group){
                $hideClass = '';
                if(isset($group['hidden'])){
                    if($group['hidden']){
                        $hideClass = 'hidden';
                    }
                }
                echo '<li class="'. $hideClass .'"><a href="#' . $slideSettingsPrefix . $groupKey . '">' . $group['title'] . '</a></li>';

            }
        ?>
    </ul>
    <?php
        foreach($options as $groupKey => $group){
            $hideClass = '';
            if(isset($group['hidden'])){
                if($group['hidden']){
                    $hideClass = 'hidden';
                }
            }
        ?>
            <div class="<?php $hideClass; ?>" id="<?php echo $slideSettingsPrefix . $groupKey; ?>">
                <table class="form-table">
                    <tbody>
                <?php
                    foreach ($group['options'] as $optionKey=>$option) {
	                    if ($optionKey === 'fonts') continue;
                        ?>
                        <tr class="mpsl-option-wrapper <?php echo ($option['type'] === 'hidden') ? 'mpsl-option-wrapper-hidden' : ''; ?>">
                        <?php if (isset($option['label'])) { ?>
                            <th>
                                <?php MPSLOptionsFactory::addLabel($option); ?>
                            </th>
                            <td data-group="<?php echo $groupKey; ?>">
                                <?php MPSLOptionsFactory::addControl($option); ?>
                            </td>
                        <?php } else { ?>
                            <th data-group="<?php echo $groupKey; ?>" colspan="2" class="th-full">
                                <?php MPSLOptionsFactory::addControl($option); ?>
                            </th>
                        <?php } ?>
                        </tr>
                    <?php
                    }
                ?>
                    </tbody>
                </table>
            </div>
        <?php
        }
    ?>
</div>

<div id="mpsl-workground">
    <div class="mpsl-slider-wrapper">
        <div class="mpsl-slide-bg-wrapper"></div>
        <div class="mpsl-slide-border-wrapper">
            <div class="mpsl-slide-border"></div>
        </div>
	    <div class="mpsl-guides">
	        <div id="mpsl-guide-h"></div>
		    <div id="mpsl-guide-v"></div>
        </div>
        <?php echo get_mpsl_slider($this->sliderAlias, true, $this->getId()); ?>
    </div>
    <div class="control-panel mpsl-layer-control-panel">
        <div class="mpsl-layer-control-panel-left">
        <?php
            echo '<button type="button" class="button-secondary mpsl-add-layer mpsl-button" data-type="html" disabled>' . __('Add Text', 'motopress-slider') . '</button>';
            echo '<button type="button" class="button-secondary mpsl-add-layer mpsl-button" data-type="image" disabled>' . __('Add Image', 'motopress-slider') . '</button>';
            echo '<button type="button" class="button-secondary mpsl-add-layer mpsl-button" data-type="button" disabled>' . __('Add Button', 'motopress-slider') . '</button>';
            echo '<button type="button" class="button-secondary mpsl-add-layer mpsl-button" data-type="video" disabled>' . __('Add Video', 'motopress-slider') . '</button>';
        ?>
        </div>
        <div class="mpsl-layer-control-panel-right">
        <?php
        $duplicateTitle = '';

        echo '<button type="button" class="button-secondary mpsl-duplicate-layer mpsl-button" disabled title="'. $duplicateTitle .'">' . __('Duplicate Layer', 'motopress-slider') . '</button>';
        echo '<button type="button" class="button-secondary mpsl-delete-layer mpsl-button" disabled>' . __('Delete Layer', 'motopress-slider') . '</button>';
        echo '<button type="button" class="button-secondary mpsl-delete-all-layers mpsl-button" disabled>' . __('Delete All Layers', 'motopress-slider') . '</button>';
        ?>
        </div>
        <div class="clear"></div>
    </div>
</div>

<!-- Layer options -->
<div class="mpsl-layers-container">
<?php $this->renderLayer(); ?>
</div>

<?php $this->layerPresets->render(); ?>

<div class="mpsl-slide-control-panel">
<?php
    $sliderType = $this->slider->options['main']['options']['slider_type']['value'];
    $sliderSettingsPageUrl = add_query_arg(array('view'=>'slider', 'id'=> $this->getSliderId()), $menuUrl);
    $slidesListPageUrl = add_query_arg(array('view'=>'slides', 'id'=> $this->getSliderId()), $menuUrl);
    $ids = $this->getSiblingsSlides();
    $slideEditUrlPrev = add_query_arg(array('view' => 'slide','id' => $ids['prev']), $menuUrl);
    $slideEditUrlNext = add_query_arg(array('view' => 'slide','id' => $ids['next']), $menuUrl);

    $saveTitle = $sliderType === 'custom' ? 'Save Slide' : 'Save Template';

    echo '<button type="button" class="button-primary mpsl-button" id="save_slide">' . __($saveTitle, 'motopress-slider') . '</button>';
    echo '<button id="slider_preview" class="button-secondary mpsl-button"  data-mpsl-slider-id="'. $this->getSliderId() .'" >' . __('Preview Slide', 'motopress-slider') . '</button>';
    if ($sliderType === 'custom') {

        echo '<a class="button-secondary mpsl-button" href="' . $slideEditUrlPrev . '">' . __('&larr; Previous Slide', 'motopress-slider') . '</a>';
        echo '<a class="button-secondary mpsl-button" href="' . $slideEditUrlNext . '">' . __('&rarr; Next Slide', 'motopress-slider') . '</a>';
        echo '<a id="create_slide" class="button-secondary mpsl-button" href="#" data-slider-id="' . $this->getSliderId() . '" >' . __('New Slide', 'motopress-slider') . '</a>';
    }

    echo '<a id="slider_settings" class="button-secondary mpsl-button" href="' . $sliderSettingsPageUrl . '">' . __('Slider Settings', 'motopress-slider') . '</a>';

    if($sliderType === 'custom'){
        echo '<a class="button-secondary mpsl-button" href="' . $slidesListPageUrl . '">' . __('Close', 'motopress-slider') . '</a>';
    }else{
        echo '<a class="button-secondary mpsl-button" href="' . add_query_arg(array('view' => 'sliders') ,menu_page_url($mpsl_settings['plugin_name'], false)) . '">' . __('Close', 'motopress-slider') . '</a>';
    }


?>
</div>
<?php include $mpsl_settings['plugin_dir_path'] . 'views/preview-dialog.php'; ?>