var update_del_ids = function(el) {
    var ids = [];
    
    $('.msg-lists ul li input:checked').each( function() {
        ids.push($(this).val());
    } );
    $(el).attr('href', $(el).attr('delurl') + '&ids=' + ids.toString());
};

$( function() {
    $('#select_all').click( function(e) {
        var unchecked = ($(".msg-lists input:not(:checked)").length > 0);
        if ( unchecked )
            $(this).attr( 'checked', true );
        $('input:checkbox', '.msg-lists').attr( 'checked', unchecked );
    } );
} );
