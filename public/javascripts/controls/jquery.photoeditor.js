//////////////////////////////////////////////////////////////////////////
// 
// Created by meloncocoo At 2010.10
// email: nimda_wen@hotmail.com
//
//////////////////////////////////////////////////////////////////////////

;(function($){

// global $ method for ...
$.photoeditor = function(opts) { initialize(null, opts); }

// plugin version
$.photoeditor.version = 1.0;

//
$.photoeditor.initialized = false;

// default options
$.photoeditor.defaults = {
    image: '',
    framecss: {
        width: 266,
        height: 266,
        border_width: 2,
        border_color: '#888'
    },
    clip: {
        width: 120,
        height: 120
    },
    reinit: true
};
    
// plugin method
$.fn.photoeditor = function (opts) {
    return this.each(function () {
        initialize(this, opts);
    });
};

// private data and functions follow...

var table_z_index = 1000;
var image_z_index = table_z_index - 100;
var drage_z_index = table_z_index + 100;

var m_start_x = 0;
var m_start_y = 0;
var m_center_x = 0;
var m_center_y = 0;
var m_img_current_x = 0;
var m_img_current_y = 0;
var m_frame_w = 0;
var m_frame_h = 0;
var m_icon_w = 0;
var m_icon_h = 0;
var m_scale = 1;
var m_moving = false;

// initialize the plugin
function initialize(el, opts) {
    opts = $.extend({}, $.photoeditor.defaults, opts || {});
    
    if ($.photoeditor.initialized && !opts.reinit) return false;
    $el = $(el);
    
    var $frame = create_frame(opts.framecss);
    var $table = create_table(opts);
    var $image = create_image(opts.image);
    var $image_container = creat_img_container();
    var $dragframe = create_drag_frame(opts.framecss.width);
    
    var image = new Image();
    image.src = $image.attr('src');
    this.image = image;
    this.image_clip_w = 120;
    this.image_clip_h = 120;
    
    // add plugin elements to document
    $container = $('<div style="width: ' + ( opts.framecss.width + 4) + 'px; height: ' + (opts.framecss.height + 28) + 'px;">');
    //$el.append($frame.append($table));
    $el.append( $container );
    $container.append( $frame.append( $table ) );
    $table.after($image_container);
    $image.appendTo($image_container);
    $image_container.after($dragframe);
    
    // image information
    this.image_container = $image_container;
    
    // drag events
    $dragframe
    .bind('mousedown', function (event) {
        $(document).bind('mousemove', ondragmove);
        m_start_x = event.screenX;
        m_start_y = event.screenY;
        m_moving = true;
    })
    //.bind('mousemove', ondragmove)
    .bind('mouseup', function (event) {
        $(document).unbind('mousemove', ondragmove);
        m_moving = false;
        event.preventDefault
//        if (typeof document.selection != 'undefined') {
//            try { document.selection.empty(); } catch(e) { ; }
//        } else {window.getSelection().removeAllRanges();}
    });
    $(document).mouseup(function (event) {
        $(document).unbind('mousemove', onctrlmove); 
        m_moving = false;
        event.preventDefault();
//        if    (typeof document.selection != 'undefined') {
//        document.selection.empty();}
//        else
//            {window.getSelection().removeAllRanges();}
    });
    $table.mousemove(function (event) {
        event.preventDefault();
        if    (typeof document.selection != 'undefined') {
        document.selection.empty();}
        else
            {window.getSelection().removeAllRanges();}
    });
    
    // create controls box
    var $ctrl_box = create_ctrls_box();
    $frame.after($ctrl_box);
    
    // controls events
    this.btn_grip
    .bind('mousedown', function (event) {
        $(document).bind('mousemove', onctrlmove);
        this.start_x = event.screenX;
        this.btn_grip = $(this);
        this.ctrl_moving = true;
    })
    .bind('mousemove', onctrlmove)
    .bind('mouseup', function () {
        $(document).unbind('mousemove', onctrlmove);
        this.ctrl_moving = false;
    });
    
    // set image position
    $image.load(function () {
        reset();
    });

    // initialize finished
    $.photoeditor.initialized = true;
};

//
function reset() {
    var $image = this.image_container.find('img');
    var image = new Image();
    image.src = $image.attr('src');
    $image.width(image.width);
    $image.height(image.height);
    
    m_scale = 1;
    m_center_x = Math.round(image.width / 2);
    m_center_y = Math.round(image.height / 2);
    update_position();
    
    this.btn_grip.css({ 'left' : '50%' });
};

//
function onctrlmove(event) {
    if (!this.ctrl_moving) return false;
    var offsetx = event.screenX - this.start_x;
    var left = this.btn_grip.position().left + offsetx;
    var max_width = this.btn_grip.parent().width() - this.btn_grip.width();
    if (left < 5) left = 5; else if (left > max_width - 5) left = max_width - 5;
    this.btn_grip.css({ 'left' : left + 'px' });
    set_scale(left);
    this.start_x = event.screenX;
};

//
function set_scale(x) {
    var orignal_center_x = m_center_x / m_scale;
    var orignal_center_y = m_center_y / m_scale;
    
    m_scale = x / (this.btn_grip.parent().width() / 2);
    m_center_x = Math.round(orignal_center_y * m_scale);
    m_center_y = Math.round(orignal_center_x * m_scale);
    
    var $image = this.image_container.find('img');
    var orignal_w = $image.width();
    var orignal_h = $image.height();
    var width = Math.round(this.image.width * m_scale);
    $image.css({ 
        'width' : width + 'px',
        'height' : 'auto'
    });
    m_center_x = Math.round(orignal_center_x * m_scale);
    m_center_y = Math.round(orignal_center_y * m_scale);
    update_position();
};

//
function ondragmove(event) {
    if (!m_moving) return false;
    var offset_x = 0, offset_y = 0;
    
    offset_x = event.screenX - m_start_x;
    offset_y = event.screenY - m_start_y;
    m_start_x = event.screenX;
    m_start_y = event.screenY;
    m_center_x -= offset_x;
    m_center_y -= offset_y;
    update_position();
};

//
function update_position() {
    var x = Math.round(m_frame_w / 2 - m_center_x);
    var y = Math.round(m_frame_h / 2 - m_center_y);
    this.image_container.css( {'left' : x + 'px', 'top' : y + 'px'} );
    //$('#current_x').html(-Math.round(x - (m_frame_w - m_icon_w) / 2) + 'px');
    //$('#current_y').html(-Math.round(y - (m_frame_h - m_icon_h) / 2) + 'px');
};

// create a frame for editor
function create_frame(css) {
    var frame, $frame;
    frame = document.createElement('div');
    $frame = $(frame);
    m_frame_w = css.width;
    m_frame_h = css.height;
    $frame.css({
        'border' : css.border_width + 'px solid ' + css.border_color,
        'width' : m_frame_w + 'px',
        'height' : m_frame_h + 'px',
        'overflow' : 'hidden',
        'position' : 'relative'
    });
    return $frame;
};

// create a table as the editor frame
function create_table(opts) {
    var s, frame, $frame, width, height;
    var overlay_css = '';
    
    offset_w = Math.round(opts.framecss.width * 0.27);
    offset_h = Math.round(opts.framecss.height * 0.27);
    m_icon_w = m_frame_w - 2 * offset_w;
    m_icon_h = m_frame_h - 2 * offset_h;
    
    overlay_css = 'background-color: #ccc; opacity: 0.5; -moz-opacity: 0.5; filter: alpha(opacity=50);';
    preview_css = 'background-color: #ccc; opacity: 0.01; -moz-opacity: 0.01; filter: alpha(opacity=1);';
    
    frame = document.createElement('div');
    $frame = 
    s = '<table style="width: auto; position: relative; z-index: ' + table_z_index + '; cellpadding="0" cellspacing="0">' +
            '<tr><td colspan="3" style="height: ' + offset_h + 'px; ' + overlay_css + '"></td></tr>' +
            '<tr>' +
                '<td style="width: ' + offset_w + 'px; ' + overlay_css + '"></td>' +
                '<td style="text-align: left; border: 1px solid #fff; width: ' + m_icon_w + 'px; height: ' + m_icon_h + 'px; ' + preview_css + '"></td>' +
                '<td style="width: ' + offset_w + 'px; ' + overlay_css + '"></td>' +
            '</tr>' +
            '<tr>' +
                '<td colspan="3" style="height: ' + offset_h + 'px; ' + overlay_css + '"></td>' +
            '</tr>' +
         '</table>';
         
     return $(s);
} ;

// create image
function create_image(img_url) {
    var img, $img;
    img = document.createElement('img');
    $img = $(img);
    $img.attr('src', img_url);
    
    return $img;
};

// create image container
function creat_img_container(img_url) {
    var container, $container, img, $img;
    
    container = document.createElement('div');
    $container = $(container);
    $container.css({
        'top' : '0px', 'left' : '0px',
        'position' : 'absolute',
        'z-index' : image_z_index
    });
    
    return $container;
};

// create the over frame for dragging
function create_drag_frame(width) {
    var frame, $frame;
    
    frame = document.createElement('div');
    $frame = $(frame);
    $frame.css({
        'width' : width + 'px', 'height' : '100%',
        'position' : 'absolute',
        'z-index' : drage_z_index,
        'cursor' : 'pointer',
        'left' : 0 + 'px', 'top' : 0 + 'px'
    });
    
    return $frame;
};

// create control box
function create_ctrls_box() {
    var box, $box, s;
    
    box = document.createElement('div');
    $box = $(box);
    $box.css( {'margin' : '5px' } );

    s = '<table border="0" cellspacing="0" cellpadding="0" width="100%">' +
	        '<tr>' +
		        '<td><img src="/images/register/reduce_15x14.png" /></td>' +
		        '<td style="text-align: left; background: url(\'/images/register/slider_241x6.png\') center center no-repeat; position: relative; width: 100%;"></td>' +
		        '<td><img src="/images/register/add_15x14.png" /></td>' +
	        '</tr>' +
        '</table>';
    $box.append($(s));
    
    var ctrl = document.createElement('img');
    ctrl.src = '/images/register/blue_11x15.png';
    $(ctrl).css({
       'position' : 'relative',
       'top' : 0, 'left' : '50%'
    });
    
    this.btn_grip = /*$('<div>').append*/($(ctrl));
    this.track_bar = $box.find('td:eq(1)').append($(ctrl));
    
    return $box;   
};

// 
function make_params(custom) {
    var fixed_data = {
        'x' : Math.round(m_center_x - m_icon_w / 2),
        'y' : Math.round(m_center_y - m_icon_h / 2),
        'scale' : m_scale,
        'w' : m_icon_w,
        'h' : m_icon_h,
        'src' : this.image.src
    };
    return $.extend(fixed_data, custom);
};

$.fn.extend({
    cancel : function () {
        if (!$.photoeditor.initialized) return false;
        reset();
    },
    send : function(url ,type, custom, onSuccess) {
         var response = "";
         $.ajax({
             url : url,
             type: type,
             data: (make_params(custom)),
             success:function(r){ 
                //setData('imageResult',r);
                if(onSuccess !== undefined && onSuccess != null)
                    onSuccess(r);
             }
         });
     }  
});
    
} )(jQuery);