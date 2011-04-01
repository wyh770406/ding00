function onsuccess() {
}

//$(function () {
function start_edit(img_url) {
    var photoeditor = $('#avatar_editor').photoeditor({
        image: img_url,
        framecss: {
            width: 266,
            height: 266,
            border_width: 2,
            border_color: '#999'
        }
    });
	
	$('#save_avatar').click(function() {
		photoeditor.send($(this).attr('url'), 'post', {}, onsuccess);
	});
}
// 	
// 	$('#cancel').click(function() {
// 		photoeditor.cancel();
// 	});
//});
