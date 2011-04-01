// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
function load_friends_list(id, update) {
    
    $.ajax({
        type:'post', 
        url:'/users/load_friends_list/' + id,
        success:function (r) {
            $update = $('#' + update);
            $update.html(r);
        },
        error:function (r) {
            //alert('error: ' + r.responseText);
        }
    });
}

function load_attention_list(id, update) {
    
    $.ajax({
        type:'post', 
        url:'/users/load_attention_list/' + id,
        success:function (r) {
            $update = $('#' + update);
            $update.html(r);
        },
        error:function (r) {
            //alert('error: ' + r.responseText);
        }
    });
}

/*
 * global show tip setting
 */
g_block_callback = function() {};
function get_block_options(opts) {
    return $.extend({
        css: {
	        padding:	0,
	        margin:		0,
	        width:		'422px',
	        top:		'20%',
	        left:		'35%',
	        textAlign:	'center',
	        color:		'#000',
	        border:		'none',
	        backgroundColor:'#fff',
	        cursor:		'wait'
        }
        ,overlayCSS: { backgroundColor: '#ececec' }
        ,message: $('#tip_box')
        ,timeout : 3000
        ,onUnblock : g_block_callback
    }, opts);
};
    
function show_tip_box(request, onclose) {
    g_block_callback = onclose;
    opts = get_block_options( { onUnblock : g_block_callback } );
    $('#tip_box').html( request.responseText );
    $.blockUI( opts );
}

//
// update the part by template page
//
function UpdatePartial(url, update, params, onSuccess) {
    $.ajax( {
        url : url,
        type : 'get',
        data: params,
        success: function(r) { 
            $('#' + update).html(r);
            if (onSuccess !== undefined && onSuccess != null)
                onSuccess(r);
        }
    } );
}

//
//    load javascript file dynamically
//
function LoadJS(jsUrl, fCallBack)
{
    var _script = document.createElement('script');
    
    _script.setAttribute('type', 'text/javascript');
    _script.setAttribute('charset', 'gb2312');
    _script.setAttribute('src', jsUrl);
    document.getElementsByTagName('head')[0].appendChild(_script);
    
    if(typeof fCallBack != "undefined")
    {
        if ($.browser.msie)
        {
            _script.onreadystatechange = function()
            {
                if (this.readyState=='loaded' || this.readyState=='complete')
                    {fCallBack();}
            };
        }
        else if ($.browser.mozilla)
        {
            _script.onload = function(){fCallBack();};
        }
        else if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
        {
            _script.onload = function(){fCallBack();};
        }
        else
        {
            fCallBack();
        }
    }
}

/*
 * non-update load page
 */
var request_page = function(opts) {
    var i = document.createElement( 'iframe' );
    var load_callback = function() {
        i.removeNode( true );
        if (opts.onloaded) opts.onloaded();
    };
    
    try {
        i.setAttribute( "style", "display: none; position: absolute; z-index: 1;" );
        document.body.appendChild( i );
        
        if (opts.onbefore) opts.onbefore();
        
        if (opts.url) {
            var url = opts.url;
            //if (opts.update) url += "?dd&&update=" + opts.update;
            i.setAttribute( "src", url );
        } else {
            i.setAttribute( "src", "javascript:''" );
        }
            
        i.attachEvent( "onload", load_callback );
    } catch(e) {}
    return false;
};

/*
 * non-update load page
 * el: a A source 
 * opts: 
 *      target:
 *      method:
 */
var submit_data = function(el, opts) {
    var f = document.createElement( 'form' );
    var i = document.getElementsByName( opts.target );
    var bRemoveiFrame = false;
    
    try {
        if (i == null || i == undefined) { 
            i = document.createElement( 'iframe' ); 
            i.setAttribute( 'name', opts.target );
            i.setAttribute( 'style', 'display: none; position: absolute; z-index: 1;' );
            document.body.appendChild( i );
            bRemoveiFrame = true;
        }

        f.style.display = 'none';
        el.parentNode.appendChild(f);
        f.action = el.getAttribute( 'href' );
        f.target = opts.target;
        f.method = 'POST';
        
        if (opts.method && opts.method != 'POST') {
            var m = document.createElement( 'input' ); m.setAttribute( 'type', 'hidden' );
            m.setAttribute( 'name', '_method' ); m.setAttribute( 'value', opts.method ); f.appendChild( m );
        }

        var s = document.createElement('input'); s.setAttribute('type', 'hidden');
        s.setAttribute('name', 'authenticity_token'); s.setAttribute('value', authenticity_token); f.appendChild( s );
        
        f.submit();
    } catch(e) { /*alert(e);*/ }
    finally {
        if (bRemoveiFrame) i.removeNode(true);
        f.removeNode(true);
    }
    return false;
};

function create_confirm_frame(el, opts) {
    try {
        var c = document.createElement('div'); 
        c.setAttribute('class', opts.classname);
        el.parentNode.appendChild(c); 
        el.parentNode.style.position = 'relative'; 
        c.style.position = 'absolute';
        
        var p = document.createElement('p');
        c.appendChild(p);
        p.innerHTML = opts.content;
        
        var ok_span = document.createElement('span');
        var cl_span = document.createElement('span');
        
        ok_span.style.display = 'inline';
        c.appendChild(ok_span);
        cl_span.style.display = 'inline';
        c.appendChild(cl_span);
        
        var ok = document.createElement('a');
        ok.setAttribute('class', 'ctrl-button ctrl-ok-64x23');
        ok.innerHTML = '确定';
        ok_span.appendChild(ok);
        
        var cl = document.createElement('a');
        cl.setAttribute('class', 'ctrl-button ctrl-cancel-64x23');
        cl.innerHTML = '取消';
        cl_span.appendChild(cl);
        
        cl.onclick = function() { c.removeNode(true); };
        ok.setAttribute('href', el.href);
        if (opts.target) ok.onclick = function() { submit_data(this, opts); c.removeNode(true); return false; };
        
        c.onmousedown = function(e) { e.cancelBubble = true; }
        document.onmousedown = function(e) { c.removeNode(true); document.onmousedown = null; };
    } catch(e) {
        c.removeNode(true);
        document.onmousedown = null;
    }
    finally {}
    return false;
};

function update_notifications(){
    if (!Ext.get('user_tip_box'))
        return false;
        
    Ext.Ajax.request({
        url: '/images/notifications.txt',
        success: function(response){
            var tips = Ext.util.JSON.decode(response.responseText);
            alert(tips.notifications.length);
        },
        failure: function(response){alert(response.responseText);}
    });
}

Ext.BLANK_IMAGE_URL = '/images/bg.png';
Ext.namespace('Ext.Ding00');

Ext.Ding00.Notifications = function(config){
    config = config || {};
    Ext.apply(this, config);
    this.el = Ext.get(this.renderTo);
    (!this.el || this.el == undefined)? this.el = null : this.el.update('');
    this.createContainer();
    this.hide();
};

Ext.extend(Ext.Ding00.Notifications, Ext.util.Observable, {
    tpl: '<li>' + 
            '<div class="item icon"><img src="/images/bg.png" class="ctrl-icon ctrl-icon-invitation-35x35" /></div>' + 
            '<div class="item content">您有(<span class="highlight">{count}</span>)个{type}</div>' + 
            '<div class="item ctrls">' + 
                '<span><a href="{action}" class="ctrl-button ctrl-ok-42x16">查看</a></span>' + 
                '<span><a href="javascript:void(0)" ignore="{ignore}" class="ctrl-button ctrl-cancel-42x16">忽略</a></span>' + 
            '</div>' + 
        '</li>',
    
    load: function(options){
        var object = this;
        Ext.Ajax.request({
            url: this.url,
            success: function(response){
                var data = Ext.util.JSON.decode(response.responseText);
                object.update(data.notifications);
            },
            failure: function(response){alert(response.responseText);}
        });
    },
    
    createContainer: function(){
        if (!this.el) return false;
        this.el.update('');
        this.div = this.el.createChild({
            tag: 'div',
            cls: this.cls,
            style: 'visibility: false;'
        });
        this.body = this.div.createChild({
            tag: 'ul'
        });
    },
    
    hide: function(){
        if (this.div) this.div.hide();
    },
    
    show: function(){
        if (this.div && !this.div.isVisible()) this.div.fadeIn();
    },
    
    update: function(data){
        var me = this;
        var html = '';
        var tpl = this.tpl;
        if (!me.body) return false;
        me.body.update('');
        me.hide();
        Ext.each(data, function(item){
            if (item.count > 0) {
                var itemhtml = tpl;
                for(var attr in item){
                    itemhtml = itemhtml.replace('{'+attr+'}', item[attr]);
                }
                html += itemhtml;
            }
        });
        
        if (html.length > 0){
            me.body.update(html);
            me.body.select('.ctrl-cancel-42x16').on('click', function(){
                Ext.Ajax.request({
                    url: this.ignore
                });
                Ext.get(this).parent('li').remove();
                me.updateItem();
            });
        }
        me.updateItem();
    },
    
    updateItem: function(){
        if (this.body.select('li').elements.length > 0)
            this.show();
        else
            this.hide();
    }
});

Ext.Ding00.app = function(){
    var tips;
    
    return {
        init: function(){
        
            if (Ext.get('user_tip_box')){
                tips = new Ext.Ding00.Notifications({
                    //url: '/images/notifications.txt',
                    url: '/notifications/getall',
                    renderTo: 'user_tip_box',
                    cls: 'user-tip-box'
                });
                tips.load();
            }
        }
    }
}();

Ext.onReady(Ext.Ding00.app.init, Ext.Ding00.app);