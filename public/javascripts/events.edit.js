$(function () {
    $('.ctrls-box .ctrls-box-left .ok').click( function() {
        $('#friend_selector').hide();
        $('#btn_invitation').show();
        $('#select_friend_num').show();
        var ids = get_selections();
        $('#event_invitations').val( ids.toString() );
        $('.selection_tip').html( '已选择好友(' + ids.length + ')' );
    } );
} );
    
function show_friend_select() {
    var ids = $('#event_invitations').val().split( ',' );
    set_selections( ids );
    $('#friend_selector').show();
    $('#btn_invitation').hide();
    $('#select_friend_num').hide();
    load_friends($('#event_invitations').attr('url_for'));
}

Ext.BLANK_IMAGE_URL = '/images/bg.png';

Ext.events_edit = function() {
    var cover = null;
    var createCover = function() {
        cover = new Ext.ux.ImageSelectDialog({
            selecttext: '选择',
            selectCallback: function() { cover.close(); setCover(cover.data); },
            cancelCallback: function() { cover.close(); },
            imageList: '/users/image_list',
            uploadURL: '/users/upload_image',
            deleteURL: '/users/delete_image'
        });
    }
    
    var setCover = function(data) {
        var config = {
            tag: 'img',
            cls: 'cover',
            src: data.url
        };
        
        if (data.width > data.height)
            config = Ext.apply({width: 100}, config);
        else
            config = Ext.apply({height: 100}, config);
        
        Ext.get('cover-td-frame').first('img').remove();
        Ext.get('cover-td-frame').createChild(config);
        Ext.get('event_cover_url').dom.value = data.url;
    }

    return {
        init: function() {
            Ext.QuickTips.init();  // enable tooltips
            
            /* Datepicker */
            var beginat = new Ext.form.DateField({
                renderTo: 'begin_at',
                readOnly: true,
                format: 'Y-m-d',
                value: Ext.get('begin_at_value').getValue(),
                name: 'event[begin_at]',
                width: 100,
                height: 35,
                maxValue: Ext.get('end_at_value').getValue()
            });
            
            var begintime = new Ext.form.TimeField({
                renderTo: 'begin_time',
                editable: false,
                increment: 30,
                format: 'H:i',
                value: Ext.get('begin_time_value').getValue(),
                name: 'event[begin_time]',
                width: 90
            });
            
            var endat = new Ext.form.DateField({
                renderTo: 'end_at',
                readOnly: true,
                format: 'Y-m-d',
                value: Ext.get('end_at_value').getValue(),
                name: 'event[end_at]',
                width: 100,
                height: 35,
                minValue: Ext.get('begin_at_value').getValue(),
                listeners: {
                    'change': {fn: function(e, newValue) {beginat.maxValue = newValue; beginat.validate();}, scope: this}
                }
            });
            
            var endtime = new Ext.form.TimeField({
                renderTo: 'end_time',
                editable: false,
                increment: 30,
                format: 'H:i',
                value: Ext.get('end_time_value').getValue(),
                name: 'event[end_time]',
                width: 90
            });

            var editor = new Ext.ux.HtmlEditorImage({
            //var editor = new Ext.form.HtmlEditor({
                title: 'HTML Editor',
                el: 'event_description',
                fontFamilies: ['宋体', '黑体', '楷体_GB2312', '新宋体', '仿宋_GB2312', '微软雅黑', 'Arial', 'Verdana', 'tahoma', 'Simsun', 'Mingliu', 'Helvetica'],
                enableLinks: false,
                enableSourceEdit: false,
                width: 757,
                height: 390,
                imageList: '/users/image_list',
                uploadURL: '/users/upload_image',
                deleteURL: '/users/delete_image'
            });
            editor.render();
            
            var asd = new Ext.Resizable(editor.wrap, {
                pinned: true,
                handles: 's',
                width: 757,
                height: 390,
                minWidth: 757,
                minHeight: 390,
                dynamic: true,
                listeners : {
                    'resize' : function(resizable, height, width) {
                       editor.setSize(height,width);
                    }
                }
            });
           
            var btnCover = new Ext.Button({
                text: '选择封面',
                renderTo: 'btn_cover',
                iconCls: 'icon-cover',
                handler: function() { createCover(); cover.show(); }
            });
            
            var btnRemind = new Ext.Button({
                text: '添加提醒',
                renderTo: 'btn_remind',
                iconCls: 'icon-plus',
                handler: function() { alert('功能即将开放'); }
            });
            
            var btnInvitation = new Ext.Button({
                text: '添加邀请人',
                renderTo: 'btn_invitation',
                iconCls: 'icon-plus',
                handler: show_friend_select
            });
            
            var btnSave = new Ext.Button({
                text: '保存',
                renderTo: 'btn_save',
                handler: function() { Ext.get('event_detail_form').dom.submit(); }
            });
            
            var btnCancel = new Ext.Button({
                text: '舍弃',
                renderTo: 'btn_cancel',
                handler: function() { history.back(); }
            });

        }
    };
}();

Ext.onReady(Ext.events_edit.init, Ext.events_edit);