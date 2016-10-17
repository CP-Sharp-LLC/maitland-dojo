(function($){
	$.fn.circle_thumbnails=function(options)
	{
		var settings = $.extend({
            thumbnails_selector: '>li',
            position_range: 5,
        	size_range: 15
        }, options );

        var _window = $(window),
        	_body = $('body'),
        	thumbnailset_cover = $(),
        	timeOut = 0;

        this.each(function()
        {
			var th = $(this),
				th_main_wrapper,
				th_main = $('.thumbnailset', th),
				thumbnails = $(settings.thumbnails_selector, th_main),
				unfolded_items_area,
				thumbnailset_state = 'folded',
				total = thumbnails.length,
				circle_diameter = thumbnails.width(),
				radius = parseInt(circle_diameter/3.5),
				holder_size = radius*2 + circle_diameter + settings.position_range,
				offset_x = 0,
				offset_y = 0,
				appendToTimeOut = 0;


			function init()
			{
				th_main.wrap('<div class="thumbnailset-wrapper"></div>');
				th_main_wrapper = th_main.parent('.thumbnailset-wrapper');
				th_main_wrapper.append('<a class="unfolded-items-area" href="#"></a>');
				unfolded_items_area = $('.unfolded-items-area', th_main_wrapper);

				th_main.width(holder_size).height(holder_size);
				th_main_wrapper.width(holder_size).height(holder_size);

				items_state = get_items_state();

				items_state.forEach(function(item, i) 
				{
					thumbnails.eq(i).css({
	                    width: item.width,
	                    height: item.height,
	                    top: item.top,
	                    left: item.left,
	                    zIndex: total - i +1
	                });
				});
			};


			function folded_items()
			{
				thumbnailset_state = 'folded';

				items_state = get_items_state('folded');

				th_main.css({
	                width: holder_size,
	                height: holder_size,
	                top: th_main.position().top + offset_y,
	                left: th_main.position().left + offset_x
	            });

	            items_state.forEach(function(item, i) {
	           		objectCssTransitionClear(thumbnails.eq(i));
					thumbnails.eq(i).css({
	                    top: thumbnails.eq(i).position().top - offset_y,
	                    left: thumbnails.eq(i).position().left - offset_x
	                });
				});

	            items_state.forEach(function(item, i) {
					setTimeout(function(){
						thumbnails.eq(i).css({
		                    width: item.width,
		                    height: item.height,
		                    top: item.top,
		                    left: item.left
		                });
		                objectCssTransition( thumbnails.eq(i), 'outBack', 0.45);
					}, Math.random()*250);
				});

	            appendToTimeOut = setTimeout(function(){
	            	th_main.appendTo(th_main_wrapper).css({
		                position: 'relative',
		                top: 0,
		                left: 0
		            });
	            }, 500);

	            removeThumbnailsetCover();
			}

			function unfolded_items()
			{
				thumbnailset_state = 'unfolded';

				th.addClass('hold-hover');
				addThumbnailsetCover();
				clearTimeout(appendToTimeOut);


				items_state = get_items_state('unfolded');

				var top = th_main.offset().top,
	                left = th_main.offset().left,
	                th_main_top = top - offset_y,
	                th_main_left = left -offset_x,
	                new_holder_size = radius*2 + circle_diameter;

                offset_y = parseInt((new_holder_size - holder_size)/2);
                offset_x = parseInt((new_holder_size - holder_size)/2);


                if( (top - offset_y) < 15 + window.pageYOffset )
                	offset_y = offset_y + (top - offset_y) - 15 - window.pageYOffset;

                if( (left - offset_x) < 15 )
                	offset_x = offset_x + (left - offset_x) - 15;

                if( (left - offset_x + new_holder_size) > _window.width() - 15 )
                	offset_x = (left + new_holder_size) - _window.width() + 15;

				th_main.appendTo('body').css({
	                position: 'absolute',
	                width: new_holder_size,
	                height: new_holder_size,
	                top: top - offset_y,
	                left: left -offset_x,
	            });

	            items_state.forEach(function(item, i) {
	           		objectCssTransitionClear(thumbnails.eq(i));
					thumbnails.eq(i).css({
	                    top: thumbnails.eq(i).position().top + offset_y,
	                    left: thumbnails.eq(i).position().left + offset_x
	                });
				});


				items_state.forEach(function(item, i) {
					setTimeout(function(){
						thumbnails.eq(i).css({
		                    width: item.width,
		                    height: item.height,
		                    top: item.top,
		                    left: item.left
		                });
		                objectCssTransition( thumbnails.eq(i), 'outBack', 0.5);
					}, Math.random()*250);
				});


				th_main.append('<div class="thumbnails-hover-cover"></div>');
				setTimeout(function(){
					$('> .thumbnails-hover-cover', th_main).remove();
				}, 500)
			}

			function get_items_state(object_state)
			{
				var object_state = object_state || 'folded',
					items_state = [];		

				thumbnails.each(function(index)
		        {
		            var th=$(this),
		                angel,
		                pointx,
		                pointy,
		                item_size;

		            switch(object_state) {
					    case 'folded':
					        
					    	radius = parseInt(circle_diameter/3.5);
		                
				            if( index < 3 ){              
				                angel = ((Math.PI * 2) / 3) * index;

				                pointx  = getRandomInt( (Math.cos( angel ) * radius), settings.position_range ) + radius/1.2;
			           			pointy  = getRandomInt( (Math.sin( angel ) * radius), settings.position_range ) + radius;

			           			item_size = getRandomInt((circle_diameter-settings.size_range) - (index*10), settings.size_range);
				            } else {
				            	pointx = holder_size/2
				            	pointy = holder_size/2;
				            	item_size = 0
				            }

					        break;

					    case 'unfolded':
					       
					    	radius = total * (circle_diameter/8);
					    	if(radius < circle_diameter)
					    		radius = circle_diameter;
			                angel = ((Math.PI * 2) / total) * index;
			                pointx = Math.cos( angel ) * radius + radius;
			                pointy = Math.sin( angel ) * radius + radius;
			                item_size = circle_diameter;

					        break;
					}

					items_state.push({
				        left: pointx  + 'px',
		            	top: pointy + 'px',
		            	width: item_size,
		            	height: item_size
				    });
		        });

				return items_state;
			}

			function addThumbnailsetCover()
			{
				if( thumbnailset_cover.length == 0 )
				{
					_body.append('<div class="thumbnailset-cover"><div/>');
					thumbnailset_cover = $('.thumbnailset-cover', _body);
					thumbnailset_cover.css({opacity : 0});
					objectCssTransition( $('.thumbnailset-cover', _body), 'ease', .15);
					setTimeout(function(){
						thumbnailset_cover.css({opacity : 1});
					}, 5);
				} else{
					clearTimeout(timeOut);
					thumbnailset_cover.css({opacity : 1});
				}
			};

			function removeThumbnailsetCover()
			{
				if( thumbnailset_cover.length >= 1 )
				{
					thumbnailset_cover = $('.thumbnailset-cover', _body);
					thumbnailset_cover.css({opacity : 0});
					timeOut = setTimeout(function(){
						th.removeClass('hold-hover');
						thumbnailset_cover.remove();
						thumbnailset_cover = $();
					}, 500);
				}
			};

			function getRandomInt(val, offset)
		    {
		        return Math.random() * ((val+offset) - (val-offset) + 1) + (val-offset);
		    };

		    function objectCssTransition(obj, ease, duration)
	        {
                var ease = ease || 'ease',
                	duration = duration || 0.5;
    
                switch(ease){
                    case 'ease':
                            obj.css({"-webkit-transition":"all "+duration+"s ease", "transition":"all "+duration+"s ease"});
                    break;
                    case 'outSine':
                        obj.css({"-webkit-transition":"all "+duration+"s cubic-bezier(0.470, 0.000, 0.745, 0.715)", "transition":"all "+duration+"s cubic-bezier(0.470, 0.000, 0.745, 0.715)"});
                    break;
                    case 'outCubic':
                        obj.css({"-webkit-transition":"all "+duration+"s cubic-bezier(0.215, 0.610, 0.355, 1.000)", "transition":"all "+duration+"s cubic-bezier(0.215, 0.610, 0.355, 1.000)"});
                    break;
                    case 'outExpo':
                        obj.css({"-webkit-transition":"all "+duration+"s cubic-bezier(0.190, 1.000, 0.220, 1.000)", "transition":"all "+duration+"s cubic-bezier(0.190, 1.000, 0.220, 1.000)"});
                    break;
                    case 'outBack':
                        obj.css({"-webkit-transition":"all "+duration+"s cubic-bezier(0.175, 0.885, 0.320, 1.275)", "transition":"all "+duration+"s cubic-bezier(0.175, 0.885, 0.320, 1.275)"});
                    break;
                }
	        };

	        function objectCssTransitionClear(obj)
	        {
                obj.css({"-webkit-transition":"none", "transition":"none"});
	        };


			init();			

			unfolded_items_area.click(function(event) 
			{
				if( thumbnailset_state == 'folded' )
					unfolded_items();

				return false;
			});
			th_main.mouseleave(function()
			{
				if( thumbnailset_state == 'unfolded' )
					folded_items();
			});
		})
	}
})(jQuery);


/* Circle thumbnails init */
jQuery(document).ready(function() 
{
	jQuery('.portfolio-wrap').on('ajax_success', function()
	{ 
		var portfolio_thumbnailset = jQuery('.portfolio-wrap .portfolio-item .thumbnailset');

		if(portfolio_thumbnailset.length > 0) 
		{
			var portfolio_items = jQuery('.portfolio-wrap .portfolio-item');

			portfolio_items.circle_thumbnails();

			jQuery(window).resize(portfolio_content_position);
			portfolio_content_position();
		}

		function portfolio_content_position(){
			portfolio_items.each(function(index, el)
			{
				var portfolio_item = jQuery(el).find('.inner-wrap'),
					portfolio_content = portfolio_item.find('.item-content-holder');

				portfolio_content.css({
					'marginTop': 0
				});

				if(portfolio_content.length > 0)
				{
					setTimeout(function(){
						var portfolio_item_height = portfolio_item.outerHeight(),
							portfolio_content_height = portfolio_content.outerHeight(),
							portfolio_content_position = portfolio_content.position().top;

						if( portfolio_item_height < portfolio_content_position + portfolio_content_height ){
							portfolio_content.css({
								'marginTop': -((portfolio_content_position + portfolio_content_height) - portfolio_item_height)
							});
						}
					}, 750)
				}
			});
		}
	})
});
/* Circle thumbnails init */