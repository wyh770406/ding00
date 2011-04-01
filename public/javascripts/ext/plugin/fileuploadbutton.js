/**
  * Ext.ux.ImageSelectDialog PlugIn
  * by MelonCocoo
  * 
  */

// 

Ext.ux.FileUploadButton = Ext.extend(Ext.Button, {
    // default button caption
    text: "Browse",
    
    // Overrides Ext.Button.OnRender
    onRender: function(ct, position) {
    
        // call Ext.Button.onRender
        Ext.ux.FileUploadButton.superclass.onRender.call(this, ct, position);
        
        // wrap button
        var btnCt = this.el.wrap({
              tag: "div",
              style: "position:absolute; right:0;"
        });
        
        //return;
        
        // calculate width of button (as IE reports this.el.getWidth incorrectly)
        var width = btnCt.child("td.x-btn-left").getWidth() +
            btnCt.child("button.x-btn-text").getWidth() +
            btnCt.child("td.x-btn-center").getPadding("lr") +
            btnCt.child("td.x-btn-right").getWidth();
            
        width = width > 0? width : 60;

        // wrap button container in a root container
        // this root container will also wrap the file upload container
        var rootCt = btnCt.wrap({
            tag: "div",
            style: "position:relative; height:21px; overflow:hidden; width:" +
                width + "px;"
        });

        // create the file upload container and put it in the root container.
        // this will appear in front of the button container but since it is
        // transparent the button will be seen through it
        this.fileCt = Ext.DomHelper.append(rootCt, {
            tag: "div",
            style: "position:absolute; opacity:0.0; -moz-opacity:0.0;" +
                " filter:alpha(opacity=0); right:0; height:21px;"
        }, true);
        
        // create the file upload object
        this.createFileUpload();
    },
    
    createFileUpload: function() {
        this.fileUpload = Ext.DomHelper.append(this.fileCt, {
            tag: "input",
            name: "image",
            type: "file",
            size: 1,
            style: "top:0; height:21px; font-size:14px; cursor:pointer;" +
                " -moz-user-focus:ignore; border:0px none transparent; overflow:hidden;"
        }, true);
        
        if (this.tooltip) {
            Ext.QuickTips.register({
                target: this.fileUpload,
                text: this.tooltip
            });
        }
        
        this.fileUpload.on("mouseover", function() {
            if (!this.disabled) {
                this.el.addClass("x-btn-over");
            }
        }, this);
        
        this.fileUpload.on("mouseout", function() {
            this.el.removeClass("x-btn-over");
        }, this);

        this.fileUpload.on("mousedown", this.onMouseDown, this);
        
        this.fileUpload.on("click", function(e) {
            e.stopPropagation();
        });
        
        this.fileUpload.on("change", function() {
            this.handler(this.fileUpload);
            this.fileUpload.remove();
            this.createFileUpload();
        }, this);
    }
});

Ext.reg('fileuploadbutton', Ext.ux.FileUploadButton);