function on_mode_before() {
    $('.events-tabs a').attr( 'disabled', 'disabled' );
}

function on_mode_success() {
    $('.events-tabs a').removeAttr( 'disabled' );
}

$(function () {
    $('.events-tabs a').click( function() {
        $('.events-tabs span').removeClass( 'active-tab' );
        $(this).parent().addClass( 'active-tab' );
    });
});
