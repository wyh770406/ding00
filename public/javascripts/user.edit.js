function show_avatar_upload() {
    $.blockUI( {
	    css: {
		    padding:	0,
		    margin:		0,
		    width:		'auto',
		    top:		'20%',
		    left:		'35%',
		    textAlign:	'center',
		    color:		'#000',
		    border:		'none',
		    backgroundColor:'#fff',
		    cursor:		'default'
	    }
	    , overlayCSS: { backgroundColor: '#ececec' }
        , message : $('#upload_avatar')
    } );
}

function show_avatar_edit() {
    $.blockUI( {
	    css: {
		    padding:	0,
		    margin:		0,
		    width:		'auto',
		    top:		'20%',
		    left:		'35%',
		    textAlign:	'center',
		    color:		'#000',
		    border:		'none',
		    backgroundColor:'#fff',
		    cursor:		'default'
	    }
	    , overlayCSS: { backgroundColor: '#ececec' }
        , message : $('#avatar_editor')
    } );
}

function onsuccess(r) {
    $('#avatar_preview').attr('src', r );
}

function start_edit(img_url) {
    $('#upload_avatar').reset();
    $.unblockUI( { fadeOut : 0 } );
    show_avatar_edit();
    var photoeditor = $('#avatar_editor .templates-avatar-editor').photoeditor({
        image: img_url,
        framecss: {
            width: 266,
            height: 266,
            border_width: 2,
            border_color: '#999'
        }
    });
	
	$('#save_avatar').click(function() {
		photoeditor.send($(this).attr('url'), 'post', { 'update_type' : 'img' }, onsuccess);
		$.unblockUI();
	});
	
	$('#cancel_save_avatar').click( function() {
	    $.unblockUI( { fadeOut: 0 } );
	    $('#upload_avatar form').reset();
	} );
}

$(function() {
    $('#address_text').showcity( {
        container   : 'show_address_div'
        , input     : 'address_text'
        , css       : {
              close   : 'ctrl-button ctrl-button-50x20'
            , prov_frame : 'prov-frame'
            , city_frame : 'city-frame'
            , ctrls_frame : 'ctrls-frame'
            , icon  : 'icon'
            , prov  : 'prov'
            , city  : 'city'
        }
        , result : ['user_userdetail_attributes_now_country', 'user_userdetail_attributes_now_province', 'user_userdetail_attributes_now_city']
    } );
} );
