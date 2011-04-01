function on_spinner(el) {
    $('span', el).hide();
    $('img', el).attr('src', '/images/loading.gif');
    $('img', el).show();
}

function on_success(el) {
    $('span', el).attr('isok', 'true').hide();
    $('img', el).attr('src', '/images/rigth_26x26.png').fadeIn();
}

function on_failure(el, err_text) {
    $('span', el).html( err_text );
    $('span', el).attr('isok', 'false').fadeIn();
    $('img', el).hide();
}

function on_submit(form) {
    var isok = true;
//    window.console.log( '[DING00] on_submit' );
    
//    $('.field-row .text').blur();
//    $('.tip-box', form).each(function () {
//        if ($(this).attr('isok') == 'false') {
//            isok = false;
//            return;
//        }
//    });
    $('.tip-box', form).each( function() {
        var attr = $(this).attr('isok');
  //      window.console.log( $(this).attr('id') + ': ' + attr );
        if (attr == undefined) {
            isok = false;
            $(this).parents('.field-row').find('.text').blur();
        } else if (attr != 'true') {
            isok = false;
        }
    } );
    
 //   window.console.log( 'isok: ' + isok );
    if (isok) form.submit();
}

$(function () {
//    $('.tip-box', '#user_form').each(function () {
//        $(this).attr('isok', 'false');
//    });
    
    LoadJS( 'http://fw.qq.com:80/ipaddress', function() {
        if (typeof IPData != 'undefined') {
            city_name = IPData[3].length == 0 ? IPData[2].replace( '省', '' ).replace( '市', '' ) : IPData[3].replace( '市', '' );
            prov_name = IPData[2].replace( '省', '' ).replace( '市', '' );
            $('#location_span').html( city_name );
            $('#user_userdetail_attributes_now_country').val( '中国' );
            $('#user_userdetail_attributes_now_province').val( prov_name );
            $('#user_userdetail_attributes_now_city').val( city_name );
        }
    } );
    
    $('#manual_search').showcity( {
        container   : 'show_address_div'
        , input     : 'location_span'
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
})