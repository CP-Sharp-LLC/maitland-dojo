jQuery(document).ready(function($) {
    var userAgent = navigator.userAgent.toLowerCase();
    MPCEBrowser = {
        Version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        Chrome: /chrome/.test(userAgent),
        Safari: /webkit/.test(userAgent),
        Opera: /opera/.test(userAgent),
        IE: /msie/.test(userAgent) && !/opera/.test(userAgent),
        Mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

    if (MPCEBrowser.IE || MPCEBrowser.Opera) {
        $('a[href*="motopress_visual_editor"]')
            .attr('href', 'javascript:void(0);')
            .css({
                cursor: 'default',
                color: 'gray'
            });

        if (location.pathname.indexOf('edit.php') !== -1) $('.motopress_edit_link').remove();
    }
});