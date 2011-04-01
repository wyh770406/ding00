$(function() {
    $.blockUI.defaults.cloneMessage = true;
    $.blockUI.defaults.css = {
          cursor: 'default'
        , width: '100%'
        , height: '160px'
    };
    $.blockUI.defaults.overlayCSS = {
        cursor: 'default',
        backgroundColor: '#ececec',
        opacity: '0.75'
    };
    
    $('ul.attentions-operable .attentions-item')
    .mouseenter(function() {
        $(this).block( { message : $('.attentions-operations-box') } );
        //$('.overflow-main a', '.events-list-overflow').attr( 'href', $('.event-item-href', this).val() );
        //$('span:eq(1)', '.overflow-top-right').html( $('.event-item-invitations').val() );
    } )
    .mouseleave(function() {
        $(this).unblock( { fadeOut: 0 } );
    } );
} );