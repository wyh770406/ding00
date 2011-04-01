
Ext.BLANK_IMAGE_URL = '/images/bg.png';

Ext.namespace('Ext.events');

Ext.events.ReplyPanel = function(config) {
    config = config || {};
    Ext.apply(this, {
        border: false,
        layout: 'fit',
        cls: 'content',
        items: [{
            hideLabel: true,
            width: 674,
            border: false,
            emptyText: '填写回复内容...',
            blankText: '内容不能为空',
            allowBlank: false,
            name: 'comment_body'
        }, {
            xtype: 'hidden',
            name: 'event_id',
            value: config.eventid
        }],
        buttonAlign: 'right',
        buttons: [{
            text: '写上去',
            iconCls: 'icon-plus',
            scope: this,
            handler: function(){
                if (this.form.isValid()){
                    this.form.submit({
                        url: '/comments/create',
                        success: function(form, action){
                            if (action.result.comment)
                                config.newhandler.fn(action.result.comment);
                            form.reset();
                        },
                        failure: function(form, action){
                            //Ext.Msg.alert('保存失败', action.response.responseText);
                        },
                        waitMsg: '正在提交评论信息, 请稍等...'
                    });
                }
            }
        }]
    });
    
    Ext.events.ReplyPanel.superclass.constructor.call(this);
};
Ext.extend(Ext.events.ReplyPanel, Ext.FormPanel, {
    defaultType: 'textarea'
});

Ext.events.ReplyUserPanel = function(config) {
    Ext.apply(this, config);
    this.addEvents(
        'saved'
        ,'cancel'
    );
    Ext.events.ReplyUserPanel.superclass.constructor.call(this);
};
Ext.extend(Ext.events.ReplyUserPanel, Ext.FormPanel, {
    successHandler: function() {
        var panel = this;
        if (panel.form.isValid()) {
            panel.form.submit({
                url: panel.url,
                success: function(form, action){
                    form.reset();
                    if(true !== panel.eventsSuspended) {
                        panel.fireEvent('saved', panel);
                    }
                },
                failure: function(form, action){
                    //Ext.Msg.alert('保存失败', action.response.responseText);
                },
                waitMsg: '正在提交评论信息, 请稍等...'
            });
        }
    }
    
    ,cancelHandler: function() {
        if (true !== this.eventsSuspended) {
            this.fireEvent('cancel', this);
        }
    }
    
    ,initComponent: function() {
        Ext.apply(this, {
            border: false
            ,cls: 'reply-user-panel'
            ,items: [{
                hideLabel: true
                ,name: 'reply_comment_body'
                ,xtype: 'textarea'
                ,width: '70%'
                ,emptyText: '填写回复内容...'
                ,blankText: '内容不能为空'
                ,allowBlank: false
            }, {
                xtype: 'hidden'
                ,name: 'comment_id'
                ,value: this.comment_id
            }]
            ,buttonAlign: 'right'
            ,buttons: [{
                text: '回复'
                ,handler: this.successHandler
                ,scope: this
            }, {
                text: '取消'
                ,handler: this.cancelHandler
                ,scope: this
            }]
        });
        
        Ext.events.ReplyUserPanel.superclass.initComponent.call(this);
    }
    
});

Ext.events.CommentActions = function(config) {
    Ext.apply(this, config);
    
    this.addEvents(
        'action'
        ,'beforeaction'
    );
    
    Ext.events.CommentActions.superclass.constructor.call(this);
};

Ext.extend(Ext.events.CommentActions, Ext.util.Observable, {
    actionEvent:'click'
    ,tpl:'<tpl for="actions">'
            + '<div class="ux-cell-action" action="reply{0}">'
                + '<a href="javascript:void(0)" title="回复{0}的评论" class="high-light">{text}</a>'
            + '</div>'
        + '</tpl>'
    ,init:function(grid) {
        this.grid = grid;
        grid.afterRender = grid.afterRender.createSequence(this.onRenderGrid, this);
        var cm = this.grid.getColumnModel();
        Ext.each(cm.config, function(c, idx) {
            if ('object' === typeof c.cellActions) {
                c.origRenderer = cm.getRenderer(idx);
                c.renderer = this.renderActions.createDelegate(this);
            }
        }, this);
    }
    ,onRenderGrid:function() {
		this.view = this.grid.getView();
		var cfg = {scope:this};
		cfg[this.actionEvent] = this.onClick;
		this.view.mainBody.on(cfg);
    }
    ,renderActions:function(value, cell, record, row, col, store) {
        var c = this.grid.getColumnModel().config[col];
        var val = c.origRenderer(value, cell, record, row, col, store);
        
		if(c.cellActions && !c.actionsTpl) {
			c.actionsTpl = this.processActions(c);
			c.actionsTpl.compile();
		}
		else if(!c.cellActions) {
			return val;
		}
		
		var data = this.getData.apply(this, arguments);
		data.value = val;
        
        return c.actionsTpl.apply(data);
    }
    ,getData:function(value, cell, record, row, col, store) {
        return record.data || {};
	}
    ,processActions:function(c) {
        var data = {
            actions: []
        };
        
        Ext.each(c.cellActions, function(a, i) {
            var o = {
                text: a.textIndex ? '{' + a.textIndex + '}' : (a.text ? a.text : '')
                ,action: a.actionIndex ? '{' + a.actionIndex + '}' : (a.action ? a.action : '')
            };
            data.actions.push(o);
        }, this);
        
		var xt = new Ext.XTemplate(this.tpl);
		return new Ext.Template(xt.apply(data));
    }
    ,onClick:function(e, target) {
        var t = e.getTarget('div.ux-cell-action');
        var row = e.getTarget('.x-grid3-row');
		var col = this.view.findCellIndex(target.parentNode.parentNode);
		var c = this.grid.getColumnModel().config[col];
        
        var record, dataIndex, value, action;
        
        if(t) {
            record = this.grid.store.getAt(row.rowIndex);
			dataIndex = c.dataIndex;
			value = record.get(dataIndex);
			action = t.className.replace(/ux-cell-action /, '');
        }
        
        if (false !== row && false !== col && record && dataIndex && action) {
            if (true !== this.eventsSuspended && false === this.fireEvent('beforeaction', this.grid, record, action, value, dataIndex, row.rowIndex, col)) {
                return;
            }
            else if(true !== this.eventsSuspended) {
                this.fireEvent('action', this.grid, record, action, value, dataIndex, row.rowIndex, col);
            }
        }
    }
});

Ext.events.Comments = function(config) {
    config = config || {};
    Ext.apply(this, config);
    Ext.events.Comments.superclass.constructor.call(this);
}

function renderImg(value, p, record){
    var data = record.data;
    return String.format('<a href="/home/friend/{0}" title={1}><img src="{2}" alt="{1}" width="50" height="50" /></a>', 
        data.replyid, data.reply, data.avatar);
}

function renderComment(value, p, record){
    var data = record.data;
    var replystr = record.data.recv.length > 0 ? String.format('<p>回复<a href="/home/friend/{0}" class="high-light">{1}</a>:</p>', data.recvid, data.recv) : '';
    return String.format('<p><a href="/home/friend/{0}" class="high-light">{1}</a> {2}</p>{3}<p class="reply-context" style="padding-left: {5};">{4}</p>', 
        data.replyid, data.reply, data.date, replystr, data.content, record.data.recv.length > 0 ? '24px' : '0');
}

function renderControls(value, p, record){
    var data = record.data;
    p.css = 'comment-ctrls';
    return String.format('<a href="javascript:void(0)" action="reply{0}" title="回复{0}的评论" class="high-light">回复</a>',
        data.reply);
}

Ext.extend(Ext.events.Comments, Ext.grid.GridPanel, {
   
    initComponent:function() {
        this.cellActions = new Ext.events.CommentActions({
            listeners: {
                action:function(grid, record, action, value, dataIndex, rowIndex, col) {
                    grid.view.replyRowIndex = rowIndex;
                    grid.view.refresh();
                    var editor = new Ext.events.ReplyUserPanel({
                        listeners: {
                            saved: function(panel){
                                panel.destroy();
                                grid.view.replyRowIndex = -1;
                                grid.reload();
                            }
                            ,cancel: function(panel){
                                panel.destroy();
                                grid.view.replyRowIndex = -1;
                                grid.view.refresh();
                            }
                        }
                        ,comment_id: record.id
                        ,url: '/comments/reply'
                    });
                    var c = Ext.get(grid.view.getRow(rowIndex)).child('div.x-grid3-row-body');
                    editor.render(c);
                }
            }
        });
        
        Ext.apply(this, {
            store: new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    root: 'comments',
                    totalProperty: 'totalCount',
                    id: 'id',
                    fields: ['id', 'avatar', 'replyid', 'reply', 'recvid', 'recv', 'date', 'content']
                }),
                url: '/comments/index',
                remoteSort: true
            })
            ,columns: [{
                    id: 'avatar',
                    width: 11,
                    renderer: renderImg
                },{
                    renderer: renderComment
                },{
                    width: 10
                    ,align: 'right'
                    ,cellActions: [{text: '回复'}]
                    ,renderer: renderControls
                    ,dataIndex: 'id'
                }
            ]
            ,viewConfig: {
                autoFill: true
                ,scrollOffset: 0
                ,enableRowBody: true
                ,replyRowIndex: -1
                ,editor: new Ext.form.TextArea()
                ,showReplyBox: function(id) {
                    //alert(this.replyRowIndex);
                }
                ,getRowClass : function(record, rowIndex, p, store) {
                    if (this.replyRowIndex === rowIndex) {
                        p.bodyStyle = 'text-align: right';
                    }
                    else {
                        p.body = '';
                    }
                }
            }
            
            ,el: 'event-comments'
            ,sm: new Ext.grid.RowSelectionModel({singleSelect:true})
            ,autoHeight: true
            ,hideHeaders:true
            ,loadMask: {msg: '正在读取回复数据...'}
            ,autoScroll: false
            ,trackMouseOver:true
            
            ,load: function(){
                this.store.load({params:{start:0, event_id:this.event_id, limit:this.pageSize}});
            }
           
            ,reload: function(comment){
                this.store.reload({params:{start:0, event_id:this.event_id, limit:this.pageSize}});
            }
            ,plugins:[this.cellActions]
        });

        this.bbar = new Ext.PagingToolbar({
            pageSize: this.pageSize,
            store: this.store,
            displayInfo: true,
            displayMsg: '当前显示回复 {0} - {1} (共 {2} 条回复)',
            emptyMsg: '还没有回复'
        });
        this.store.baseParams = {event_id:this.event_id};

        Ext.events.Comments.superclass.initComponent.call(this, arguments);
    }
});

Ext.events.show = function() {
    var btn_join;
    var btn_interest;
    var btn_accept;
    var btn_refuse;
    var btn_repent;
    var event_id;
    var test_text = '功能即将开放';
    
    Ext.QuickTips.init();
    
    function update_favorite_count() {
        Ext.Ajax.request({
            url: '/events/favorite_count/' + event_id,
            success: function(response){Ext.get('favorite_count').update(response.responseText);}            
        });
    }
    
    function update_favorite_users() {
        Ext.Ajax.request({
            url: '/events/favorite_users/' + event_id,
            success: function(response){
                var el = Ext.get('favor_user');
                if (el) el.update(response.responseText);
            }
        });
    }
    
    function update_attending_users() {
        Ext.Ajax.request({
            url: '/events/attending_users/' + event_id,
            success: function(response){Ext.get('attending_user').update(response.responseText);}
        });
        Ext.Ajax.request({
            url: '/events/attending_count/' + event_id,
            success: function(response){Ext.get('attending_count').update(response.responseText);}
        });
    }
    
    function btn_handler() {
        alert(test_text);
    }

    function interestHandler() {
        Ext.Ajax.request({
            url: '/events/add_to_favorite/' + event_id,
            success: function(response){
                Ext.Msg.show({title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300,
                    fn: function() {
                        btn_interest.el.parent('td').remove();
                    }
                });
                update_favorite_count();
                update_favorite_users();
            },
            failure: function(response){
                Ext.Msg.show({title: '错误', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR, width: 300});
            }
        });
    }
    
    function acceptHandler() {
        Ext.Ajax.request({
            url: '/events/attending_to_event/' + event_id,
            success: function(response){
                Ext.Msg.show({title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300,
                    fn: function() {
                        Ext.each([btn_accept, btn_refuse, btn_join], function(o){
                            if (o && o != undefined && o.el && o.el.parent('td')) {
                                o.el.parent('td').remove();
                            }
                        });
                        generate_buttons({invited_status:'accepted'});
                    }
                });
                update_attending_users();
            },
            failure: function(response){
                Ext.Msg.show({title: '错误', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR, width: 300});
            }
        });
    }
    
    function refusedHandler(){
        Ext.Ajax.request({
            url: '/events/refuse_to_event/' + event_id,
            success: function(response){
                Ext.Msg.show({title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300,
                    fn: function() {
                        btn_accept.el.parent('td').remove();
                        btn_refuse.el.parent('td').remove();
                        generate_buttons({invited_status:'refused'});
                    }
                });
            },
            failure: function(response){
                Ext.Msg.show({title: '错误', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR, width: 300});
            }
        });
    }
    
    function repentHandler(){
        Ext.Ajax.request({
            url: '/events/back_to_event/' + event_id,
            success: function(response){
                Ext.Msg.show({title: '提示信息', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300,
                    fn: function() {
                        btn_repent.el.parent('td').remove();
                        generate_buttons({invited_status:'pending'});
                    }
                });
                update_attending_users();
            },
            failure: function(response){
                Ext.Msg.show({title: '错误', msg: response.responseText, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR, width: 300});
            }
        });
    }
    
    function create_button_td() {
        return Ext.get('event_buttons').child('tr').createChild({tag:'td', cls:'ctrls'});
    }
    
    function generate_buttons(status) {
        if (status.favorited == 'false'){
            btn_interest = new Ext.Button({
                text: '我要收藏',
                renderTo: create_button_td(),
                handler: interestHandler
            });
        }
        
        if (status.invited_status == 'pending'){
            btn_accept = new Ext.Button({
                text: '接受邀请',
                renderTo: create_button_td(),
                handler: acceptHandler
            });
            btn_refuse = new Ext.Button({
                text: '拒绝邀请',
                renderTo: create_button_td(),
                handler: refusedHandler
            });
        }

        else if (status.invited_status == 'refused'){
            btn_join = new Ext.Button({
                text: '参加',
                renderTo: create_button_td(),
                handler: acceptHandler
            });
        }
        
        else if (status.invited_status == 'accepted'){
            btn_repent = new Ext.Button({
                text: '反悔',
                renderTo: create_button_td(),
                handler: repentHandler
            });
        }
        
        else if (status.invited_status == ''){
            new Ext.Button({
                text: '我要参加',
                renderTo: create_button_td(),
                handler: function(){
                    Ext.Msg.show({title: '提示信息', msg: '您未被事件发起人邀请, <br />请求参加的功能正在开发中...', buttons: Ext.Msg.OK, icon: Ext.Msg.INFO, width: 300});
                }
            });
        }
    }
   
    var replypanel, comments;
    
    return {
        init: function() {
            event_id = Ext.get('event_id').getValue();
            
            Ext.Ajax.request({
                url: '/events/event_status/' + event_id,
                success: function(response){
                    var status = Ext.util.JSON.decode(response.responseText);
                    generate_buttons(status);
                },
                failure: function(response){
                    Ext.Msg.alert('', response.responseText);
                }
            });
            
            comments = new Ext.events.Comments({
                pageSize: 10,
                event_id: event_id
            });
            
            replypanel = new Ext.events.ReplyPanel({
                eventid: event_id,
                newhandler: {
                    fn: comments.reload.createDelegate(comments),
                    scope: comments
                }
            });
            replypanel.render('reply-frame');
            comments.render();
            comments.load();
        }
    };
    
}();

Ext.onReady(Ext.events.show.init, Ext.events.show);
