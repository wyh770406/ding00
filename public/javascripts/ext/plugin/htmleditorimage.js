/**
  * Ext.ux.HtmlEditorImage PlugIn
  * by MelonCocoo
  * 
  */

// 
Ext.namespace('Ext.ux');

Ext.ux.HtmlEditorImage = Ext.extend(Ext.form.HtmlEditor, {
    dialog : null,
    tabs : null,
    
    enableImage : true,
    
    // constructor
    constructor : function(config){
        Ext.ux.HtmlEditorImage.superclass.constructor.call(this, config);
        this.uploadURL = config.uploadURL;
        this.imageList = config.imageList;
        this.deleteURL = config.deleteURL;
    },
    
    // private
    createToolbar : function(editor){
        Ext.ux.HtmlEditorImage.superclass.createToolbar.call(this, editor);
        
        var tipsEnabled = Ext.QuickTips && Ext.QuickTips.isEnabled();
     
        this.buttonTips.insertimage = {
            title: 'Image',
            text: 'Insert image to document.',
            cls: 'x-html-editor-tip'
        };

       function btn(id, toggle, handler){
            return {
                itemId : id,
                cls : 'x-btn-icon x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor,
                handler:handler||editor.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: tipsEnabled ? editor.buttonTips[id] || undefined : undefined,
                tabIndex:-1
            };
        }
        
        if (this.enableImage){
            this.getToolbar().addButton(btn('insertimage', false, editor.openImageWindow));
        }
    },
    
    // private
    cancelHandler: function() {
        if (this.dialog){
            this.dialog.close();
            this.dialog = null;
        }
    },
    
    // private
    selectHandler: function(url) {
        if (this.dialog){
            this.insertImage(this.dialog.url);
            this.dialog.close();
            this.dialog = null;
        }
    },
    
    // private
    openImageWindow : function(){
        //if (!this.dialog){
            this.dialog = new Ext.ux.ImageSelectDialog({
                selecttext: '插入',
                cancelCallback: this.cancelHandler.createDelegate(this),
                selectCallback: this.selectHandler.createDelegate(this),
                uploadURL: this.uploadURL,
                imageList: this.imageList,
                deleteURL: this.deleteURL
            });
        //}
        
        this.dialog.show(this);
    },
    
    // private
    insertImage : function(url){
        this.relayCmd('insertimage', url);
    },
    
    // private
    onRender : function(ct, position){
        Ext.ux.HtmlEditorImage.superclass.onRender.call(this, ct, position);
    },
//    
//    // 
//    urlChanged : function(){
//        var disabled = (this.tabs.form.findField('url').getValue() == "");
//        Ext.getCmp('insert-btn').setDisabled(disabled);
//    },
//    
    // insert the image into the editor (browser-specific)
    insertImageByBrowser : function() {
        if (Ext.isIE) {
            // ie-specific code
            return function() {

                // get selected text/range
                var selection = this.doc.selection;
                var range = selection.createRange();

                // insert the image over the selected text/range
                range.pasteHTML(createImage().outerHTML);
            };

        } else {

            // firefox-specific code
            return function() {

                // get selected text/range
                var selection = this.win.getSelection();

                // delete selected text/range
                if (!selection.isCollapsed) {
                    selection.deleteFromDocument();
                }

                // insert the image
                selection.getRangeAt(0).insertNode(createImage());
            };
        }
    }
});


