var favorite_link = function(url) {
    $.ajax({data:'authenticity_token=' + encodeURIComponent(authenticity_token),
        error:function(request){show_tip_box(request)},
        success:function(request){$('#tip_box').html(request);show_tip_box(request)},
        type:'post',
        url: url
    });
    return false;
};

var attending_link = function(url) {
    $.ajax({data:'authenticity_token=' + encodeURIComponent(authenticity_token),
        error:function(request){show_tip_box(request)},
        success:function(request){$('#tip_box').html(request);show_tip_box(request)},
        type:'post',
        url: url
    });
    return false;
};

function init_events_list() {
    $.blockUI.defaults.cloneMessage = true;
    $.blockUI.defaults.css = {
        cursor: 'default'
    };
    $.blockUI.defaults.overlayCSS = {
        cursor: 'default',
        backgroundColor: '#ececec',
        opacity: '0.75'
    };
    
    $('.calendar-table .events-list ul')
    .mouseenter(function() {
        $(this).block( { message : $('.events-list-overflow') } );
        $('.overflow-main a', '.events-list-overflow').attr( 'href', $('.event-item-href', this).val() );

        $('span:eq(1)', '.overflow-top-left').html( $('.event-item-favorites', this).val() );
        $('span:eq(1)', '.overflow-top-right').html( $('.event-item-attendings', this).val() );

        $('.overflow-top-left a', '.events-list-overflow').attr('href', $('.event-item-addfavhref', this).val());
        $('.overflow-top-right a', '.events-list-overflow').attr('href', $('.event-item-attendeventhref', this).val());

        var canfavorite = $('.event-can-favorite', this).val();
        var canattending = $('.event-can-attending', this).val();
        if (canfavorite == "false")
            $('.overflow-top-left').show();
        else
            $('.overflow-top-left').hide();
        
        if (canattending == "false")
            $('.overflow-top-right').show();
        else
            $('.overflow-top-right').hide();
    } )
    .mouseleave(function() {
        $(this).unblock( { fadeOut: 0 } );
    } );

    $('.overflow-top-left a', '.events-list-overflow').click( function() {
        var url = $(this).attr('href');
        favorite_link(url);
        return false;
    });

    $('.overflow-top-right a', '.events-list-overflow').click( function() {
        var url = $(this).attr('href');
        attending_link(url);
        return false;
    });
}

