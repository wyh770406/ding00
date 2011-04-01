var all_friends = null;
var selections = new Array();

var FRIENDS_BOX = '.friends-box';
var EL_UL_ALL_FRIENDS = '.all-friends';
var EL_UL_SELECTED_FRIENDS = '.selected-friends';
var EL_UL_UNSELECTED_FRIENDS = '.unselected-friends';
var TAB_TEXTS = ['全部', '已选', '未选'];

function load_friends(url) {
    $.getJSON(url,
        function( data ){
            all_friends = data;
            add_all_users();
        }
    ); 
}

function set_selections(ids)
{
    selections = ids;
}

function get_selections()
{
    selections = [];
    
    for ( i = 0; i < all_friends.length; i++ ) {
        if ( all_friends[i].user.selected )
            selections.push( all_friends[i].user.id );
    }
        
    return selections;
}

function is_selected(id)
{
    for ( var i = 0; i < selections.length; i++ )
        if (selections[i] == id) return true;
        
    return false;
}

function select_friend(id, selected) {
    var user;
    
    for (i = 0; i < all_friends.length; i++) {
        if ( id == all_friends[i].user.id ) {
            user = all_friends[i].user;
            user.selected = selected;
            break;
        }
    }
}

function update_user($user, status)
{
    if ( $user == undefined ) return false;
    
    var $el = $(EL_UL_ALL_FRIENDS, FRIENDS_BOX);
    if ($el.length == 0) return false;
    
    var had = false;
    var $li;
    
    $el.children().each( function(i) {
        if ( $(this).attr( 'user_id' ) == $user.attr( 'user_id' ) ) {
            had = true;
            $li = $(this);
        }
    } );
    
    if ( had ) {
        if ( !status ) {
            update_item_status( $li, false );
            select_friend( $li.attr( 'user_id' ), false );
        } else {
            update_item_status( $li, true );
            select_friend( $li.attr( 'user_id' ), true );
        }
    }
}

function add_all_users() {
    var $el = $(EL_UL_ALL_FRIENDS, FRIENDS_BOX);
    
    if ($el.length == 0) return false;
    
    if ( $el.children().length > 0 ) $el.children().remove();
    
    var $user;
    
    for ( t = 0; t < all_friends.length; t++ ) {
        user = all_friends[t].user;
        $user = generate_friends( user,
            function(id, li) { select_friend( id, true ); update_selected_users(li, true); update_unselected_users(li, false) },
            function(id, li) { select_friend( id, false ); update_selected_users(li, false); update_unselected_users(li, true) }
        );
        $user.appendTo( $el );
        
        if ( is_selected( user.id ) ) {
            update_selected_users( $user, true );
            select_friend( user.id, true );
        } else {
            update_unselected_users( $user, true );
            select_friend( user.id, false );
        }
            
        update_item_status( $user, user.selected );
    }
    
    $('a', '.ctrls-box-right').eq(0).html( '全部(' + $el.children().length + ')' );
}

function update_selected_users($user, add) {
    var $el = $(EL_UL_SELECTED_FRIENDS, FRIENDS_BOX);
    var had = false;
    var $li;
    
    $el.children().each( function(i) {
        if ( $(this).attr( 'user_id' ) == $user.attr( 'user_id' ) ) {
            had = true;
            $li = $(this);
        }
    } );
    
    if ( had && !add ) {
        $li.remove();
    } else if ( !had && add ) {
        $li = $user.clone();
        update_item_status( $li, true );
        $li.appendTo( $el );
        $li.click( function() {
             update_selected_users($(this), false);
             update_unselected_users($(this), true);
        } );
    }
    
    update_user( $li, add );
    $('a', '.ctrls-box-right').eq(1).html( '已选(' + $el.children().length + ')' );
}

function update_unselected_users($user, add) {
    var $el = $(EL_UL_UNSELECTED_FRIENDS, FRIENDS_BOX);
    var had = false;
    var $li;
    
    $el.children().each( function(i) {
        if ( $(this).attr( 'user_id' ) == $user.attr( 'user_id' ) ) {
            had = true;
            $li = $(this);
        }
    } );
    
    if ( had && !add ) {
        $li.remove();
    } else if ( !had && add ) {
        $li = $user.clone();
        update_item_status( $li, false );
        $li.appendTo( $el );
        $li.click( function() {
             update_selected_users($(this), true);
             update_unselected_users($(this), false);
        } );
    }
    
    //update_user( $li, add );
    $('a', '.ctrls-box-right').eq(2).html( '未选(' + $el.children().length + ')' );
}

function generate_friends(user, fn_add, fn_remove) {
    $li = $('<li>').attr( 'user_id', user.id );
    $span = $('<span>').appendTo($li);
    $image = $('<img>').attr( 'src', user.avatar_url ).appendTo($span);
    $name = $('<span>').addClass('user-name').html(user.name).appendTo($li);

    $li.click( function() {
        if ( $(this).hasClass( 'selected' ) ) {
            update_item_status( $(this), false );
            fn_remove.call( this, $(this).attr( 'user_id' ), $(this) );
        } else {
            update_item_status( $(this), true );
            fn_add.call( this, $(this).attr( 'user_id' ), $(this) );
        }
    } );
    
    return $li;
}

function update_item_status($li, selected)
{
    if ( selected ) {
        $li.addClass( 'selected' );
        $li.children( 'span' ).addClass( 'selected' );
    } else {
        $li.removeClass( 'selected' );
        $li.children( 'span' ).removeClass( 'selected' );
    }
}

$(function() {
    $('.tabs', '.friend-selector-frame').click( function() {
        var index = $( 'li.ctrl' ).index( $(this).parent() );
        
        if ( $(this).hasClass( 'disactive' ) ) {
            $('.tabs', '.friend-selector-frame').each( function() {
                $(this).removeClass( 'ctrl-button-66x26' );
                $(this).addClass( 'disactive' );
            });
            $(this).addClass( 'ctrl-button-66x26' );
            $(this).removeClass( 'disactive' );
            $('ul', '.friends-box').hide();
            $('ul', '.friends-box').eq(index).show();
        }
    });
});