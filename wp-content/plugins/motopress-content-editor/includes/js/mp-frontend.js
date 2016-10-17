(function($){
    $(function(){
		var FULLWIDTH_CLASS = 'mp-row-fullwidth',
            FULLWIDTH_CONTENT_CLASS = 'mp-row-fullwidth-content',
            FIXED_WIDTH_CONTENT_CLASS = 'mp-row-fixed-width-content';

	    var resetRow = function(el) {
		    el.css({
			    'width': '',
			    'padding-left': '',
			    'margin-left': '',
			    'padding-right': '',
			    'margin-right': ''
		    });
	    };


                motopressUpdateFullwidthRow();

        if ( parent.hasOwnProperty('MP') && parent.MP.hasOwnProperty('Editor') ) {
            parent.MP.Editor.onIfr('Resize EditorLoad', function() {
                motopressUpdateFullwidthRow();
            });
        }
            var motopressUpdateFullwidthRowTimeout;
            $(window).resize(function(){
                if ( motopressUpdateFullwidthRowTimeout ) clearTimeout( motopressUpdateFullwidthRowTimeout );
                motopressUpdateFullwidthRowTimeout = setTimeout(function() {
                    motopressUpdateFullwidthRow();
                }, 500);
            });

        function motopressUpdateFullwidthRow() {
	        var fullWidthRows = $('.mp-row-fluid.' + FULLWIDTH_CLASS + ', .mp-row-fluid.' + FULLWIDTH_CONTENT_CLASS + ', .mp-row-fluid.' + FIXED_WIDTH_CONTENT_CLASS);

	        $.each(fullWidthRows, function() {
		        var $html = $('html');
		        var $row = $(this);
		        var rowWidth = $html.width();

	            resetRow($row);

                var isFullWidthContent = $row.hasClass(FULLWIDTH_CONTENT_CLASS);
                var isFixedWidthContent = $row.hasClass(FIXED_WIDTH_CONTENT_CLASS);

                var rowOffsetLeft = $row.offset().left;
                var rowOffsetRight = rowWidth - rowOffsetLeft - $row.width();
		        var rowPaddingLeft, rowPaddingRight;

		        rowPaddingLeft = rowPaddingRight = ''; 

	            if (isFixedWidthContent) { 
			        var $clmns = $row.children('.motopress-clmn');

			        if ($clmns.length) {
				        var clmnsWidth, leftoverPadding, _rowPaddingLeft, _rowPaddingRight;

				        $row.css('max-width', parseInt(MPCEVars.fixed_row_width));
				        clmnsWidth = $row.innerWidth();
				        $row.css('max-width', '');
				        $row.css('width', rowWidth);

				        rowPaddingLeft = parseInt($row.css('padding-left'));
				        rowPaddingRight = parseInt($row.css('padding-right'));

				        leftoverPadding = ($row.innerWidth() - rowPaddingLeft - rowPaddingRight - clmnsWidth) / 2;
				        leftoverPadding = leftoverPadding > 0 ? leftoverPadding : 0;

				        _rowPaddingLeft = rowPaddingLeft + leftoverPadding;
				        _rowPaddingRight = rowPaddingRight + leftoverPadding;

						rowPaddingLeft = _rowPaddingLeft > 0 ? _rowPaddingLeft : rowPaddingLeft;
						rowPaddingRight = _rowPaddingRight > 0 ? _rowPaddingRight : rowPaddingRight;
			        }

		        } else if (!isFullWidthContent) { 
			        rowPaddingLeft = rowOffsetLeft - parseInt($row.css('border-left-width')) + parseInt($row.css('padding-left'));
	                rowPaddingRight = rowOffsetRight - parseInt($row.css('border-right-width')) - parseInt($row.css('padding-right'));
	            }

		        $row.css({
                    'width': rowWidth,
                    'padding-left': rowPaddingLeft,
                    'margin-left': -rowOffsetLeft,
                    'padding-right': rowPaddingRight,
                    'margin-right': -rowOffsetRight
                });
            });

            $(window).trigger('mpce-row-size-update');
        }
    });

})(jQuery);
jQuery(window).load(function() {

	if (typeof jQuery.fn.stellar === 'undefined') return false;

    jQuery.stellar({
        horizontalScrolling: false,
        verticalScrolling: true,
        responsive: true
    });
});
jQuery(window).load(function(){
    mpFixBackgroundVideoSize();
});
jQuery(window).resize(function(){
    if(this.mpResizeTimeout) clearTimeout(this.mpResizeTimeout);
    this.mpResizeTimeout = setTimeout(function() {
        jQuery(this).trigger('mpResizeEnd');
    }, 500);
});
jQuery(window).on('mpResizeEnd mpce-row-size-update', function(){
    mpFixBackgroundVideoSize();
});
function onYouTubeIframeAPIReady() {
    mpInitYouTubePlayers();
}

function mpInitYouTubePlayers(players) {

    if (typeof players === 'undefined') {
        players = jQuery('.mp-video-container>.mp-youtube-container>.mp-youtube-video');
    }
    players.each(function(index, player) {
        $player = jQuery(player);
        var ytplayer = new YT.Player(players[index], {
            videoId : $player.attr('data-src'),
            events : {
                'onReady' : mpCreateYTEvent(index )
            }
        });
        $player.data('ytplayer', ytplayer);
    });

    function mpCreateYTEvent(index){
        return function(evt){
            $player = jQuery(players[index]);
            if ($player.attr('data-mute') === '1') {
                evt.target.mute();
            }
        }
    }
}
jQuery('.mp-video-container').on('click', function(e){
    if (jQuery(this).children('video').length) {
        var player = jQuery(this).children('video')[0];
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    } else {
        var player = jQuery(this).find('iframe.mp-youtube-video').data('ytplayer');
        if (player) {
            if (player.getPlayerState() === 2) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        }
    }
});
jQuery('.mp-row-video').on('click', function(e){
    if (jQuery(e.target).is('.mp-row-fluid') ) {
        jQuery(this).children('.mp-video-container').trigger('click');
    } else if(jQuery(e.target).is('[class*=mp-span]')){
        jQuery(this).closest('.mp-row-video').children('.mp-video-container').trigger('click');
    }
});
function mpFixBackgroundVideoSize(videos){
    if (typeof videos === 'undefined') {
        videos = jQuery('.mp-video-container');
    }
    jQuery.each(videos, function(index){
        mpFixVideoSize(videos[index]);
    });
}

function mpRememberOriginalSize(video) {
    if (!video.originalsize) {
        video.originalsize = {width : video.width(), height : video.height()};
    }
}

function mpFixVideoSize(div) {
    var video, fixHeight;

    if (jQuery(div).children().is('video')) {
        video = jQuery(div).children();
    } else {
        video = jQuery(div).find('iframe');
        if (!video.length){
            video = jQuery(div).find('img');
        }
    }

    mpRememberOriginalSize(video);

    var targetwidth = jQuery(div).width();
    var targetheight = jQuery(div).height();
    var srcwidth = video.originalsize.width;
    var srcheight = video.originalsize.height;
    var scaledVideo = mpScaleVideo(srcwidth, srcheight, targetwidth, targetheight);

    jQuery(div).find('.mp-youtube-container').height(scaledVideo.height);
    jQuery(div).find('.mp-youtube-container').width(scaledVideo.width);
    video.width(scaledVideo.width);
    video.height(scaledVideo.height);
    video.css("max-width", scaledVideo.width);
    jQuery(video).css("left", scaledVideo.targetleft);
    jQuery(video).css("top", scaledVideo.targettop);
}

function mpScaleVideo(srcwidth, srcheight, targetwidth, targetheight) {

    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    var fScaleOnWidth = (scaleX2 <= targetwidth);

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}
(function ($) {
    $(document).ready(function () {

	    var isEditor = parent.hasOwnProperty('MP') && parent.MP.hasOwnProperty('Editor');
	    var magnificPopupExists = typeof $.fn.magnificPopup !== 'undefined';

	    if (!isEditor && magnificPopupExists) {

		    $('[data-action="motopressLightbox"]').magnificPopup({
			    type: 'image',
			    closeOnContentClick: true,
			    mainClass: 'mfp-img-mobile',
			    image: {
				    verticalFit: true
			    }

		    });

		    $('[data-action="motopressGalleryLightbox"]').magnificPopup({
			    type: 'image',
			    mainClass: 'mfp-img-mobile',
			    gallery: {
				    enabled: true,
				    navigateByImgClick: true,
				    preload: [0, 1] 
			    }
		    });

		    var modalButtons = $('[data-action="motopress-modal"]');
		    modalButtons.each(function() {
			    var modalButton = $(this);
			    var showAnimation = modalButton.attr('data-mfp-show-animation').length ? ' ' + modalButton.attr('data-mfp-show-animation') : '';
			    var hideAnimation = modalButton.attr('data-mfp-hide-animation').length ? ' ' + modalButton.attr('data-mfp-hide-animation') : '';
			    var hideAnimationDuration = hideAnimation !== '' ? 500 : 0; 
			    var modalStyle = modalButton.attr('data-modal-style');
			    var uniqid = modalButton.attr('data-uniqid');
			    var uniqueClass = ' motopress-modal-' + uniqid;

			    modalButton.magnificPopup({
				    key: 'motopress-modal-obj',
				    mainClass: 'motopress-modal' + uniqueClass + ' ' + modalStyle,
				    midClick: true,
				    closeBtnInside: false,
				    fixedBgPos: true,
				    removalDelay: hideAnimationDuration,
				    closeMarkup: '<button title="%title%" class="motopress-modal-close"></button>',
				    callbacks: {
					    beforeOpen: function() {
						    modalButton.attr('disabled', true);
						    if (showAnimation) {
							    var background = $(this.bgOverlay);
							    var wrapper = $(this.wrap);
							    background.add(wrapper)
								    .addClass(showAnimation)
								    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
									    $(this).removeClass(showAnimation);
								    });
						    }
					    },
					    beforeClose: function() {
						    if (hideAnimation) {
							    var background = $(this.bgOverlay);
							    var wrapper = $(this.wrap);
							    background.add(wrapper)
								    .addClass(hideAnimation)
								    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
									    $(this).removeClass(hideAnimation);
								    });
						    }
					    },
					    afterClose: function() {
						    modalButton.removeAttr('disabled');
					    }
				    }
			    });
		    });

		    var waypointExists = typeof $.fn.waypoint !== 'undefined';
		    if (waypointExists) {
			    var popupTriggers = $('.motopress-popup-trigger');
			    popupTriggers.each(function() {
				    var popupTrigger = $(this);
				    var delay = popupTrigger.attr('data-delay').length ? parseInt(popupTrigger.attr('data-delay')) : 0;
				    var showAnimation = popupTrigger.attr('data-mfp-show-animation').length ? ' ' + popupTrigger.attr('data-mfp-show-animation') : '';
				    var hideAnimation = popupTrigger.attr('data-mfp-hide-animation').length ? ' ' + popupTrigger.attr('data-mfp-hide-animation') : '';
				    var hideAnimationDuration = hideAnimation !== '' ? 500 : 0; 
				    var modalStyle = popupTrigger.attr('data-modal-style');
				    var uniqid = popupTrigger.attr('data-uniqid');
				    var uniqueClass = ' motopress-modal-' + uniqid;
				    var customClasses = popupTrigger.attr('data-custom-classes');

				    popupTrigger.waypoint(function(direction) {
					    this.enabled = false;
					    clearTimeout(window.motopressPopupTimeout);
					    window.motopressPopupTimeout = setTimeout(function() {

						    popupTrigger.magnificPopup({
							    key: 'motopress-popup-obj' + uniqid,
							    mainClass: 'motopress-modal ' + modalStyle + ' ' + customClasses + uniqueClass,
							    closeBtnInside: false,
							    fixedBgPos: true,
							    removalDelay: hideAnimationDuration,
							    closeMarkup: '<button title="%title%" class="motopress-modal-close"></button>',
							    items: {
								    src: '#motopress-modal-content-' + uniqid,
								    type: 'inline'
							    },
							    callbacks: {
								    beforeOpen: function() {
									    if (showAnimation) {
										    var background = $(this.bgOverlay);
										    var wrapper = $(this.wrap);
										    background.add(wrapper)
											    .addClass(showAnimation)
											    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
												    $(this).removeClass(showAnimation);
											    });
									    }
								    },
								    beforeClose: function() {
									    if (hideAnimation) {
										    var background = $(this.bgOverlay);
										    var wrapper = $(this.wrap);
										    background.add(wrapper)
											    .addClass(hideAnimation)
											    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
												    $(this).removeClass(hideAnimation);
											    });
									    }
								    },
								    open: function() {
									    if (typeof MPCECookies !== 'undefined') {
										    var showOnceCoockie = popupTrigger.attr('data-show-once');
										    if (typeof showOnceCoockie !== 'undefined') {
											    MPCECookies.set(showOnceCoockie, 'true');
										    }
									    }
								    }
							    }
						    }).magnificPopup('open');
						    clearTimeout(window.motopressPopupTimeout);
					    }, delay);

				    }, {
					    offset: "100%",
					    continuous: false,
					    group: 'motopress-popups'
				    });
			    });
		    }

	    }

    });
})(jQuery);

jQuery(document).ready(function(){
    jQuery(window).resize(function(){
        if(this.mpGridGalleryResizeTimeout) clearTimeout(this.mpGridGalleryResizeTimeout);
        this.mpGridGalleryResizeTimeout = setTimeout(function() {
            jQuery(this).trigger('mpGridGalleryResizeEnd');
        }, 500);
    });
    jQuery(window).on('mpGridGalleryResizeEnd', function(){
        mpRecalcGridGalleryMargins();
    });
});
function mpRecalcGridGalleryMargins(gridGalleries){
    if (typeof(gridGalleries) === 'undefined'){
        gridGalleries = jQuery('.motopress-grid-gallery-obj.motopress-grid-gallery-need-recalc');
    }
    if (gridGalleries.length) {
        gridGalleries.each(function(index, el){
            var spanMarginLeft = jQuery(jQuery(el).find('[class*="mp-span"]').get(1)).css('margin-left');
            var rows = jQuery(el).find('.mp-row-fluid').not(':first.mp-row-fluid');
            rows.css('margin-top', spanMarginLeft);
        });
    }
}
jQuery(document).ready(function() {
    if (typeof jQuery.fn.waypoint !== "undefined") {

        jQuery(".motopress-cta.motopress-need-animate").waypoint({
            offset: "85%",
            handler: function() {
                this.enabled = false; 
                var animation = jQuery(this.element).data("animation");
                jQuery(this.element).addClass("motopress-animation-" + animation);
                jQuery(this.element).find("[data-animation]").each(function() {
                    var child_animation = jQuery(this).data("animation");
                    jQuery(this).addClass("motopress-animation-" + child_animation);
                });
            }
        });

        jQuery(".motopress-ce-icon-obj.motopress-need-animate").waypoint(function(){
            this.enabled = false;  
            var animation = jQuery(this.element).attr('data-animation');
            jQuery(this.element).addClass('motopress-animation-' + animation);
        },{
            offset: "98%"
        });

    } 
});
( function($) {
    $('.motopress-share-buttons a').click(function(){
        var thisOne = $(this),
            thisName = thisOne.attr('title'),
            thisLink = null,
            pageLink = encodeURIComponent(document.URL);

        if (thisName === 'Facebook') {
            thisLink = 'https://www.facebook.com/sharer/sharer.php?u=';
        }else if (thisName === 'Twitter') {
            thisLink = 'https://twitter.com/share?url=';
        }else if (thisName ==='Google +' ) {
            thisLink = 'https://plus.google.com/share?url=';
        }else if (thisName === 'Pinterest') {
            thisLink = '//www.pinterest.com/pin/create/button/?url=';
        }

        motoOpenShareWindow(thisLink+pageLink, thisName);

        return false;
    });
    function motoOpenShareWindow(link, name) {
        var leftvar = (screen.width-640)/2;
        var topvar = (screen.height-480)/2;
        openWindow = window.open(link, name, 'width=640,height=480,left='+leftvar+',top='+topvar+',status=no,toolbar=no,menubar=no,resizable=yes');
    }

} )(jQuery);
jQuery(document).ready(function($) {
	$('.motopress-google-map-obj')
		.on('click', function() {
			$(this).find('iframe').addClass('mpce-clicked')
		})
		.on('mouseleave', function() {
			$(this).find('iframe').removeClass('mpce-clicked')
		});
});
(function() {

	if (typeof google === 'undefined') return false;

    var PIE_HOLE    =  0.5,
        MIN_HEIGHT  =  200,
        EMPTY_CHART =  "No Data";

    google.load('visualization', '1');

    if (motopressGoogleChartsPHPData.motopressCE === '1') {
        google.motopressDrawChart = function( id ) {

            var verticalSize, item, motopressGoogleChartData,
                chartObject, validData, wrapper;

            if ( arguments.length !== 0 ) {
                verticalSize = arguments[1];
            }

            item = jQuery(document.getElementById( id ));
            motopressGoogleChartData = jQuery.parseJSON( item.attr('data-chart') ) || {};

            motopressGoogleChartData.height = MIN_HEIGHT;
            if ( verticalSize !== null ) {
                motopressGoogleChartData.height = verticalSize;
            }

            chartObject = {};
            validData = validateData( motopressGoogleChartData.table );
            chartObject.chartType = chartType( motopressGoogleChartData.type );

            if (validData === true) {
                chartObject.dataTable = motopressGoogleChartData.table;
            }else {
                chartObject.dataTable = null;
            }
            chartObject.options = { 'title': motopressGoogleChartData.title, 'height': motopressGoogleChartData.height, 'colors': motopressGoogleChartData.colors };
            if (motopressGoogleChartData.backgroundColor !== null) {
                chartObject.options.backgroundColor = {'fill' : 'transparent'};
            }
            if (motopressGoogleChartData.type == 'PieChart3D') {
                chartObject.options.is3D = true;
            }
            if (motopressGoogleChartData.donut != false && motopressGoogleChartData.donut !== 'false') {
                chartObject.options.pieHole = PIE_HOLE;
            }
            chartObject.containerId = motopressGoogleChartData.ID;

            if ( chartObject.dataTable !== null ) {
                wrapper = new google.visualization.ChartWrapper(chartObject);
                wrapper.draw();
                item.addClass('motopress-google-chart-loaded');
            } else {
                item.toggleClass('motopress-empty-chart').text(EMPTY_CHART);
            }
        };
    }

    var motopressDrawCharts = function() {
        jQuery('.motopress-google-chart').each(function() {

            var jQThis = jQuery(this),
                motopressGoogleChartData = jQuery.parseJSON( jQThis.attr('data-chart') ) || {},
                parentElement, heightFinder, chartObject,
                validData, prepareData, wrapper;

            if (motopressGoogleChartsPHPData.motopressCE === '0') {
                parentElement  = jQThis.parent();
                heightFinder = parentElement.attr('style');
                if (heightFinder !== undefined) {
                    heightFinder = heightFinder.split('min-height:');
                    heightFinder = heightFinder[1].split("px;");
                    motopressGoogleChartData.height = Number(heightFinder[0]);
                }else {
                    motopressGoogleChartData.height = MIN_HEIGHT;
                }
            }else if (motopressGoogleChartsPHPData.motopressCE === '1') {
                motopressGoogleChartData.height = jQThis.parent().parent().height();
                if ( motopressGoogleChartData.height < 100 ) {
                    motopressGoogleChartData.height = MIN_HEIGHT;
                }
            }

            chartObject = {};

            validData = validateData( motopressGoogleChartData.table );
            chartObject.chartType = chartType( motopressGoogleChartData.type );

            if (validData === true) {
                chartObject.dataTable = motopressGoogleChartData.table;
            }else {
                chartObject.dataTable = null;
            }
            chartObject.options = { 'title': motopressGoogleChartData.title, 'height': motopressGoogleChartData.height, 'colors' : motopressGoogleChartData.colors };
            if (motopressGoogleChartData.backgroundColor !== null) {
                chartObject.options.backgroundColor = {'fill' : 'transparent'};
            }
            if (motopressGoogleChartData.type == 'PieChart3D') {
                chartObject.options.is3D = true;
            }
            if (motopressGoogleChartData.donut != false && motopressGoogleChartData.donut !== 'false') {
                chartObject.options.pieHole = 0.5;
            }
            chartObject.containerId = motopressGoogleChartData.ID;

            if ( chartObject.dataTable !== null ) {
                wrapper = new google.visualization.ChartWrapper(chartObject);
                wrapper.draw();
                jQThis.addClass('motopress-google-chart-loaded');
            } else {
                jQThis.addClass('motopress-empty-chart').text(EMPTY_CHART);
            }
        });
    },

    validateData = function(dataToValidate) {
        var ethalon = null;
        if (dataToValidate) {
            for (i = 0; i < dataToValidate.length; i++) {
                ethalon = dataToValidate[0].length;
                if ( (dataToValidate.length === 1 && dataToValidate[0][0] === null )  || ethalon != dataToValidate[i].length ) {
                  return false;
                }
            }
            return true;
        }
        return false;
    },

    chartType = function(type) {
        var chart = null;
        if (type == 'PieChart3D') {
            type = 'PieChart';
        }
        return type;
    };

    google.setOnLoadCallback( motopressDrawCharts );

    if (motopressGoogleChartsPHPData.motopressCE === '0') {
        jQuery(document).ready(function () {
            var timer;
            jQuery(window).resize(function(e) {
                timer && clearTimeout( timer );
                timer = setTimeout(motopressDrawCharts, 100);
            });
        });
    }

    if (motopressGoogleChartsPHPData.motopressCE === '1') {
        jQuery(document).ready(function () {
            var timer;
                jQuery(document).on("resize", ".motopress-content-wrapper .ui-resizable", function(e) {
                    var thisChartID = jQuery(this).find(".motopress-google-chart").attr("id");
                    if ( thisChartID !== undefined ) {
                        var thisSizer = jQuery(this).find(".motopress-drag-handle").height();
                        timer && clearTimeout( timer );
                        timer = setTimeout(function() {
                                    google.motopressDrawChart( thisChartID, thisSizer );
                        }, 100);
                    }
                });
                jQuery(document).on("dragstop", ".motopress-content-wrapper .motopress-splitter", function(e) {
                    var thisChartParent = jQuery(this).parent().parent().parent(),
                        thisChart = thisChartParent.find(".motopress-google-chart");
                    if ( thisChart.length !== 0 ) {
                        thisChart.each(function() {
                            var thisID = jQuery(this).attr("id");
                            google.motopressDrawChart( thisID );
                        });
                    }
                });
                jQuery(window).on('resize', function(){
                    if (jQuery('.motopress-google-chart').length) {
                        timer && clearTimeout( timer );
                        timer = setTimeout(motopressDrawCharts, 100);                        
                    }
                });
        });
    }

})();
(function ($) {
    $(function () {
        var FILTER_ACTIVE_STYLE_CLASS = 'ui-state-active';
        var FILTER_REAL_ACTIVE_CLASS = 'motopress-active-filter';
        var postsGrids = $('.motopress-posts-grid-obj');

        function getActiveFilters(postsGrid) {
            var filters,
                filtersWrapper = postsGrid.children('.motopress-filter'),
                activeFilters = filtersWrapper.find('.' + FILTER_REAL_ACTIVE_CLASS);

            if (activeFilters.length) {
                filters = {};
                activeFilters.each(function () {
                    var tax = $(this).closest('.motopress-filter-group').attr('data-group');
                    var term = $(this).attr('data-filter');
                    filters[tax] = term !== '' ? [term] : [];
                });
            } else {
                filters = false;
            }

            return filters;
        }

        function filterPosts(postsGrid, filters) {
            var shortcodeAttrs = postsGrid.attr('data-shortcode-attrs');
            var postID = postsGrid.attr('data-post-id');
            $.post(MPCEPostsGrid.admin_ajax,
                {
                    'action': 'motopress_ce_posts_grid_filter',
                    'nonce': MPCEPostsGrid.nonces.motopress_ce_posts_grid_filter,
                    'shortcode_attrs': shortcodeAttrs,
                    'filters': filters,
                    'post_id' : postID,
                    'page_has_presets' : $('#motopress-ce-presets-styles').length !== 0
                },
                function (response) {
                    if (response.success) {
                        var items = $(response.data.items),
                            loadMoreButton = $(response.data.load_more),
                            pagination = $(response.data.pagination);

                        postsGrid.children(':not(.motopress-filter)').remove()
                                .end().append(items, loadMoreButton, pagination);

                        if ( response.hasOwnProperty('custom_styles') ) {
                            updateCustomStyles(response.custom_styles);
                        }
                    }
                }
            );
        }

        function loadMorePosts(postsGrid, page, filters){
            var shortcodeAttrs = postsGrid.attr('data-shortcode-attrs');
            var postID = postsGrid.attr('data-post-id');
            $.post(MPCEPostsGrid.admin_ajax,
                {
                    'action': 'motopress_ce_posts_grid_load_more',
                    'nonce': MPCEPostsGrid.nonces.motopress_ce_posts_grid_load_more,
                    'shortcode_attrs': shortcodeAttrs,
                    'filters': filters,
                    'page' : page,
                    'post_id' : postID,
                    'page_has_presets' : $('#motopress-ce-presets-styles').length !== 0
                },
                function (response) {
                    if (response.success) {
                        var itemsWrapper = postsGrid.children('.motopress-paged-content'),
                            itemsColumns = parseInt(itemsWrapper.attr('data-columns')),
                            items = response.data.items,
                            loadMoreButton = $(response.data.load_more);
                        postsGrid.children(':not(.motopress-filter, .motopress-paged-content)').remove();

                        var lastRow = itemsWrapper.children('.motopress-filter-row:last');
                        for ( var i = lastRow.children('.motopress-filter-col').length; i < itemsColumns; i++) {
                            if (items.length) {
                                lastRow.append(items.shift());
                            }
                        }

                        var rowPrototype = lastRow.clone().empty();
                        $.each(items, function(index, el){
                            rowPrototype.append($(el));
                            if ((index + 1) % itemsColumns === 0 || items.length === index + 1) {
                                itemsWrapper.append(rowPrototype.clone()); 
                                rowPrototype.empty();
                            }
                        });

                        if ( response.hasOwnProperty('custom_styles') ) {
                            updateCustomStyles(response.custom_styles);
                        }

                        itemsWrapper.after(loadMoreButton);
                    }
                }
            );
        }

        function updateCustomStyles(customStyles){
            var privateStyleTag = $('#motopress-ce-private-styles');
            if (customStyles.hasOwnProperty('private')) {
                var postsPrintedStyles = privateStyleTag.attr('data-posts') !== '' ? privateStyleTag.attr('data-posts').split(',') : [];

                $.each(postsPrintedStyles, function(postId){
                    delete customStyles.private[postId];
                });

                var privateStyles = privateStyleTag.text();
                $.each(customStyles.private, function(postId, style){
                    privateStyles += style;
                    postsPrintedStyles.push(postId);
                });

                privateStyleTag.text(privateStyles);
                privateStyleTag.attr('data-posts', postsPrintedStyles.join(','));
            }

            if (customStyles.hasOwnProperty('presets') && !$('#motopress-ce-presets-styles').length) {
                privateStyleTag.before(customStyles.presets);
            }
        }

        function turnPage(postsGrid, page, filters){
            var shortcodeAttrs = postsGrid.attr('data-shortcode-attrs');
            var postID = postsGrid.attr('data-post-id');
            $.post(MPCEPostsGrid.admin_ajax,
                {
                    'action': 'motopress_ce_posts_grid_turn_page',
                    'nonce': MPCEPostsGrid.nonces.motopress_ce_posts_grid_turn_page,
                    'shortcode_attrs': shortcodeAttrs,
                    'filters': filters,
                    'page' : page,
                    'post_id' : postID,
                    'page_has_presets' : $('#motopress-ce-presets-styles').length !== 0
                },
                function (response) {
                    if (response.success) {
                        var items = $(response.data.items),
                            pagination = $(response.data.pagination);
                        postsGrid.children(':not(.motopress-filter)').remove().end().append(items, pagination);

                        if ( response.data.hasOwnProperty('custom_styles') ) {
                            updateCustomStyles(response.data.custom_styles);
                        }
                    }
                }
            );
        }

        function showPreloader(el){
            el.addClass('ui-state-loading');
        }

        function hidePreloader(postsGrid){
            postsGrid.find('.motopress-paged-content').addClass('ui-state-loading');
        }

        postsGrids.on('click', '.motopress-filter [data-filter]:not(.' + FILTER_REAL_ACTIVE_CLASS + ')', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var postsGrid = $(this).closest('.motopress-posts-grid-obj');
            var currentFilterGroup = $(this).closest('.motopress-filter-group');
            showPreloader(postsGrid.children('.motopress-paged-content'));
            currentFilterGroup.find('.' + FILTER_ACTIVE_STYLE_CLASS).removeClass(FILTER_ACTIVE_STYLE_CLASS + ' ' + FILTER_REAL_ACTIVE_CLASS);
            $(this).addClass(FILTER_ACTIVE_STYLE_CLASS + ' ' + FILTER_REAL_ACTIVE_CLASS);
            var filtersWrapper = postsGrid.find('.motopress-filter');
            var filters = getActiveFilters(postsGrid);
            filterPosts(postsGrid, filters);
        });

        postsGrids.on('click', '.motopress-posts-grid-pagination a[data-page]', function(e){
            e.preventDefault();
            e.stopPropagation();
            showPreloader($(this).parent());
            var postsGrid = $(this).closest('.motopress-posts-grid-obj');
            var page = $(this).attr('data-page');
            var filters = getActiveFilters(postsGrid)
            turnPage(postsGrid, page, filters);
        });

        postsGrids.on('click', '.motopress-load-more', function(e){
            e.preventDefault();
            e.stopPropagation();
            var postsGrid = $(this).closest('.motopress-posts-grid-obj');
            var page = $(this).attr('data-page');
            var filters = getActiveFilters(postsGrid);
            showPreloader($(this).parent());
            loadMorePosts(postsGrid, page, filters);
        });

    });
})(jQuery);