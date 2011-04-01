/**
  * Ext.ux.ImageSelectDialog PlugIn
  * by MelonCocoo
  * 
  */

// 

Ext.ux.ImageSelectDialog = Ext.extend(Ext.Window, {

    constructor: function(cfg){
        var dialog = this;
        var text = cfg.selecttext;
        this.selectCallback = cfg.selectCallback,
        this.cancelCallback = cfg.cancelCallback,
        this.uploadURL = cfg.uploadURL;
        this.imageList = cfg.imageList;
        this.deleteURL = cfg.deleteURL;
        this.tabs = this.createTabs();
        
        var config = {
            title: '添加/编辑图片',
            closable: true,
            modal: true,
            closeAction : 'close',
            plain: true,
            layout: 'fit',
            minWidth: 504,
            minHeight: 321,
            width: 504,
            height: 321,
            items: this.tabs,
            buttons: [{
                text: text,
                disabled: true,
                id: 'insert-btn',
                handler: this.selectCallback
            },{
                text: '取消',
                handler: this.cancelCallback
            }]
        };
        
        Ext.ux.ImageSelectDialog.superclass.constructor.call(this, config);
    },
    
    filterView: function() {
        var filter = Ext.getCmp('filter');
        this.browser.store.filter('name', filter.getValue());
    },
    
    // private
    createTabs: function(parent) {
        this.browser = this.createBrowser();
        
        var config = {
            labelWidth: 70,
            autoWidth: true,
            border: false,
            items: {
                xtype: 'tabpanel',
                border: false,
                activeTab: 0,
                deferredRender: false,
                defaults: { autoHeight: true },
                items: [{
                    xtype: 'fieldset',
                    border: true,
                    title: '从网上地址添加',
                    autoHeight: true,
                    bodyStyle: 'padding: 5px',
                    defaults: { width: '95%' },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '地址',
                        name: 'url',
                        listeners: {
                            'change': { fn: this.urlChange, scope: this }
                        }
                    }]
                },{
                    xtype: 'panel',
                    border: false,
                    title: '从您的电脑上传',
                    layout: 'fit',
                    items: [{
                        id: 'img-browser-view',
                        border: false,
                        items: this.browser,
                        autoHeight:true,
                        tbar: ['过滤:', ' ', {
                            xtype: 'textfield',
                            id: 'filter',
                            selectOnFocus: true,
                            width: 100,
                            listeners: {
                                'render': { fn: function() {
                                        Ext.getCmp('filter').getEl().on('keyup', function() {
                                            this.filterView();
                                        }, this, { buffer: 500 });
                                    }, scope: this
                                }
                            }
                        }, ' ', '-', {
                            xtype: 'fileuploadbutton',
                            id: 'add',
                            iconCls: 'add-image',
                            text: '上传',
                            handler: this.uploadFile.createDelegate(this),
                            scope: this
                        },{
                            id: 'delete-btn',
                            iconCls: 'delete-image',
                            text: '删除',
                            handler: this.confirmDelete,
                            scope: this
                        }, '->', {
                            xtype: 'tbindicator',
                            id: 'indicator'
                        }, ' ']
                    }]
                }]                    
            }
        };
        
        return new Ext.FormPanel(config);
    },
    
    createBrowser : function() {
        return new Ext.ux.ImageBrowser({
            callBack: this.selectedImage.createDelegate(this),
            imageList: this.imageList
        });
    },
    
    selectedImage : function(data) {
        if (data) {
            Ext.getCmp('insert-btn').setDisabled(false);
            this.data = data;
            this.url = data.url;
        } else {
            Ext.getCmp('insert-btn').setDisabled(true);
        }
    },
    
    urlChange : function() {
        this.url = '';
        this.url = this.tabs.form.findField('url').getValue();
        var disabled = (this.url == "");
        Ext.getCmp('insert-btn').setDisabled(disabled);
    },
    
    createForm : function() {
        return Ext.getBody().createChild({
            tag: 'form',
            cls: 'x-hidden'
        });
    },
    
    // refresh the image list
	reset : function() {
		this.browser.getEl().dom.parentNode.scrollTop = 0;
		this.browser.store.reload();
		Ext.getCmp('filter').reset();
	},
	
    // confirm if ok to delete image
    confirmDelete : function() {
        if (this.data)
            Ext.MessageBox.confirm("删除图片",
                "确定要删除图片[" + data.name + "]吗?", this.deleteImage, this);
        else
            Ext.MessageBox.alert("提示", "没有选中图片");
    },
    
    deleteImage : function(doDelete) {
        this.browser.setIndicator(false);
        if (doDelete == 'yes') {
            Ext.Ajax.request({
                method: 'post',
                url: this.deleteURL,
                params: 'image=' + this.url,
                success: function(response) {
                    this.browser.setIndicator(true);
                    this.reset();
                    this.data = null;
                },
                failure: function(response) {
                    this.browser.setIndicator(true);
                    Ext.MessageBox.alert("删除失败", response.responseText);
                },
                scope: this
            });
        }
    },
    
    uploadSuccess : function(response) {
        this.browser.setIndicator(true);
        response = Ext.util.JSON.decode(response.responseText);
        if (response.success == 'true')
            this.reset();
        else
            Ext.MessageBox.alert("上传失败", response.text);
    },
    
    uploadFailure : function(response) {
        this.browser.setIndicator(true);
        Ext.MessageBox.alert("上传失败", response.responseText);
    },
    
    uploadFile : function(record) {
        this.browser.setIndicator(false);
        
        if (!this.form) {
            this.form = this.createForm();
            if (authenticity_token && authenticity_token != 'undefined' ) {
                this.form.createChild({
                    tag: 'input',
                    type: 'hidden',
                    name: 'authenticity_token',
                    value: authenticity_token
                });
            }
        }
            
        record.appendTo(this.form);
        Ext.Ajax.request({
            method: 'post',
            url: this.uploadURL,
            isUpload: true,
            form: this.form,
            success: this.uploadSuccess,
            failure: this.uploadFailure,
            scope: this
        });
    }
      
});
