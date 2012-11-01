$(document).ready(function () {

	var DEFAULT_POST_TIME = 5000;
	var PHOTOSET_AUTO = 3000;
	var PHOTOSET_SPEED = 1000;
	var INIT_TIME = 100;//increase this for slow internet connections (should be less than FADE_TIME)
	var FADE_TIME = 2000;
	var PHOTOSET_TIMEOUT = PHOTOSET_AUTO + PHOTOSET_SPEED+INIT_TIME+FADE_TIME;
	var MAX_POSTS = 10;
	var attachments = new Array();

	/*
	 *	Detaches all embedded content, like videos, and even photosets, which
	 *	will be reattached - with .prependTo() - later when the post is visible
	*/
	$.fn.detachContent = function(){
		$('.post', this).each(function(){
			attachments[$(this).closest('.postwrapper').attr('id')] = $(this).detach();
		});
	}

	/*
	 *	Initializes JCarousel on photosets
	*/
	$.fn.initJCarousel = function(){
		setTimeout(function(){
			console.log('jcarousel init()');
			$(".photoset-carousel").jCarouselLite({
		    	visible: 1,
		    	auto: 3000,
		    	speed: 1000,
		    	circular: true,
		        btnNext: ".carousel-next",
		        btnPrev: ".carousel-prev"
		    });	
		}, INIT_TIME);
		
	}

	/* 
	 *	Hide all posts except the first
	*/
	$('.postwrapper').each(function(i){
		var $this = $(this);
		$this.css('opacity', 0).hide();
		
		if($('.tags a', this).length > 0){
			$('.tags a', this).each(function(){
				var text = $(this).text();
				if(text.substring(0,7) == 'length-'){
					text = text.substring(7);
					
					text = parseInt(text)*1000;
					text = text + parseInt(INIT_TIME);//add INIT_TIME and multiply by 1000 for ms
					
					text = 'length-'+text;
					console.log('i: '+i+' text: '+text);
					$this.addClass('length '+text);

					if($('.post', this).hasClass('video')){
						$(this).addClass('video-wrapper');
					}else if($('.post', this).hasClass('photoset')){
						$(this).addClass('photoset-wrapper');
					}
				}
			});

		}else{
			var photosetLength = $('.photoset li',this).length*PHOTOSET_TIMEOUT + INIT_TIME;
			if(photosetLength > INIT_TIME){
				$this.addClass('photoset-wrapper length length-'+photosetLength);
			}
		}
		
		$this.detachContent();		
	});
	


	/*
	 *	Functionality to cycle through posts
	*/
	$.fn.timeOutPost = function(idx, total){
		console.log('');
		console.log('------------ NEW POST #'+idx+' ----------');
		var $this = $(this);
		idx++;
		if(idx > total){
			idx = 1;
		}

		if( attachments[ $(this).attr('id') ] != undefined ){
			$(this).show();
			attachments[ $(this).attr('id') ].prependTo(this);
			$(this).initJCarousel();

			setTimeout(function(){
				$this.animate({
					'opacity': 1
				}, FADE_TIME);
			}, INIT_TIME);
		}
		

		var postTime = DEFAULT_POST_TIME;

		if($(this).hasClass('length')){
			var lengthClass = $(this).attr('class');
			lengthClassIdx = lengthClass.indexOf('length-');
			lengthClass = lengthClass.substring(lengthClassIdx+7);
			postTime = parseInt(lengthClass);
		}

		var time = postTime-FADE_TIME;
		console.log('time: '+time);

		
		setTimeout(function(){
				$this.animate({
					'opacity': 0
				}, FADE_TIME, function(){
					$this.find('.post').remove();//detach post content
					$this.hide();
					$('.postwrapper:nth-child('+idx+')').timeOutPost(idx, total);
				});
			}, time);
		
		
	}

	$('.postwrapper:nth-child(1)').timeOutPost(1, $('.postwrapper').length);





});