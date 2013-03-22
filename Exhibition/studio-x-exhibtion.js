$(document).ready(function () {

	var DEFAULT_POST_TIME = 5000;
	var PHOTOSET_AUTO = 3000;
	var PHOTOSET_SPEED = 1000;
	var INIT_TIME = 100;//increase this for slow internet connections (should be less than FADE_TIME)
	var FADE_TIME = 2000;
	var PHOTOSET_TIMEOUT = PHOTOSET_AUTO + PHOTOSET_SPEED+INIT_TIME+FADE_TIME;
	var MAX_POSTS = 10;
	var attachments = new Array();
	var splits = new Array();

	var autoplayYoutube = function(str){
		var count = str.match(/youtube.com/g); //number of occurences of 'youtube.com'
		if(count != null){
			
			var idx = str.indexOf('youtube.com');
			idx = str.indexOf('"', idx);

			var autoplay = '&amp;autoplay=1';

			var output = [str.slice(0, idx), autoplay, str.slice(idx)].join('');

			//for loop only handles additional occurances, not the first
			for(i=1;i<count.length;i++){
				idx = output.indexOf('youtube.com', idx+autoplay.length);
				idx = output.indexOf('"', idx);
				output = [output.slice(0, idx), autoplay, output.slice(idx)].join('');
			}

			return output;
		}else{
			return false;
		}
	}

	/*
	 *	Initializes JCarousel on photosets
	*/
	$.fn.initJCarousel = function(){
		$(".photoset-carousel").jCarouselLite({
	    	visible: 1,
	    	auto: 3000,
	    	speed: 1000,
	    	circular: true,
	        btnNext: ".carousel-next",
	        btnPrev: ".carousel-prev"
	    });	
	}

	/*
	 *	Detaches all embedded content, like videos, and even photosets, which
	 *	will be reattached - with .prependTo() - later when the post is visible
	*/
	$.fn.detachAllContent = function(){
		$('.post-content-container', this).each(function(){
			var postID = $(this).closest('.postwrapper').attr('id');
			attachments[ postID ] = $(this).detach();

			if( attachments[ postID ].find('.embed-container').length > 0){
				attachments[ postID ].find('.embed-container').each(function(){
					var newHTML = autoplayYoutube( $(this).html() );
					if(newHTML){
						$(this).html( newHTML );
					}
				});
			}
		});
	}

	$.fn.attachContent = function(thisID){

		console.log('attaching: '+attachments[ thisID ].html());

		attachments[ thisID ].prependTo(this);

		setTimeout(function(){
			$(this).initJCarousel();
		}, INIT_TIME);

		

	}





	var foreverPost = false;

	var combineSplits = function(){
		console.log('entering ------------------combineSplits()');
		$('.tags a').each(function(){
			console.log('this text() indexOf(): '+ $(this).text().indexOf('split-'));
			if($(this).text().indexOf('split-') >= 0){
				var className = $(this).text()+'-concat';

				if( $( '.'+className ).length > 0 ){
					var $that = $(this).closest('.postwrapper');
					$(this).closest('.post-content').appendTo( $( '.'+className ).find('.post-content-container') );

					//$('.last-split').removeClass('last-split');
					
					$( '.'+className ).find('.post-content-container .post-content:last-child').addClass('last-split');
					$that.remove();
				}else{//first such split
					$(this).closest('.postwrapper').addClass( 'split '+className );
				}
			}
		});
	}

	combineSplits();

	$('.tags a').each(function(){
		if($(this).text() == 'length-forever'){
			$(this).text('');
			foreverPost = true;
			$('.postwrapper').css('opacity', 0);
			var $pw = $(this).closest('.postwrapper').detach();
			$('.postwrapper').remove();//remove all postwrappers
			$pw.prependTo('#content');//re-add the length-forever post

			$pw.initJCarousel();

			setTimeout(function(){
				$pw.animate({
					'opacity': 1
				}, FADE_TIME);
			}, INIT_TIME);
		}
	});

	if(!foreverPost){
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
			
			$this.detachAllContent();		
		});
		


		/*
		 *	Functionality to cycle through posts
		*/
		$.fn.timeOutPost = function(idx, total){
			console.log('');
			console.log('------------ NEW POST #'+idx+' ----------');
			var $this = $(this);
			var postID = $(this).attr('id');
			idx++;
			if(idx > total){
				idx = 1;
			}

			if( attachments[ postID ] != undefined ){
				$(this).show();
				
				$(this).attachContent( postID );
				
				

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

			
			setTimeout(function(){
					$this.animate({
						'opacity': 0
					}, FADE_TIME, function(){
						$this.find('.post-content-container').remove();//detach post content
						$this.hide();
						$('.postwrapper:nth-child('+idx+')').timeOutPost(idx, total);
					});
				}, time);
			
			
		}

		$('.postwrapper:nth-child(1)').timeOutPost(1, $('.postwrapper').length);
	}//end if(!foreverPost)




});