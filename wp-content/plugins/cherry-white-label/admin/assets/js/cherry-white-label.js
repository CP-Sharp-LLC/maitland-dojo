jQuery(function($){
"use strict";
    if ('undefined' !== typeof(optionsPageSettings))
    {
        if (optionsPageSettings.interim_url)
        {
            console.log(optionsPageSettings.interim_url);
            $('#wp-auth-check-form').data('src', optionsPageSettings.interim_url);
        }
    }

    $('[name = "visible-welcome-panel"]').bind('click', function(){
        if ($(this).prop('checked'))
        {
            $('#visible-to').show();
        }
        else
        {
            $('#visible-to').hide();
        }
    });

    $('.upload_image_button').click(function(){
        var send_attachment_bkp = wp.media.editor.send.attachment;
        var button = $(this);
        var dataBrowse = $(this).data('browse');

        if ($(button).next().hasClass('remove_image_button'))
        {
            $(button).next().remove();
        }

        wp.media.editor.send.attachment = function(props, attachment) {
            $(button).prev().children('img').attr('src', attachment.url);
            $('<button type="button" class="remove_image_button button button-cancel">Remove</button>').insertAfter(button);
            $('[name = '+dataBrowse+']').val(attachment.url);

            wp.media.editor.send.attachment = send_attachment_bkp;

            $('.remove_image_button').click(function(){
                var r = confirm("You are sure?");
                if (r == true) {
                    var src = $(this).prev().prev().children('img').attr('data-src');
                    $(this).prev().prev().children('img').attr('src', src);
                    $(this).next().val('');
                    $(this).remove();
                }
                return false;
            });
        }
        wp.media.editor.open(button);
        return false;
    });

    $('.remove_image_button').click(function(){
        var r = confirm("You are sure?");
        if (r == true) {
            var src = $(this).prev().prev().children('img').attr('data-src');
            $(this).prev().prev().children('img').attr('src', src);
            $(this).next().val('');
            $(this).remove();
        }
        return false;
    });

});