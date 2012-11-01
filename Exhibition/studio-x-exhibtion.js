$(document).ready(function () {

	var PHOTOSET_AUTO = 3000;
	var PHOTOSET_SPEED = 1000;
	var PHOTOSET_TIMEOUT = PHOTOSET_AUTO + PHOTOSET_SPEED;
	/* 
	 *	Hide all posts except the first
	*/
	$('.postwrapper').each(function(i){
		console.log('i: '+i);
		var $this = $(this);
		if(i != 0){
			$(this).hide();
		}
		var photosetLength = $('.photoset li',this).length*PHOTOSET_TIMEOUT;

		if(photosetLength > 0){
			$this.addClass('photoset-wrapper length length-'+photosetLength);
		}

		$('.tags a', this).each(function(){
			var text = $(this).text();
			if(text.substring(0,6) == 'length'){
				console.log($(this).text());
				text = text.substring(7);

				$this.addClass('video-wrapper length length-'+text+'000');
			}
		});

		
	});

	/*
	 *	Add cycle counts to each postwrapper to know the
	 *	number of photos in photosets	
	*/


	var MAX_CAPTION_LENGTH = 400;
	var MAX_TEXTPOST_LENGTH = 500;
	var MAX_QUOTEPOST_LENGTH = 200;

	var POSTS = 10;
	
	var truncate = function(){
      $('body:not(.permalink-page) .caption').truncate({max_length: MAX_CAPTION_LENGTH});
      $('body:not(.permalink-page) .text-body').truncate({max_length: MAX_TEXTPOST_LENGTH});
      $('body:not(.permalink-page) .post.quote .realpost').truncate({max_length: MAX_QUOTEPOST_LENGTH});
    }
    
    truncate(false);
    
    $(window).bind("load", function() {
    	console.log('LOADED');
		$(document).bind('DOMNodeInserted', function(){
			console.log('DOMNodeInserted');
			//truncate(true);
		});
	});


	$(function() {
	    $(".photoset-carousel").jCarouselLite({
	    	visible: 1,
	    	auto: 3000,
	    	speed: 1000,
	    	circular: true,
	        btnNext: ".carousel-next",
	        btnPrev: ".carousel-prev"
	    });
	});



	/*
	 *	Functionality to cycle through posts
	*/


	$.fn.timeOutPost = function(idx, total){
		var $this = $(this);
		idx++;
		if(idx > total){
			idx = 1;
		}
		console.log('entering timeOutPost');
		console.log('classes: '+$(this).attr('class') );
		$(this).show();

		var postTime = 5000;

		if($(this).hasClass('length')){
			var lengthClass = $(this).attr('class');
			lengthClassIdx = lengthClass.indexOf('length-');
			lengthClass = lengthClass.substring(lengthClassIdx+7);
			postTime = parseInt(lengthClass);
			console.log('new postTime: '+postTime);
		}

		setTimeout(function(){
			console.log('hiding, postTime: '+postTime);
			$this.hide();
			$('.postwrapper:nth-child('+idx+')').timeOutPost(idx, total);
		}, postTime);
	}

	$('.postwrapper:nth-child(1)').timeOutPost(1, $('.postwrapper').length);





});