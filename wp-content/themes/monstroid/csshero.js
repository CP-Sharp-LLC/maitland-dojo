function csshero_theme_declarations()
{
	//widgets

	csshero_config_sidebar('.widget-area','.widget','Widget area');
	csshero_config_sidebar('.cherry-sidebar-main','.widget','Sidebar main');
	csshero_config_sidebar('.cherry-sidebar-secondary','.widget','Sidebar secondary');



	//Statics

		//Logo
	csshero_declare_item('.site-branding','Logo');
	csshero_declare_item('.site-title','Site title');
	csshero_declare_item('.site-link','Site title link');
	csshero_declare_item('.site-description','Site description');
		//Follow
	csshero_declare_item('h3.cherry-follow_title','Follow title');
	csshero_declare_item('.cherry-follow_list','Follow list');
	csshero_declare_item('.cherry-follow_list .cherry-follow_item','Follow item');
		//Search
	csshero_declare_item('.static-search-form .search-form','Search form');
	csshero_declare_item('.static-search-form .search-form .search-field','Search field');
	csshero_declare_item('.static-search-form .search-form .search-submit','Search submit');
		//Header sidebars
	csshero_config_sidebar('.sidebar-header.widget-area','.widget','Header sidebar');
		//Header menu
	csshero_config_menu('nav#menu-primary','.menu-items','Main Menu');
		//Footer logo
	csshero_declare_item('.cherry-footer-logo','Footer logo');
	csshero_declare_item('.footer-logo-link','Footer logo link');
		//Footer menu
	csshero_config_menu('nav#menu-secondary','.menu-items','Secondary Menu');
		//Footer info
	csshero_declare_item('.site-info','Site info');
	csshero_declare_item('.footer-site-link','Footer site link');
		//Footer sidebars
	csshero_config_sidebar('.sidebar-footer-1.widget-area','.widget','Footer sidebar 1');
	csshero_config_sidebar('.sidebar-footer-2.widget-area','.widget','Footer sidebar 2');
	csshero_config_sidebar('.sidebar-footer-3.widget-area','.widget','Footer sidebar 3');
	csshero_config_sidebar('.sidebar-footer-4.widget-area','.widget','Footer sidebar 4');
		//Motoslider
	csshero_declare_item('.motoslider_wrapper .ms_wrapper','Motoslider wrapper');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_arrows a','Motoslider arrows');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_arrows .ms_start_pause','Motoslider start/stop');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_bullet_wrapper','Motoslider pagination');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_bullet_wrapper a','Motoslider pagination item');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_counter','Motoslider counter');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_layer','Motoslider layer');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_image_layer','Motoslider image layer');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_html_layer','Motoslider html layer');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .ms_button_layer','Motoslider button layer');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-header-dark','Motoslider header dark');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-header-white','Motoslider header white');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-sub-header-dark','Motoslider sub header dark');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-sub-header-white','Motoslider sub header white');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-text-dark','Motoslider text dark');
	csshero_declare_item('.motoslider_wrapper .ms_wrapper .mpsl-text-white','Motoslider text white');



	//Statics areas

	csshero_declare_item('#static-area-header-top','Header top area');
	csshero_declare_item('#static-area-header-bottom','Header bottom area');
	csshero_declare_item('#static-area-footer-top','Footer');
	csshero_declare_item('#static-area-footer-bottom','Footer');



	//Shortcodes

	csshero_declare_item('.cherry-spacer','Spacer');
	csshero_declare_item('.cherry-clear','Clear');
	csshero_declare_item('.cherry-icon','Icon');
	csshero_declare_item('.cherry-box','Box');
	csshero_declare_item('.cherry-box-inner','Box inner');
	csshero_declare_item('.cherry-box .inner','Box inner');
	csshero_declare_item('.row > .cherry-box','Row Box');
	csshero_declare_item('.row > .cherry-box .inner','Row box inner');
	csshero_declare_item('.cherry-banner','Banner');
	csshero_declare_item('.cherry-banner .cherry-banner_title','Banner title');
	csshero_declare_item('.cherry-banner .cherry-banner_content','Banner content');
	csshero_declare_item('.cherry-hr','Horizontal Rule');
	csshero_declare_item('.title-box','Title box');
	csshero_declare_item('.title-box_title','Title box title');
	csshero_declare_item('.title-box_subtitle','Title box subtitle');
	csshero_declare_item('.cherry-dropcap','Dropcap');
	csshero_declare_item('.cherry-dropcap .cherry-icon','Dropcap icon');
	csshero_declare_item('.cherry-btn','Button');
	csshero_declare_item('.cherry-btn.cherry-btn-primary','Button primary');
	csshero_declare_item('.cherry-btn.cherry-btn-primary-light','Button primary light');
	csshero_declare_item('.cherry-btn.cherry-btn-default','Button default');
	csshero_declare_item('.cherry-btn.cherry-btn-gray','Button gray');
	csshero_declare_item('.cherry-btn.cherry-btn-success','Button success');
	csshero_declare_item('.cherry-btn.cherry-btn-info','Button info');
	csshero_declare_item('.cherry-btn.cherry-btn-warning','Button warning');
	csshero_declare_item('.cherry-btn.cherry-btn-danger','Button danger');
	csshero_declare_item('.cherry-list','List');
	csshero_declare_item('.cherry-list li','List item');
	csshero_declare_item('.cherry-list li > span','List item icon');
	csshero_declare_item('.cherry-swiper-carousel','Swiper carousel');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide','Swiper carousel slide');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .post-thumbnail','Swiper carousel thumbnail');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .post-title','Swiper carousel title');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .post-title a','Swiper carousel title link');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .post-meta','Swiper carousel meta');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .post-content','Swiper carousel content');
	csshero_declare_item('.cherry-swiper-carousel .swiper-slide .btn','Swiper carousel button');
	csshero_declare_item('.cherry-swiper-carousel-container .swiper-button-next','Swiper carousel next btn');
	csshero_declare_item('.cherry-swiper-carousel-container .swiper-button-prev','Swiper carousel prev btn');
	csshero_declare_item('.cherry-swiper-carousel-container .swiper-pagination','Swiper carousel pagination');
	csshero_declare_item('.cherry-swiper-carousel-container .swiper-pagination .swiper-pagination-bullet','Swiper carousel pagination bullet');
	csshero_declare_item('.cherry-posts-list','Posts list');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item','Posts item');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .post-thumbnail','Posts item thumbnail');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .post-title','Posts title');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .post-title a','Posts title link');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .post-meta','Posts meta');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .post-content','Posts content');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .btn','Posts button');
	csshero_declare_item('.cherry-tabs','Tabs');
	csshero_declare_item('.cherry-tabs .cherry-tabs-nav','Tabs nav');
	csshero_declare_item('.cherry-tabs .cherry-tabs-nav > span','Tabs nav item');
	csshero_declare_item('.cherry-tabs .cherry-tabs-panes','Tabs panes');
	csshero_declare_item('.cherry-tabs .cherry-tabs-panes .cherry-tabs-pane','Tabs pane');
	csshero_declare_item('.cherry-accordion','Accordion');
	csshero_declare_item('.cherry-spoiler','Accordion spoiler');
	csshero_declare_item('.cherry-spoiler .cherry-spoiler-title','Accordion spoiler title');
	csshero_declare_item('.cherry-spoiler .cherry-spoiler-content','Accordion spoiler content');
	csshero_declare_item('.google-map-container','Google map');
	csshero_declare_item('.parallax-box','Parallax box');
	csshero_declare_item('.parallax-box .parallax-content','Parallax content');
	csshero_declare_item('.parallax-box .parallax-bg','Parallax bg');
	csshero_declare_item('.row > .parallax-box','Row parallax box');
	csshero_declare_item('.row > .parallax-box .parallax-content','Row parallax content');
	csshero_declare_item('.row > .parallax-box .parallax-bg','Row parallax bg');
	csshero_declare_item('.video-parallax-box','Video parallax box');
	csshero_declare_item('.video-parallax-box .parallax-content','Video parallax content');
	csshero_declare_item('.video-parallax-box .parallax-bg','Video parallax bg');
	csshero_declare_item('.row > .video-parallax-box','Row video parallax box');
	csshero_declare_item('.row > .video-parallax-box .parallax-content','Row video parallax content');
	csshero_declare_item('.row > .video-parallax-box .parallax-bg','Row video parallax bg');
	csshero_declare_item('.cherry-counter','Counter');
	csshero_declare_item('.cherry-counter .before','Counter before');
	csshero_declare_item('.cherry-counter .count','Counter count');
	csshero_declare_item('.cherry-counter .after','Counter after');
	csshero_declare_item('.video-preview','Video');
	csshero_declare_item('.video-preview .video-preview-controls','Video controls');
	csshero_declare_item('.team-listing','Team listing');
	csshero_declare_item('.team-listing .team-item','Team item');
	csshero_declare_item('.team-listing .team-item .team-listing_photo','Team photo');
	csshero_declare_item('.team-listing .team-item .team-listing_photo a','Team photo link');
	csshero_declare_item('.team-listing .team-item .team-listing_photo img','Team photo img');
	csshero_declare_item('.team-listing .team-item .team-listing_name','Team title');
	csshero_declare_item('.team-listing .team-item .team-listing_name a','Team link');
	csshero_declare_item('.team-listing .team-item .team-listing_position','Team position');
	csshero_declare_item('.team-listing .team-item .team-listing_socials','Team socials');
	csshero_declare_item('.team-listing .team-item .team-listing_socials .team-socials_item','Team social item');
	csshero_declare_item('.team-listing .team-item .team-listing_socials .team-socials_item .team-socials_link','Team social item link');
	csshero_declare_item('.testimonials-list','Testimonials list');
	csshero_declare_item('.testimonials-list .testimonials-item','Testimonials item');
	csshero_declare_item('.testimonials-list .testimonials-item > img','Testimonials img');
	csshero_declare_item('.testimonials-list .testimonials-item blockquote','Testimonials blockquote');
	csshero_declare_item('.testimonials-list .testimonials-item footer','Testimonials item footer');
	csshero_declare_item('.testimonials-list .testimonials-item .author','Testimonials author');
	csshero_declare_item('.testimonials-list .testimonials-item .author a','Testimonials author link');
	csshero_declare_item('.cherry-share_list','Share list');
	csshero_declare_item('.cherry-share_list .cherry-share_item','Share item');
	csshero_declare_item('.cherry-share_list .cherry-share_item .cherry-share_link','Share item link');
	csshero_declare_item('.cherry-share_list .cherry-share_item .cherry-share_link i','Share item icon');
	csshero_declare_item('.cherry-share_list .cherry-share_item .cherry-share_link .cherry-share_label','Share item label');
	csshero_declare_item('.cherry-follow_list','Follow list');
	csshero_declare_item('.cherry-follow_list .cherry-follow_item','Follow item');
	csshero_declare_item('.cherry-follow_list .cherry-follow_item .cherry-follow_link','Follow item link');
	csshero_declare_item('.cherry-follow_list .cherry-follow_item .cherry-follow_link i','Follow item icon');
	csshero_declare_item('.cherry-follow_list .cherry-follow_item .cherry-follow_link .cherry-follow_label','Follow item label');
	csshero_declare_item('.cherry-chart','Chart');
	csshero_declare_item('.cherry-services','Services');
	csshero_declare_item('.cherry-services .cherry-services_item','Services item');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-services_icon','Services icon holder');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-services_icon i','Services icon');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-services_title','Services title');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-services_title a','Services title link');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-services_excerpt','Services excerpt');
	csshero_declare_item('.cherry-services .cherry-services_item .cherry-btn','Services button');



	//Portfolio

	csshero_declare_item('.portfolio-wrap','Portfolio');
	csshero_declare_item('.portfolio-wrap .portfolio-filter','Portfolio filter holder');
	csshero_declare_item('.portfolio-wrap .portfolio-filter .filter','Portfolio filter');
	csshero_declare_item('.portfolio-wrap .portfolio-filter .filter > li','Portfolio filter item');
	csshero_declare_item('.portfolio-wrap .portfolio-filter .filter > li > a','Portfolio filter item link');
	csshero_declare_item('.portfolio-wrap .portfolio-container','Portfolio container');
	csshero_declare_item('.portfolio-wrap .portfolio-container .portfolio-list','Portfolio list');
	csshero_declare_item('.portfolio-wrap .portfolio-container .portfolio-item','Portfolio item');
	csshero_declare_item('.portfolio-wrap .portfolio-container .portfolio-pagination','Portfolio pagination');
	csshero_declare_item('.portfolio-wrap .portfolio-container .page-link','Portfolio page links');
	csshero_declare_item('.portfolio-wrap .portfolio-container .page-link li','Portfolio page link holder');
	csshero_declare_item('.portfolio-wrap .portfolio-container .page-link li a','Portfolio page link');
	csshero_declare_item('.portfolio-wrap .portfolio-container .next-page','Portfolio next page');
	csshero_declare_item('.portfolio-wrap .portfolio-container .prev-page','Portfolio prev page');
	csshero_declare_item('.portfolio-wrap .portfolio-container .prev-page','Portfolio prev page');
	csshero_declare_item('.portfolio-wrap .portfolio-container .portfolio-ajax-button','Portfolio more button holder');
	csshero_declare_item('.portfolio-wrap .portfolio-container .load-more-button','Portfolio more button');
	csshero_declare_item('.portfolio-wrap .portfolio-container .load-more-button a','Portfolio more button link');



	//Single Portfolio

	csshero_declare_item('.single-portfolio .site-main','Single portfolio main');
	csshero_declare_item('.single-portfolio article.portfolio','Single portfolio post');
	csshero_declare_item('.single-portfolio article.portfolio .post-featured-image','Single portfolio image');
	csshero_declare_item('.single-portfolio article.portfolio .post-featured-image a','Single portfolio image link');
	csshero_declare_item('.single-portfolio article.portfolio .post-content','Single portfolio content');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-title','Single portfolio title');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container','Single portfolio meta');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container .post-date','Single portfolio meta date');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container .post-author','Single portfolio author');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container .post-author a','Single portfolio author link');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container','Single portfolio meta');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-meta-container','Single portfolio meta');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-taxonomy-list','Single portfolio taxonomy');
	csshero_declare_item('.single-portfolio article.portfolio .post-content .post-taxonomy-list > span','Single portfolio tags');


	



	//Blog

	csshero_declare_item('.blog article.post','Blog post');
	csshero_declare_item('.blog article.post .entry-thumbnail','Blog post thumbnail');
	csshero_declare_item('.blog article.post .entry-thumbnail','Blog post thumbnail');
	csshero_declare_item('.blog article.post .entry-title','Blog post title');
	csshero_declare_item('.blog article.post .entry-title a','Blog post title link');
	csshero_declare_item('.blog article.post .entry-meta','Blog post meta');
	csshero_declare_item('.blog article.post .entry-meta .posted-on','Blog post meta posted-on');
	csshero_declare_item('.blog article.post .entry-meta .author','Blog post meta author');
	csshero_declare_item('.blog article.post .entry-meta .author a','Blog post meta author link');
	csshero_declare_item('.blog article.post .entry-meta .comments-link','Blog post meta comments');
	csshero_declare_item('.blog article.post .entry-meta .comments-link a','Blog post meta comments link');	
	csshero_declare_item('.blog article.post .entry-content','Blog post content');
	csshero_declare_item('.blog article.post .entry-permalink','Blog post permalink');
	csshero_declare_item('.blog article.post .entry-permalink a','Blog post permalink link');
	csshero_declare_item('.blog article.post .entry-meta-bottom','Blog post meta bottom');
	csshero_declare_item('.blog article.post .entry-meta-bottom .entry-terms_wrap','Blog post terms holder');
	csshero_declare_item('.blog article.post .entry-meta-bottom .entry-terms_wrap .entry-terms','Blog post terms');
	csshero_declare_item('.blog article.post .entry-meta-bottom .entry-terms_wrap .entry-terms a','Blog post terms link');
	csshero_declare_item('.blog .navigation.pagination','Blog pagination');
	csshero_declare_item('.blog .navigation.pagination .screen-reader-text','Blog pagination reader text');
	csshero_declare_item('.blog .navigation.pagination .nav-links','Blog pagination nav links');
	csshero_declare_item('.blog .navigation.pagination .page-numbers','Blog pagination numbers');
	csshero_declare_item('.blog .navigation.pagination .page-numbers.current','Blog pagination current');

	

	//Single blog

	csshero_declare_item('.single-post .site-main','Single blog main');
	csshero_declare_item('.single-post article.post','Single blog post');
	csshero_declare_item('.single-post article.post .entry-thumbnail','Single blog thumbnail');
	csshero_declare_item('.single-post article.post .entry-meta','Single blog post meta');
	csshero_declare_item('.single-post article.post .entry-meta .posted-on','Single blog post meta posted-on');
	csshero_declare_item('.single-post article.post .entry-meta .author','Single blog post meta author');
	csshero_declare_item('.single-post article.post .entry-meta .author a','Single blog post meta author link');
	csshero_declare_item('.single-post article.post .entry-meta .comments-link','Single blog post meta comments');
	csshero_declare_item('.single-post article.post .entry-meta .comments-link a','Single blog post meta comments link');	
	csshero_declare_item('.single-post article.post .entry-content','Single blog post content');
	csshero_declare_item('.single-post article.post .entry-meta-bottom','Single blog post meta bottom');
	csshero_declare_item('.single-post article.post .entry-meta-bottom .entry-terms_wrap','Single blog post terms holder');
	csshero_declare_item('.single-post article.post .entry-meta-bottom .entry-terms_wrap .entry-terms','Single blog post terms');
	csshero_declare_item('.single-post article.post .entry-meta-bottom .entry-terms_wrap .entry-terms a','Single blog post terms link');



	//Navigation

	csshero_declare_item('.navigation.post-navigation','Navigation');
	csshero_declare_item('.navigation.post-navigation .nav-previous','Navigation previous');
	csshero_declare_item('.navigation.post-navigation .nav-previous a','Navigation previous link');
	csshero_declare_item('.navigation.post-navigation .nav-next','Navigation next');
	csshero_declare_item('.navigation.post-navigation .nav-next a','Navigation next link');



	// Author bio

	csshero_declare_item('.author-bio','Author bio');
	csshero_declare_item('.author-bio h3','Author title');
	csshero_declare_item('.author-bio .author-bio_avatar','Author bio avatar');
	csshero_declare_item('.author-bio .description','Author description');



	// Related posts

	csshero_declare_item('.related-posts','Related posts');
	csshero_declare_item('.related-posts .related-posts_title','Related posts title');
	csshero_declare_item('.related-posts .related-posts_list','Related posts list');
	csshero_declare_item('.related-posts .related-posts_item','Related posts item');
	csshero_declare_item('.related-posts .entry-thumbnail','Related posts thumbnail');
	csshero_declare_item('.related-posts .entry-title','Related posts title');
	csshero_declare_item('.related-posts .entry-title a','Related posts title link');
	csshero_declare_item('.related-posts .entry-content','Related posts content');
	csshero_declare_item('.related-posts .entry-permalink','Related posts permalink');
	csshero_declare_item('.related-posts .entry-permalink a','Related posts permalink link');



	// Comments

	csshero_declare_item('.comments-area','Comments area');
	csshero_declare_item('.comments-area .comments-title','Comments title');
	csshero_declare_item('.comments-area .comment-list','Comments list');
	csshero_declare_item('.comments-area .comment-list .comment','Comments item');
	csshero_declare_item('.comments-area .comment-body','Comments body');
	csshero_declare_item('.comments-area .comment-meta','Comments meta');
	csshero_declare_item('.comments-area .comment-author','Comments author holder');
	csshero_declare_item('.comments-area .comment-author img','Comments author img');
	csshero_declare_item('.comments-area .comment-author .fn','Comments author');
	csshero_declare_item('.comments-area .comment-author .says','Comments author says');
	csshero_declare_item('.comments-area .comment-metadata','Comments metadata');
	csshero_declare_item('.comments-area .comment-metadata a','Comments metadata link');
	csshero_declare_item('.comments-area .comment-metadata .edit-link','Comments metadata edit link');
	csshero_declare_item('.comments-area .comment-content','Comments content');
	csshero_declare_item('.comments-area .comment-content p','Comments content paragraph');
	csshero_declare_item('.comments-area .reply','Comments reply btn');



	// Comments form

	csshero_declare_item('.comment-respond','Comments form');
	csshero_declare_item('.comment-respond .comment-reply-title','Comments form title');
	csshero_declare_item('.comment-respond .comment-form','Comments form');
	csshero_declare_item('.comment-respond .comment-form .logged-in-as','Comments form logged');
	csshero_declare_item('.comment-respond .comment-form .comment-notes','Comments comment notes');
	csshero_declare_item('.comment-respond .comment-form .comment-form-author','Comments form author');
	csshero_declare_item('.comment-respond .comment-form .comment-form-author label','Comments form author label');
	csshero_declare_item('.comment-respond .comment-form .comment-form-author #author','Comments form author input');
	csshero_declare_item('.comment-respond .comment-form .comment-form-email','Comments form email');
	csshero_declare_item('.comment-respond .comment-form .comment-form-email label','Comments form email label');
	csshero_declare_item('.comment-respond .comment-form .comment-form-email #email','Comments form email input');
	csshero_declare_item('.comment-respond .comment-form .comment-form-url','Comments form url');
	csshero_declare_item('.comment-respond .comment-form .comment-form-url label','Comments form url label');
	csshero_declare_item('.comment-respond .comment-form .comment-form-url #url','Comments form url input');
	csshero_declare_item('.comment-respond .comment-form .comment-form-comment','Comments form comment');
	csshero_declare_item('.comment-respond .comment-form .comment-form-comment label','Comments form comment label');
	csshero_declare_item('.comment-respond .comment-form .comment-form-comment #comment','Comments form comment input');
	csshero_declare_item('.comment-respond .comment-form .form-submit','Comments submit holder');
	csshero_declare_item('.comment-respond .comment-form .form-submit .submit','Comments submit');	



	//Breadcrumbs

	csshero_declare_item('.cherry-breadcrumbs','Breadcrumbs');
	csshero_declare_item('.cherry-breadcrumbs .page-title','Breadcrumbs title');
	csshero_declare_item('.cherry-breadcrumbs .cherry-breadcrumbs_content','Breadcrumbs content');
	csshero_declare_item('.cherry-breadcrumbs .cherry-breadcrumbs_browse','Breadcrumbs browse');
	csshero_declare_item('.cherry-breadcrumbs .cherry-breadcrumbs_wrap','Breadcrumbs wrap');
	csshero_declare_item('.cherry-breadcrumbs .cherry-breadcrumbs_item','Breadcrumbs item');
	csshero_declare_item('.cherry-breadcrumbs .cherry-breadcrumbs_item a','Breadcrumbs item link');



	//wpcf7

	csshero_declare_item('.wpcf7','wpcf7');
	csshero_declare_item('.wpcf7 .wpcf7-form-control-wrap input','wpcf7 input');
	csshero_declare_item('.wpcf7 .wpcf7-form-control-wrap textarea','wpcf7 textarea');
	csshero_declare_item('.wpcf7 .submit-wrap','wpcf7 submit wrap');
	csshero_declare_item('.wpcf7 .submit-wrap input','wpcf7 submit input');
	csshero_declare_item('.wpcf7 .submit-wrap .submit','wpcf7 submit');



	//shop

	csshero_declare_item('.woocommerce.widget_shopping_cart','Shopping cart');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget-title','Shopping cart title');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content','Shopping cart content');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .cart_list product_list_widget','Shopping cart list');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .cart_list product_list_widget li','Shopping cart list item');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .total','Shopping cart total');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .total','Shopping cart total');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .total strong','Shopping cart total Subtotal:');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .total .amount','Shopping cart total amount');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .buttons','Shopping cart buttons');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .buttons .button','Shopping cart button');
	csshero_declare_item('.woocommerce.widget_shopping_cart .widget_shopping_cart_content .buttons .checkout','Shopping cart checkout');
	csshero_declare_item('.woocommerce .products','Products');
	csshero_declare_item('.woocommerce .products .product','Product');
	csshero_declare_item('.woocommerce .products .product .star-rating','Product rating');
	csshero_declare_item('.woocommerce .products .product .product_buttons','Product buttons');
	csshero_declare_item('.woocommerce .products .product .product_buttons a','Product button');
	csshero_declare_item('.woocommerce .products .product .short_desc','Product short desc');
	csshero_declare_item('.woocommerce .products .product .price','Product price');




	//single-product

	csshero_declare_item('.single-product .product_title','Product title');
	csshero_declare_item('.single-product .woocommerce-product-rating','Product rating');
	csshero_declare_item('.single-product .woocommerce-product-rating .star-rating','Product rating star-rating');
	csshero_declare_item('.single-product .woocommerce-product-rating .woocommerce-review-link','Product rating review-link');
	csshero_declare_item('.single-product .offers','Product offers');
	csshero_declare_item('.single-product .offers > .price','Product price');
	csshero_declare_item('.single-product .offers .priceCurrency','Product price currency');
	csshero_declare_item('.single-product .summary .yith-wcwl-add-to-wishlist','Product add wishlist');
	csshero_declare_item('.single-product .summary .compare.button','Product compare button');
	csshero_declare_item('.single-product .summary','Product summary');
	csshero_declare_item('.single-product .product-images','Product images');
	csshero_declare_item('.single-product .product-images .product-large-image','Product images large');
	csshero_declare_item('.single-product .product-images .product-thumbnails','Product thumbnails');
	csshero_declare_item('.single-product .product-images .product-thumbnails .owl-item','Product images item');
	csshero_declare_item('.single-product .woocommerce-tabs','Product tabs');
	csshero_declare_item('.single-product .woocommerce-tabs .tabs','Product header tabs');
	csshero_declare_item('.single-product .woocommerce-tabs .tabs li','Product header tab item');
	csshero_declare_item('.single-product .woocommerce-tabs .panel','Product tabs panel');
	csshero_declare_item('.single-product .related.products.woocommerce','Products related');
	csshero_declare_item('.single-product .related.products.woocommerce h2','Products related title');
	csshero_declare_item('.single-product .related.products.woocommerce .products','Products related list');
	csshero_declare_item('.single-product .related.products.woocommerce .products . product','Products related item');
	csshero_declare_item('.single-product .related.products.woocommerce','Products related');

	


	//header

	csshero_declare_item('#header','Header');



	//Content
	
	csshero_declare_item('#content','Content');
	

	
	//footer

	csshero_declare_item('#footer','Footer');



	//monstroid fix's

	csshero_declare_item('.cherry-posts-list .cherry-posts-item .template-6 > .btn','Posts button holder');
	csshero_declare_item('.cherry-posts-list .cherry-posts-item .template-6 > .btn a','Posts button');

}