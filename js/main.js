var animated_header = false;

jQuery(function($) {
	
	// Fix fixed bg's jump
	/MSIE [6-8]|Mac/i.test(navigator.userAgent)||$("header, article, footer").each(function(){if("fixed"==$(this).css("backgroundAttachment")){var i=$(this),a=/WebKit/i.test(navigator.userAgent)?9:8;i.addClass("froid-fixed-bg").data({bgX:i.css("backgroundPosition").slice(0,i.css("backgroundPosition").indexOf(" ")),bgY:i.css("backgroundPosition").slice(i.css("backgroundPosition").indexOf(" ")),margin:a})}}),$(window).bind("SIModals.modalsOpen",function(){$(".froid-fixed-bg").each(function(){var i=$(this);i.css("backgroundPosition","calc("+i.data("bgX")+" - "+i.data("margin")+"px) "+i.data("bgY"))})}),$(window).bind("SIModals.modalsClose",function(){$(".froid-fixed-bg").each(function(){var i=$(this);i.css("backgroundPosition",i.data("bgX")+" "+i.data("bgY"))})});
	
	// Mobile full-width && disable animation
	if(is_mobile()) {
		
		// Fix mobile fixed bg's
		$("header, article, footer").each(function(){if ("fixed" == $(this).css("backgroundAttachment")) $(this).css('backgroundAttachment', 'scroll');});
		
		// Mobile stretch
		$('html, body').css('min-width', '1200px').addClass('mobile');
		$('html').css('width', window.innerWidth + 'px');
		
		// Remove animation
		$('.cre-animate').css({'transform': 'none', '-webkit-transform': 'none', '-moz-transform': 'none', '-ms-transform': 'none', '-o-transform': 'none', 'transition': 'none', '-webkit-transition': 'none', 'opacity' : 1}).removeClass('.cre-animate');
		
		// Remove video
		$('#video').remove();
		
	}else{
	
		$(window).load(function() {
			$('#video-form').seainside_screen_control(300);
			$('#video-form').on('start-animation', function(){
				setTimeout(function(){$('#video').css('visibility', 'visible').animate({opacity : 1}, 500);$('#video')[0].play();},100);
			});
		});
	
	}
	
	if (is_OSX()) {
		$('html, body').addClass('osx');
	}
	
	// Init all plugins and scripts
	$.fn.SIInit = function() {
	
		// Modal photos
		$('a[data-rel]').each(function() {$(this).attr('rel', $(this).data('rel'));});
		$('a[rel^=fancybox]').not('.cloned a').fancybox({
			helpers : {
				thumbs : true
			}
		});
		
		// Forms
		$('.send-form').SIForms({
			'validateFields': { 
				'client_name' 		: 'Укажите Ваше имя',
				'client_phone' 		: 'Укажите Ваш телефон',
				'client_mail' 		: 'Укажите Ваш e-mail'
			},
			'sendSuccess' : function(res) {
				
				/*
				yaCounter.reachGoal('target' + res.id);
				
				ga('send', 'event', res.gcode, res.gcode);
				*/
				
			}
			
		});
	
	};
	
	$.fn.SIInit();

	// All sound load
	$.ionSound({sounds: ["bip-1","bip-2","wuf-1","wuf-2","wuf-3","wuf-4"], path: template_url + "/sounds/", volume: 0.3});
	
	// Sounds
	$(document).on('mouseenter', '.button, .submit, .phone-line, .si-jump', function() {
		$.ionSound.play('bip-2');
	});
	SIModals.beforeOpen = function() {$.ionSound.play('wuf-4');}
	SIModals.beforeClose = function() {$.ionSound.play('wuf-3');}

	// Jump links
	$('.si-jump').SIJump();
	
	// Page messages
	SIPageMessages.init();
	
	// Header
		
		// Init tooltips
		function SI_initTooltips(new_index) {
			
			if (new_index === undefined)
				var active_id = $('.header-arc.active').data('id');
			else
				var active_id = $('.header-arc').eq(new_index).data('id');
				
			$('.header-arrow .text').removeClass('active');
			$('.header-arrow .text[data-for='+active_id+']').addClass('active');
		}
		SI_initTooltips();
		
		// Change arcs
		$('.header-arrow').click(function() {
			
			console.log(animated_header)
			
			if (animated_header == true) return false;
			
			var direction = $(this).hasClass('left') ? 0 : 1;
			
			var current_index = $('.header-arc').index($('.header-arc.active'));
			var size = $('.header-arc').size();
			
			if (direction == 0)
				var new_index = (current_index == 0) ? size - 1 : current_index - 1;
			else
				var new_index = (current_index + 1 == size) ? 0 : current_index + 1;
			
			var $old_arc = $('.header-arc.active');
			var $new_arc = $('.header-arc').eq(new_index);
			
				$('.header-arc').removeClass('flip-left flip-right');
			
				(direction == 0) ? $new_arc.addClass('flip-right') : $new_arc.addClass('flip-left');
				(direction == 0) ? $old_arc.addClass('flip-left') : $old_arc.addClass('flip-right');
				$old_arc.removeClass('active');
				
				setTimeout(function() {
					$new_arc.addClass('active').removeClass('flip-left flip-right');
				}, 350);
				SI_initTooltips(new_index);
			
			$('.header-image').removeClass('active');
			$('.header-image').eq(new_index).addClass('active');
			
			if (direction == 0) {
				$('.nivo-prevNav').click();
			}else{
				$('.nivo-nextNav').click();
			}

			animated_header = true;
			
			setTimeout(function() {
				animated_header = false;
			}, 1500);
			
			return false;
			
		});
		
	// Clients
		
		// Slider
		$('.clients').owlCarousel({loop:true,items:5,margin:5,nav:true,dots:false,
			onChange : function(){
				$.ionSound.play('wuf-1');
			}
		});
		$('#clients').on('mouseenter', '.owl-prev, .owl-next, .owl-dot', function() {
			$.ionSound.play('bip-2');
		});
		
	// Solution
		
		var mh = 0;
		$('.solution-text').each(function(){
			mh = Math.max($(this).height(), mh);
		});
		$('.solution-text').animate({'min-height' : mh}, 500);
	
	// Questions
		
		// Before/after
		$('.question-compare').mousemove(function(e) {
			
			var offsetX = e.pageX - $(this).offset().left;
			
				if (offsetX < 0 || offsetX > $(this).width()) return false;
			
			$(this).find('.question-compare-before').css('width', offsetX);
			$(this).find('.question-compare-slider').css('left', offsetX);
		
		});
	
	// Catalog
	
		// AutoHeight
		$('.catalog-row').each(function(){
			mh = 0;
			$(this).find('.catalog-item').each(function() {
				mh = Math.max($(this).find('.catalog-text').height(), mh);
			})
			$(this).find('.catalog-text').animate({height:mh},500);
		});
	
	// Projects
		
		// Slider
		$('.projects').owlCarousel({loop:true,items:1,margin:5,nav:false,dots:true,
			onChange : function(){
				$.ionSound.play('wuf-1');
			}
		});
		$('#projects').on('mouseenter', '.owl-prev, .owl-next, .owl-dot', function() {
			$.ionSound.play('bip-2');
		});
	
	// Modals
	SIModals.init();
		
		// Init modals
		SIModals.attachModal('.open-phone-modal', '.phone-modal', {'.send-extra' : 'extra'});
		SIModals.attachModal('.open-buy-modal', '.buy-modal', {'.send-extra' : 'extra'});
		SIModals.attachModal('.open-more-modal', '.more-modal', {'.send-extra' : 'extra'});
		SIModals.attachModal('.open-catalog-modal', '.catalog-modal', {'.send-extra' : 'extra'});
		SIModals.attachModal('.open-privacy-modal', '.privacy-modal', {'.send-extra' : 'extra'});
		SIModals.attachModal('.open-item-modal', '.item-modal', {'.send-extra' : 'extra'});

		// Modal controls
		SIModals.attachClose('.si-close');
		
})

ymaps.ready(function(){
					   
	myMap = new ymaps.Map("map", {
		center: [42.8710, 74.5945],
		zoom: 16
	});

		myMap.controls.add('mapTools', { left: 15, top: 250 });
		myMap.controls.add('typeSelector', { right: 25, top: 50 });
		myMap.controls.add('zoomControl', { left: 15, top: 300 });
		
		var myPlacemark = new ymaps.Placemark(
			[42.8710, 74.5945], {iconContent:'г. Бишкек'}, {preset: 'twirl#blueStretchyIcon'}
		);
		
		myMap.geoObjects.add(myPlacemark);

})