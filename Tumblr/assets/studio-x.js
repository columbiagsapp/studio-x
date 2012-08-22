$(document).ready(function () {
	var s = "<p>Hello World!</p><p>By Mars</p>";
						var o = $(s);
						var text = o.text();
						console.log('troy: ' + text);

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
	

});