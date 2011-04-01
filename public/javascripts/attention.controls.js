$( function() {
    reset_controls();
} );

function reset_controls() {
    $('.attention-cancel span.cancel a')
    .mouseenter( function() {
        $('.attention-cancel .cancel-tip').show();
    } )
    .mouseleave( function() {
        $('.attention-cancel .cancel-tip').hide();
    } );
}
