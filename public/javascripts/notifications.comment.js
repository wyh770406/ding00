//Ext.namespace('Ext.Ding00.Notifications');

Ext.Ding00.Notifications.Comments = function(){
    Ext.QuickTips.init();
    
    var deleteBtn;
    var comments;
    
    function performAction(e){
        Ext.Ajax.request({
            url: e.action,
            success: function(response){
                Ext.Msg.show({
                    title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300,
                    fn: function() {
                        comments.store.reload();
                    }
                });
            },
            failure: function(response){
                Ext.Msg.show({title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300, 
                    fn: function(){
                       Ext.get(e).parent('td.ctrl').unmask();
                    }
                });
            }
        });
    }
    
    var store = new Ext.data.JsonStore({
        url: '/notifications/getinvitations',
        root: 'comments',
        fields: ['id', 'username', 'userid', 'avatarurl', 'eventtitle', 'eventid', 'actions', 'begin_date', 'end_date', 'address'],
        listeners: {
            load: {
                fn: function(s, records){
                    comments.el.select('div.button a').each(function(btn){
                        btn.on('click', function(e){
                            Ext.get(e.target).parent('td.ctrl').mask();
                            performAction(e.target);
                        });
                    });
                }
            }
        }
    });
    store.load();
    
    var tpl = new Ext.XTemplate(
        '<table class="outer-table" cellspacing="1">',
            '<tpl for=".">',
                '<tr class="item">',
                    '<td class="checkbox-column"><input type="checkbox"></td>',
                    '<td class="userinfo">',
                        '<div class="avatar"><a href="/home/friend/{userid}" title="{username}"><img src="{avatarurl}" alt="{username}" /></a></div>',
                        '<div class="name"><a href="/home/friend/{userid}" title="{username}">{username}</a></div>',
                    '</td>',
                    '<td class="content">',
                        '邀请您参加活动: <a href="/events/{eventid}" title="{eventtitle}">{eventtitle}</a>',
                        '<br />地点: {address}  开始时间: {begin_date}  结束时间: {end_date}</td>',
                    '<td class="ctrl">',
                        '<tpl for="actions">',
                            '<div class="button"><a href="javascript:void(0)" action="{url}" title="{text}" class="ctrl-button ctrl-ok-64x23">{text}</a></div>',
                        '</tpl>',
                    '</td>',
                '</tr>',
            '</tpl>',
        '</table>'
    );
    tpl.compile();
    
    comments = new Ext.DataView({
        el: 'comment-frame',
        store: store,
        tpl: tpl,
        cls: 'comments',
        overClass:'item-hover',
        itemSelector:'tr.item',
        selectedClass:'item-selected',
        emptyText: '没有邀请',
        //singleSelect: true,
        autoHeight: true,
        listeners: {
            beforeclick : function(d, i, item, e) { 
                var nodeName = String(e.getTarget().nodeName).toUpperCase();
                if (nodeName == 'A' || nodeName == 'IMG' || nodeName == 'INPUT') {
                    return false; 
                } 
            },
        	click: {
        	    fn: function(dv, index, node, e){
        	        if (String(e.getTarget().nodeName).toUpperCase() == 'TD') {
        	            var dom = Ext.get(node).child('td.checkbox-column input').dom;
        	            dom.checked = !dom.checked;
        	        }
        	        else
        	            return true;
        	    }
        	},
        	selectionchange: {
        	    fn: function(dv, nodes){
        	        
        	    }
        	}
        },
        selectAll: function(checked){
            Ext.each(this.all.elements, function(item){
                Ext.get(item).child('.checkbox-column input').dom.checked = checked;
            });
        }
    });

    return {
        init: function(){
            comments.render();
            deleteBtn = new Ext.Button({
                renderTo: 'delete-btn',
                text: '删除'
            });
            Ext.get('check-all').on('click', function(e){
                var checked = e.target.checked;
                comments.selectAll(checked);
            });
        }
    }
}();


Ext.onReady(Ext.Ding00.Notifications.Comments.init, Ext.Ding00.Notifications.Comments);
