/**
  * Ext.ux.ImageSelectDialog PlugIn
  * by MelonCocoo
  * 
  */

// 
Ext.namespace('Ext.ux');

Ext.ux.ImageBrowser = Ext.extend(Ext.DataView, {
    // cache data by image name for easy lookup
    lookup: {},
    data: null,
    callback: null,
    
    setIndicator: function(enabled) {
        if (Ext.getCmp('img-browser-view')) {
            if (!enabled)
                Ext.getCmp('img-browser-view').getTopToolbar().items.map.indicator.disable();
            else
                Ext.getCmp('img-browser-view').getTopToolbar().items.map.indicator.enable();
        }
    },
    
    constructor: function(config) {
        this.callback = config.callBack;
        
        // format loaded image data
        var formatData = function(data) {
            data.label = (data.name.length > 15) ? data.name.substr(0, 12) + '...' : data.name;
            data.title = "Name: " + data.name +
                "<br>Dimensions: " + data.width + " x " + data.height +
                "<br>Size: " + ((data.size < 1024) ? data.size + " bytes" : (Math.round(((data.size * 10) / 1024)) / 10) + " KB");
            if (data.width > data.height) {
                if (data.width < 80) {
                    data.thumbwidth = data.width;
                    data.thumbheight = data.height;
                } else {
                    data.thumbwidth = 80;
                    data.thumbheight = 80 / data.width * data.height;
                }
            } else {
                if (data.height < 80) {
                    data.thumbwidth = data.width;
                    data.thumbheight = data.height;
                } else {
                    data.thumbwidth = 80 / data.height * data.width;
                    data.thumbheight = 80;
                }
            }
            data.thumbleft = (Math.round((80 - data.thumbwidth) / 2)) + "px";
            data.thumbtop = (Math.round((80 - data.thumbheight) / 2)) + "px";
            data.thumbwidth = Math.round(data.thumbwidth) + "px";
            data.thumbheight = Math.round(data.thumbheight) + "px";
            this.lookup[data.name] = data;
            return data;
        };
  
        var store = new Ext.data.JsonStore({
            url: config.imageList,
            root: 'images',
            fields: [
                'name',
                {name: 'width', type: 'float'},
                {name: 'height', type: 'float'},
                {name: 'size', type: 'float'},
                'url'
            ]/*,
            listeners: {
                'beforeload' : function() { this.setIndicator(false); },
                'load' : function() { this.setIndicator(true); },
                'loadexception' : function() { this.setIndicator(true); }
            }*/
        });
        store.load();
        
        // create template for image thumbnails
	    var tpl = new Ext.XTemplate(
		    '<tpl for=".">',
			    '<div class="thumb-wrap" id="{name}">',
				    '<div class="thumb"><img src="{url}" ext:qtip="{title}" style="top:{thumbtop}; left:{thumbleft}; width:{thumbwidth}; height:{thumbheight};"></div>',
				    '<span>{label}</span>',
		      '</div>',
		    '</tpl>'
	    );
	    tpl.compile();

        var cfg = {
            store: store,
            tpl: tpl,
            autoHeight:true,
            multiSelect:true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText: 'No images to display',
            prepareData: formatData.createDelegate(this),
            listeners: {
                'selectionchange': {fn: this.selectionChanged, scope: this, buffer: 100 }
            }
        };
        
        Ext.ux.ImageBrowser.superclass.constructor.call(this, cfg);
    },
    
    selectionChanged: function() {
        var selNode = this.getSelectedNodes();
        if (selNode && selNode.length > 0 && this.callback) {
            selNode = selNode[0];
            data = this.lookup[selNode.id];
            this.callback(data);
        }
    }
});
