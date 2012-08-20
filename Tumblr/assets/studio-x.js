$(document).ready(function () {
	var MAX_CAPTION_LENGTH = 400;


	$(function() {
      $('body:not(.permalink-page) .caption').truncate({max_length: MAX_CAPTION_LENGTH});
    });

});