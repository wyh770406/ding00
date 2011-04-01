$( function() {
    $('.write-msg-right .friends-list .group-caption').toggle(
        function() {
            $(this).parent().find('ul').fadeIn();
            $('img', this).addClass('group-opened');
        },
        function() {
            $(this).parent().find('ul').fadeOut();
            $('img', this).removeClass('group-opened');
        }
    );
    
    $('.write-msg-right .friends-list .friends-group ul li').click( function() {
        $('#addressee').parent().find('.ctrl-address-box').remove();
        var $box = $('.ctrl-address-box').clone().appendTo( $('#addressee').parent() ).fadeIn();
        $box.find('span').html( $('span', this).html() );
        $('#message_recv_id').val( $(this).attr('userid') );
        $box.find( 'a' ).click( function() { $box.remove(); $('#message_recv_id').val(''); } );
    } );
    
    $('.ctrl-address-box a').click( function() { $(this).parent().remove(); $('#message_recv_id').val(''); });
} );
