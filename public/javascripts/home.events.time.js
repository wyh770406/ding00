
//全局变量

var gMonths = new Array(
{ "cn": "1月", "en": "Jan" },
{ "cn": "2月", "en": "Feb" },
{ "cn": "3月", "en": "Mar" },
{ "cn": "4月", "en": "Apr" },
{ "cn": "5月", "en": "May" },
{ "cn": "6月", "en": "Jun" },
{ "cn": "7月", "en": "Jul" },
{ "cn": "8月", "en": "Aug" },
{ "cn": "9月", "en": "Sep" },
{ "cn": "10月", "en": "Oct" },
{ "cn": "11月", "en": "Nov" },
{ "cn": "12月", "en": "Dec" });

var gDays = new Array("一", "二", "三", "四", "五", "六", "日");

var gDaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

var gToday;
var gNowYear;
var gNowMonth;
var gNowDate;
var gNowDay;
var gFirstDate;
var gWeekDateArray = new Array(7);


var gCurYear;
var gCurMonth;
var gCurDate;
var gCurDay;

var gOwnerId;
var gUserId;


//开始与结束的时间距离
var gTimeDis;
var gMSoyDis;


var $meo
var $deo;
var $teo;


//今天的x
var gTodayX;

var ox, oy;
var sox, eox;
var cox, coy;


//所有事件数据
var gEventArray = [];

//24小时内的事件Div
var gEventDivArray = [];

//超过24小时外的事件Div
var gDayDivArray = [];

//偏移量

//标题行的高度
var gTopOffset = 72;
//跨天行的高度
var gTopDayOffset = 48;

var gTableTopOffset = 407; //$(o + " #mcl table").offset().top

var gCellArray = new Array(7);
var gDayCellArray = new Array(7);


//时间盒的宽度
var gEventBoxWidth = 106;

var o;

var bMove = false;

var gCurId;

var tempArray = [
    { "id": "e12", "title": "买保时捷", "sDate": "Nov 30,2010 9:30:00", "eDate": "Dec 2,2010 10:30:00", "color": "#4d6000", "owner_id": "1", "user_id": "2" }
];


//=======================================================================================================================
//从服务器上获取今天的日期

function getToday(nd, cd) {

    gToday = new Date(nd);
    gNowYear = gToday.getFullYear();
    gNowMonth = gToday.getMonth();
    gNowDate = gToday.getDate();
    gNowDay = gToday.getDay();

    var _td = new Date(cd);
    gCurYear = _td.getFullYear();
    gCurMonth = _td.getMonth();
    gCurDate = _td.getDate();
    gCurDay = _td.getDay();

}

//=======================================================================================================================
//计算日历第一行的日期

function updateCalenderThead(_year, _month, _date, _day) {

    gTodayX = -1;

    $(o + " #mcl table tbody  td").css({ "background-color": "#ffffff", "width": gEventBoxWidth + 'px' });

    //星期日是最后一天还是第一天只要在这里调整
    if (_day >= 1) {
        gFirstDate = new Date(_year, _month, _date - (_day - 1));
    }
    else {
        gFirstDate = new Date(_year, _month, _date - 6);
    }

    //这里要加一天～！为了跨天。
    for (var i = 0; i < 8; i++) {
        var _td = new Date(gFirstDate.getFullYear(), gFirstDate.getMonth(), gFirstDate.getDate() + i);

        if (i < 7) {
            if (_td.getFullYear() == gToday.getFullYear() && _td.getMonth() == gToday.getMonth() && _td.getDate() == gToday.getDate()) {
                gTodayX = i;
                $(o + " #mcl table thead tr:eq(1) td:eq(" + i + ")").css({ "background-color": "#FF6600" });
                $(o + " #mcl table thead tr:eq(1) td:eq(" + i + ") span").html("星期" + gDays[i] + "(今天)");
                $(o + " #mcl table tbody  tr td:nth-child(" + (i + 1) + ")").css({ "background-color": "#FF9966" });
                //全天红起
                $(o + " #mcl table thead  tr:eq(2) td:eq(" + i + ")").css({ "background-color": "#FF9966" });
            }
            else {
                $(o + " #mcl table thead tr:eq(1) td:eq(" + i + ") span").html("星期" + gDays[i]);
                // $(o + " #mcl table thead tr:eq(1) td:eq(" + i + ")").css({ "background-image": "url('./images/leftLine.png')" });
                $(o + " #mcl table thead  tr:eq(2) td:eq(" + i + ")").css({ "background-color": "#ffffff" });
            }
            //日历头部的日期
            $(o + " #mcl table thead tr:eq(0) td:eq(" + i + ")").html(parseInt(_td.getMonth() + 1) + "/" + _td.getDate()); //_td.getFullYear() + "/" +
        }

        gWeekDateArray[i] = gMonths[_td.getMonth()].en + " " + _td.getDate() + "," + _td.getFullYear();
    }
}

//=======================================================================================================================
//下一星期
function nextWeek() {
    clearAllEventDivFromTable();
    gFirstDate = new Date(gFirstDate.getFullYear(), gFirstDate.getMonth(), gFirstDate.getDate() + 7);
    updateCalenderThead(gFirstDate.getFullYear(), gFirstDate.getMonth(), gFirstDate.getDate(), gFirstDate.getDay());
}

//=======================================================================================================================
//上一星期
function prevWeek() {
    clearAllEventDivFromTable();
    gFirstDate = new Date(gFirstDate.getFullYear(), gFirstDate.getMonth(), gFirstDate.getDate() - 7);
    updateCalenderThead(gFirstDate.getFullYear(), gFirstDate.getMonth(), gFirstDate.getDate(), gFirstDate.getDay());
}

//=======================================================================================================================
//今天
function showToday() {
    clearAllEventDivFromTable();
    updateCalenderThead(gNowYear, gNowMonth, gNowDate, gNowDay);
}

//=======================================================================================================================
//获取一周的事件
function getEvents(ea) {
    gEventArray = ea;
    reBuildAllEvents();
}

//=======================================================================================================================
//创建新事件
function addEvent(eo) {
    gEventArray.push(eo);
    reBuildAllEvents();
}

//=======================================================================================================================
//删除事件
function delEvent(id) {
    for (var i = 0; i < gEventArray.length; i++) {
        if (gEventArray[i].id == id) {
            var ox = gEventArray[i].ox;
            //删除div
            $("#" + gEventArray[i].id).remove();
            //删除数组元素
            gEventArray.del(i);
            reBuildAllEvents();
            break;
        }
    }
}

Array.prototype.del = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}

//=======================================================================================================================
//更新事件 临时用的
function updateEvent(eo) {

    for (var i = 0; i < gEventArray.length; i++) {
        if (gEventArray[i].id == eo.id) {

            if (eo.sDate != "-") {
                gEventArray[i].sDate = eo.sDate;
            }

            gEventArray[i].eDate = eo.eDate;
            gEventArray[i].title = eo.title;
            reBuildAllEvents();
            break;
        }
    }

}

//=======================================================================================================================
//排序
function SortData(datas, field, type) {
    SortFun.field = field;
    datas.sort(SortFun);
    if (type == "down") {
        datas.reverse();
    }
}

function SortFun(data1, data2) {
    if (data1[SortFun.field] > data2[SortFun.field]) {
        return 1;
    }
    else if (data1[SortFun.field] < data2[SortFun.field]) {
        return -1;
    }
    return 0;
}

//=======================================================================================================================
//清空表格上的所有事件
function clearAllEventDivFromTable() {
    for (var i = 0; i < gEventDivArray.length; i++) {
        $("#" + gEventDivArray[i].id).remove();
    }

    for (var i = 0; i < gDayDivArray.length; i++) {
        $("#" + gDayDivArray[i].id).remove();
    }

    gEventDivArray = [];
    gDayDivArray = [];
}

//=======================================================================================================================
//清除所有事件窗口

function clearAllEventWnd() {
    resetCell();
    $("#newEventWnd").hide();
    $("#eventWnd").hide();
}


//=======================================================================================================================
//重新建立所有事件
function reBuildAllEvents() {

    clearAllEventDivFromTable();

    //添加 html 代码

    for (var i = 0; i < gEventArray.length; i++) {
        addEventToCell(i);
    }

    //**************
    SortData(gDayDivArray, "sox");
    renderDay();


    //**************
    //排序
    SortData(gEventDivArray, "soy");
    for (var d = 0; d < 7; d++) {
        renderEvent(d);
    }

}

//=======================================================================================================================
//添加 event div 到 html 中

function addEventToCell(i) {

    var _sdate = new Date(gEventArray[i].sDate);
    var _edate = new Date(gEventArray[i].eDate);

    if ((_edate - _sdate) / (60 * 60 * 1000) > 24) {

        //****************
        //超过24小时的跨天*
        //****************

        dayToDiv(gEventArray[i].id, _sdate, _edate, gEventArray[i].title, gEventArray[i].color, gEventArray[i].owner_id, gEventArray[i].user_id);
    }
    else if (_edate.getDate() > _sdate.getDate() && _edate.getHours() + _edate.getMinutes() > 0) {

        //****************
        //小于24小时的跨天*
        //****************

        var _ed = gMonths[_edate.getMonth()].en + " " + _edate.getDate() + "," + _edate.getFullYear() + " 00:00:00";
        var _eid = gEventArray[i].id + "_sub";

        eventToDiv(gEventArray[i].id, _sdate, _ed, gEventArray[i].title, "-", _eid, gEventArray[i].color, gEventArray[i].owner_id, gEventArray[i].user_id);
        eventToDiv(gEventArray[i].id + "_sub", _ed, _edate, gEventArray[i].title, gEventArray[i].id, "-", gEventArray[i].color, gEventArray[i].owner_id, gEventArray[i].user_id);
    }
    else {

        //***********
        //当天的事件 *
        //***********

        eventToDiv(gEventArray[i].id, _sdate, _edate, gEventArray[i].title, "-", "-", gEventArray[i].color, gEventArray[i].owner_id, gEventArray[i].user_id);
    }
}


//=======================================================================================================================
//超过24H事件

function dayToDiv(id, sd, ed, title, color, oid, uid) {

    gOwnerId = oid;
    gUserId = uid;

    var _sdate = new Date(sd);
    var _edate = new Date(ed);

    var _title = title;
    var _id = id;
    var _color = color;


    var _st = _sdate.getHours() + ":" + (_sdate.getMinutes() / 30 == 1 ? "30" : "00");
    var _et = _edate.getHours() + ":" + (_edate.getMinutes() / 30 == 1 ? "30" : "00");

    _sdate.setHours(0, 0, 0, 0);
    _edate.setHours(0, 0, 0, 0);


    //开始日期可能会很早很早...根据第一天计算出来
    var _sox = parseInt((_sdate - gFirstDate) / (24 * 60 * 60 * 1000));
    var _eox = parseInt((_edate - gFirstDate) / (24 * 60 * 60 * 1000));

    //--------------------
    _title = "<span>" + _title + "</span> ( " + _st + "～" + _et + " )";
    //--------------------

    var _html;
    // than 24h Event Div
    $(o + " #mcl").append("<div id=" + _id +
                         " curx=0 ury=0" +
                         " sox=" + _sox + " eox=" + _eox +
                         " curx=0 cury=0" +
                         " color=" + _color +
                         " st='" + _st + "'" +
                         " et='" + _et + "'" +
                         " class='day_box' unselectable='on' onselectstart='return false;'>" +
                         " <div class='bg'>" +
                         " <div class='larrow'><</div>" +
                         " <div class='title'>" + _title + "</div>" +
                         " <div class='rarrow'>></div>" +
                         " </div>" +
                         "</div>");

    var $e = $("#" + _id);

    var $la = $e.find(".larrow");
    var $ra = $e.find(".rarrow");

    $la.css({ "color": _color });
    $ra.css({ "color": _color });
    $e.find(".bg").css({ "background-color": _color });

    //************
    //添加点击事件*
    //************


    if (oid == uid) {
        $e.mousedown(function (e) {
            sox = ox;
            $teo = $(this);
            $teo.css({ "z-index": 999 });
            clearAllEventWnd();
            //还没有移动
            bMove = false;
            gCurId = _id;
            e.stopPropagation();
        });
    }

    //弹出详细框
    $("#" + _id + " .title").mouseup(function (e) {
        if (bMove == false) {
            clearAllEventWnd();
            e.stopPropagation();
            $teo = null;
            alert(gCurId);
        }
    });


    if (_sox < 0) {
        //   if (_sdate.getFullYear() != gFirstDate.getFullYear()) {
        //    _t = _t + _sdate.getFullYear() + "/";
        //    }
        //    _t = _t + (_sdate.getMonth() + 1 + "/" + _sdate.getDate() + " ");

        $la.css({ "color": "#ffffff" });
    }


    if (_eox > 6) {
        //   if (_edate.getFullYear() != gFirstDate.getFullYear()) {
        //    _t = _t + _edate.getFullYear() + "/";
        //    }
        //    _t = _t + (_edate.getMonth() + 1 + "/" + _edate.getDate() + " ");

        $ra.css({ "color": "#ffffff" });
    }

    //************************
    //添加到eventDivArray数组*
    //************************
    gDayDivArray.push({ "id": _id, "sox": _sox });

}


//=======================================================================================================================

function cellToTime(c) {
    var _h = parseInt(c / 2);
    //24要显示成00！
    return (_h >= 24 ? "00" : _h) + ":" + (c % 2 == 1 ? "30" : "00");
}


//=======================================================================================================================

function eventToDiv(id, sd, ed, title, sid, eid, color, oid, uid) {

    gOwnerId = oid;

    gUserId = uid;

    var _color = color;

    var _sdate = new Date(sd);

    var _edate = new Date(ed);

    var _title = title;

    var _eid = eid;

    var _sid = sid;

    var _id = id;

    //哪一天单元格号？
    var _ox = parseInt((_sdate - gFirstDate) / 1000 / 60 / 60 / 24);

    //开始日期单元格号
    var _soy = _sdate.getHours() * 2 + _sdate.getMinutes() / 30;

    //因为晚上0：00点问题，所以要减
    var _t = (_edate - _sdate) / (60 * 60 * 1000);

    //结束日期单元格号  !!!
    var _eoy = _soy + _t * 2;


    var _sdt = cellToTime(_soy);
    var _edt = cellToTime(_eoy);



    //************************
    //添加到eventDivArray数组*
    //************************
    gEventDivArray.push({ "id": _id, "soy": _soy });

    //添加小于24小时的事件
    $(o + " #mcl").append("<div id=" + _id +
                    " ox=" + _ox +
                    " soy=" + _soy +
                    " eoy=" + _eoy +
                    " eid=" + _eid +
                    " sid=" + _sid +
                    " color=" + _color +
                    " curx=0" +
                    " cury=0" +
                    " class='event_box' unselectable='on' onselectstart='return false;'>" +
                        "<div class='time'>" + (_sid == "-" ? _sdt : "") + "～" + (_eid == "-" ? _edt : "") + "</div>" +
                        "<div class='title'>" + _title + "</div>" +
                        "<div class='drag'>=</div>" +
                "</div>");

    var $o = $("#" + _id);

    var $time = $o.find(".time");
    var $title = $o.find(".title");
    var $drag = $o.find(".drag");


    $time.css({ "background-color": _color });
    $title.css({ "background-color": _color });
    $drag.css({ "background-color": _color });


    //超过这个星期与小于这个星期都要不显示
    if (_ox == 7 || _ox < 0) {
        $o.css({ "display": "none" });
    }


    //子事件不显示标题头
    if (_sid != "-") {
        $time.css({ "filter": "alpha(opacity=70)" });
    }



    //计算高度 +1
    $title.css({ "height": (_eoy - _soy) * 25 - 24 + 'px' });


    //************
    //添加点击事件*
    //************

    //子事件不能拖动或不是自己的事件
    if (_sid == "-" || oid != uid) {
        $o.mousedown(function (e) {
            sox = ox;
            $meo = $(this);
            clearAllEventWnd();
            //还没有移动
            bMove = false;

            //鼠标点击偏移量
            gMSoyDis = $meo.attr("soy") - oy;
            //当然事件id号
            gCurId = _id;

            //停止冒泡
            e.stopPropagation();
        });
    }

    //**********
    //弹出详细框*
    //**********
    $o.mouseup(function (e) {

        if (bMove == false) {
            clearAllEventWnd();

            var x = ox * gEventBoxWidth;
            var y = oy * 25;

            $("#eventWnd").css({ "top": e.pageY - 60 + "px",
                "left": e.pageX - $("#eventWnd").width() / 2 + "px",
                "display": "block"
            });

            $meo = null;
            $deo = null;
            e.stopPropagation();
        }

    });



    //上下拉动
    $drag.mousedown(function (e) {
        $deo = $(this).parent();
        clearAllEventWnd();
        e.stopPropagation();
    });

}

//=======================================================================================================================
//渲染超过24小时的事件

function renderDay() {

    var th = 0;

    //该星期所有单元格的eventNum清0
    for (var i = 0; i < 7; i++) {
        gDayCellArray[i].eventNum = 0;
    }


    //重新计算eventNum
    for (var ei = 0; ei < gDayDivArray.length; ei++) {
        var $eo = $("#" + gDayDivArray[ei].id);
        for (var k = 0; k < 7; k++) {
            if (k >= $eo.attr("sox") && k <= $eo.attr("eox")) {

                gDayCellArray[k].eventNum += 1;

                if (gDayCellArray[k].eventNum > th) {
                    th = gDayCellArray[k].eventNum;
                }
            }
        }
    }


    //计算偏移量
    if (th > 0) {
        gTopDayOffset = (th + 1) * 20;
    }

    //*********************************************************************
    //很fuck的地方！因为要根据全天里的事件高度计算左边“全天”那一行的高度
    //*********************************************************************

    if ($.browser.msie) {
        $(o + " .mind_clender_dates td").css({ "height": gTopDayOffset - 1 });
    }

    if ($.browser.mozilla) {
        $(o + " .mind_clender_dates td").css({ "height": gTopDayOffset + 1 });
    }

    $("#mcr ul li:eq(2)").css({ "height": gTopDayOffset - 2 });
    $("#mcr ul li:eq(2) div").css({ "height": gTopDayOffset - 17 });



    for (var i = 0; i < 7; i++) {
        var n = gDayCellArray[i].eventNum;
        if (n > 0) {
            gDayCellArray[i].eventTop = new Array(n);
        }
    }


    for (var ei = 0; ei < gDayDivArray.length; ei++) {

        var $eo = $("#" + gDayDivArray[ei].id);

        var _sox = ($eo.attr("sox") <= 0 ? 0 : $eo.attr("sox"));
        var _eox = ($eo.attr("eox") >= 6 ? 6 : $eo.attr("eox"));


        for (var l = 0; l < gDayCellArray[_sox].eventTop.length; l++) {

            if (gDayCellArray[_sox].eventTop[l] == undefined) {

                $eo.attr('curx', _sox * gEventBoxWidth);
                $eo.attr('cury', 23 * l);

                $eo.css({ "left": $eo.attr('curx') + 'px' });
                $eo.css({ "top": parseInt($eo.attr('cury')) + gTopOffset + 'px' });

                //计算宽度.....
                $eo.find(".title").css({ "width": (_eox - _sox + 1) * gEventBoxWidth - 43 + 'px' });

                for (var k = _sox; k <= _eox; k++) {
                    gDayCellArray[k].eventTop[l] = "-";
                }

                break;
            }
        }
    }
}


//**********************
//渲染小于24小时内的事件*
//**********************

function renderEvent(x) {

    //该天所有单元格的eventNum清0
    for (var y = 0; y < 48; y++) {
        gCellArray[x][y].eventNum = 0;
    }


    //重新计算eventNum
    for (var ei = 0; ei < gEventDivArray.length; ei++) {
        var $eo = $("#" + gEventDivArray[ei].id);
        var _ox = $eo.attr('ox');
        var _soy = $eo.attr('soy');
        var _eoy = $eo.attr('eoy');
        if (x == _ox) {
            for (var k = _soy; k <= parseInt(_eoy - 1); k++) {
                gCellArray[x][k].eventNum += 1;
            }
        }
    }


    // 计算每个“单元格”放几个事件
    for (var oy = 47; oy >= 0; oy--) {
        var n = gCellArray[x][oy].eventNum;
        if (n > 0) {
            for (var ei = 0; ei < gEventDivArray.length; ei++) {

                var $eo = $("#" + gEventDivArray[ei].id);
                var _ox = $eo.attr('ox');
                var _soy = $eo.attr('soy');
                var _eoy = $eo.attr('eoy');

                if (x == _ox) {
                    //单元格是否在该事件覆盖范围内?
                    if (_soy <= oy && oy <= parseInt(_eoy - 1)) {
                        //修改该事件会覆盖到的所有单元格的属性
                        for (var k = _soy; k <= parseInt(_eoy - 1); k++) {
                            if (gCellArray[x][k].eventNum < n) {
                                //该单元会放到几个事件？
                                gCellArray[x][k].eventNum = n;
                            }
                            //建立位置是否占用记录数组。
                            gCellArray[x][k].eventLeft = new Array(gCellArray[x][k].eventNum);
                        }
                    }
                }
            }
        }
    }


    for (var ei = 0; ei < gEventDivArray.length; ei++) {
        var $e = $("#" + gEventDivArray[ei].id);
        var _ox = $e.attr('ox');
        var _soy = $e.attr('soy');
        var _eoy = $e.attr('eoy');

        if (x == _ox) {
            var w = parseInt(gEventBoxWidth / gCellArray[x][_soy].eventNum);
            $e.width(w);

            for (var l = 0; l < gCellArray[x][_soy].eventLeft.length; l++) {
                if (gCellArray[x][_soy].eventLeft[l] == undefined) {

                    $e.attr('curx', x * gEventBoxWidth + l * w);
                    $e.attr('cury', _soy * 25);

                    $e.css({ "left": x * gEventBoxWidth + l * w + 'px' });

                    $e.css({ "top": _soy * 25 + gTopOffset + gTopDayOffset + 'px' });

                    //把占用位置写入数组 soy - eoy
                    for (var k = _soy; k <= _eoy - 1; k++) {
                        gCellArray[x][k].eventLeft[l] = "-";  //x * 120 + l * w;
                    }
                    break;
                }
            }
        }
    }
}

//=======================================================================================================================

function resetCell() {
    $("#newEventDiv").css({ "display": "none", "top": "0px", "left": "0px" });
}

//=======================================================================================================================
//删除鼠标操作事件
function unbindEvent() {
    //$(window).unbind(".cal");
    $(document).unbind(".cal");
    $(o + " #mcl table tbody tr td").unbind(".cal");
}

//=======================================================================================================================
//初始化日历

function calender_init(to) {
    o = to;
    $(o).addClass("mind_calender");


    $(o).append("<div id='mcl' class='mind_calender_left' unselectable='on' onselectstart='return false;'></div>");
    // $(o).append("<div id='mcr' class='mind_calender_right'></div>");


    $(o + " #mcl").html("<table  sytle='width:100%;' cellpadding='0' cellspacing='0'>" +
                            "<thead></thead>" +
                            "<tbody></tbody>" +
                         "</table>");

    //********
    //thead **
    //********

    var _html = "<tr class='mind_clender_date'>" +
                   "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>" +
                "</tr>";


    _html = _html + "<tr class='mind_clender_week'>" +
                    "<td><div><span>星期一</span><div></td>" +
                    "<td><div><span>星期二</span><div></td>" +
                    "<td><div><span>星期三</span><div></td>" +
                    "<td><div><span>星期四</span><div></td>" +
                    "<td><div><span>星期五</span><div></td>" +
                    "<td><div><span>星期六</span><div></td>" +
                    "<td><div><span>星期天</span><div></td>" +
                    "</tr>";

    _html = _html + "<tr class='mind_clender_dates'>" +
                     "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>" +
                     "</tr>";



    $(o + " #mcl table thead").html(_html);

    //********
    //tbody **
    //********

    _html = "";

    for (var i = 0; i < 48; i++) {
        _html = _html + "<tr>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "<td class='cell'></td>" +
                        "</tr>";
    };

    $(o + " #mcl table tbody").html(_html);


    $(o + " #mcl table tbody tr:nth-child(even) td").addClass("cell_even");
    $(o + " #mcl table tbody tr:nth-child(odd) td").addClass("cell_odd");
    //******


    //初始化 gDayCellArray&gCellArray
    for (var i = 0; i < 7; i++) {
        gCellArray[i] = new Array();
        for (var j = 0; j < 48; j++) {
            gCellArray[i][j] = { "eventNum": 0, "eventLeft": [] }
        }
        gDayCellArray[i] = { "eventNum": 0, "eventTop": [] }
    }

    updateCalenderThead(gCurYear, gCurMonth, gCurDate, gCurDay);



    //右边的时间框
    $("#mcr").append("<ul><li style='height:16px'><div></div></li>" +
                          "<li style='height:49px'><div></div></li>" +
                          "<li style='height:58px'><div>全天</div></li></ul>");


    for (var i = 0; i < 24; i++) {
        $("#mcr ul").append("<li><div>" + i + ":00</div></li>");
        if (i == gToday.getHours() + 1) {
            $("#mcr ul li:eq(" + i + ") div").css({ "background-color": "#FF9966" });
        }
    }




    $(o).append("<div id='newEventDiv'><div><img src='/images/addNewEventLogo.png'/>新事件</div></div>");

    //****************************
    //******* 浏览器 改变大小 ****
    //****************************

    /*  $(window).bind("resize.cal", function () {

    for (var ei = 0; ei < gEventDivArray.length; ei++) {
    var $eo = $("#" + gEventDivArray[ei].id);
    $eo.css({ "left": $eo.attr("curx") + 'px',
    "top": $eo.attr("cury") + gTopOffset + gTopDayOffset + 'px'
    });
    }

    for (var ei = 0; ei < gDayDivArray.length; ei++) {
    var $eo = $("#" + gEventDivArray[ei].id);
    $eo.css({ "left": $eo.attr("curx") + 'px',
    "top": $eo.attr("cury") + gTopOffset + 'px'
    });
    }

    });*/


    //****************************
    //****** 浏览器 鼠标按下 *****
    //****************************

    $(document).bind("mousedown.cal", function (e) {

        if ($("#mcl table").length == 0)
            return false;

        clearAllEventWnd();
    });

    //****************************
    //***** 浏览器 鼠标移动 *******
    //****************************

    $(document).bind("mousemove.cal", function (e) {




        if ($("#mcl table").length == 0 || gOwnerId != gUserId)
            return false;

        //全局
        var tx = e.pageX - $(o + " #mcl table").offset().left
        var ty = e.pageY - gTopOffset - gTopDayOffset - $(o + " #mcl table").offset().top;

        ox = parseInt(tx / gEventBoxWidth);
        oy = parseInt(ty / 25);


        //拖动超过24小时跨天事件
        if ($teo) {

            bMove = true;

            var _sox = parseInt($teo.attr('sox'));
            var _eox = parseInt($teo.attr('eox'));

            if (ox < 7 && ox >= 0) {

                //新的开始与结束单元号
                var _nsox = _sox + (ox - sox);

                //ox-sox:判断鼠标向哪个方向移动了多少格。
                var _neox = _eox + (ox - sox);

                //var _dis = _neox - _nsox + 1;
                if (_nsox < 0)
                    _nsox = 0;

                if (_neox > 6)
                    _neox = 6;

                $teo.css({ "left": _nsox * gEventBoxWidth + 'px' });
                $teo.find(".title").css({ "width": (_neox - _nsox + 1) * gEventBoxWidth - 43 + 'px' });

            }
        }

        //拖动事件Div
        if ($meo) {

            bMove = true;

            $meo.css({ "z-index": 999 });
            $meo.width(gEventBoxWidth);

            var _soy = parseInt($meo.attr('soy'));
            var _eoy = parseInt($meo.attr('eoy'));

            var _color = $meo.attr('color');

            //**********************

            gTimeDis = _eoy - _soy;

            //有没有 eid
            var _tid = $meo.attr('eid');

            if (_tid != "-") {
                gTimeDis = parseInt(gTimeDis) + parseInt($("#" + _tid).attr('eoy'));
                $("#" + _tid).css({ "display": "none" });
            }

            //**********************


            //鼠标点击偏移量
            oy = oy + gMSoyDis;


            if (oy < 48 && oy >= 0 && ox < 7 && ox >= 0) {

                $meo.css({ "left": ox * gEventBoxWidth + 'px' });
                $meo.css({ "top": oy * 25 + gTopOffset + gTopDayOffset + 'px' });

                var _sd = parseInt(oy / 2) + ":" + (oy % 2 == 1 ? "30" : "00").toString();
                var _ed = parseInt((oy + gTimeDis) / 2) + ":" + ((oy + gTimeDis) % 2 == 1 ? "30" : "00").toString();

                //拖到超出表格的底部
                if (oy + gTimeDis - 1 > 47) {

                    if ($('#tempEvent').length == 0) {
                        $(o).append("<div id='tempEvent' eoy='0' class='event_box'>" +
                                    "<div class='time'></div>" +
                                    "<div class='title'></div>" +
                                    "<div class='drag'>=</div>" +
                                    "</div>");

                        $('#tempEvent').css({ "display": "block" });

                        //临时事件的颜色跟主颜色统一
                        $("#tempEvent .time").css({ "background-color": _color });
                        $("#tempEvent .title").css({ "background-color": _color });
                        $("#tempEvent .drag").css({ "background-color": _color });
                        $("#tempEvent .time").css({ "filter": "alpha(opacity=70)" });

                    }

                    //计算拖动事件的高度
                    $meo.find(".title").height((47 - oy + 1) * 25 - 24 + 'px');

                    //************
                    //临时事件相关

                    //位置

                    //x
                    $('#tempEvent').css({ "left": (ox + 1) * gEventBoxWidth + $(o + " #mcl table").offset().left + 'px' });
                    //y
                    $('#tempEvent').css({ "top": gTopOffset + gTopDayOffset + 'px' }); //oy * 25 +

                    //跨天：超出这个星期的不显示
                    if (ox + 1 >= 7) {
                        $('#tempEvent').css({ "display": "none" });
                    }
                    else {
                        $('#tempEvent').css({ "display": "block" });
                    }

                    //这句是测试的
                    //$('#tempEvent .title').html(gTopTableOffset + "+" + gTopOffset + "=" + (gTopTableOffset + gTopOffset));


                    //临时事件的高度
                    var _h = gTimeDis - (47 - oy) - 1;


                    //$meo.find(".time").html(h);

                    //计算高度
                    $('#tempEvent').find(".title").height(_h * 25 - 24 + 'px');



                    //计算显示结束时间
                    _ed = cellToTime(_h);


                    //时间跨度与标题

                    // $('#tempEvent .title').html($meo.find(".title").html());

                    $('#tempEvent .time').html(_sd + " - " + _ed);
                    $('#tempEvent').attr("eoy", _h);

                    //************



                }
                else {

                    if ($('#tempEvent').length > 0) {
                        $('#tempEvent').remove();
                        $meo.find(".title").height((gTimeDis) * 25 - 24 + 'px');
                    }

                    //计算显示结束时间
                    _ed = cellToTime(oy + gTimeDis);
                }

                $meo.find(".time").html(_sd + "～" + _ed);
            }
        }

        //拉动事件Div
        if ($deo) {

            bMove = true;

            var _soy = parseInt($deo.attr('soy'));

            if (oy >= _soy && oy < 48) {


                $deo.attr("eoy", oy);

                $deo.find(".title").height((oy - _soy + 1) * 25 - 24 + 'px');

                var sd = cellToTime(_soy);
                var ed = cellToTime(oy + 1);


                // $deo.find(".time").html(sd + "～" + ed);
                $deo.find(".time").html(oy + "/" + _soy);

            }
        }
    });


    //**************************
    //******浏览器鼠标放开*******
    //**************************

    $(document).bind("mouseup.cal", function (e) {

        if ($("#mcl table").length == 0 || gOwnerId != gUserId)
            return false;

        if ($teo) {

            eox = ox;

            var _sox = parseInt($teo.attr('sox'));
            var _eox = parseInt($teo.attr('eox'));

            if (eox > 6) {
                eox = 6;
            }

            if (eox < 0) {
                eox = 0
            }

            // if (ox < 7 && ox >= 0) {

            //                //新的开始与结束单元号
            //                var _nsox = _sox + (ox - sox); //ox-sox:判断鼠标向哪个方向移动了多少格。
            //                var _neox = _eox + (ox - sox);

            //                //   var _dis = _neox - _nsox + 1;

            //                if (_nsox < 0)
            //                    _nsox = 0;

            //                if (_neox > 6)
            //                    _neox = 6;

            //                $teo.css({ "left": _nsox * 120 + $(o + " #mcl table").offset().left + 'px' });
            //                $teo.find(".title").css({ "width": (_neox - _nsox + 1) * 120 - 43 + 'px' });

            //-------------------------
            //开始日期

            var _st = $teo.attr('st');
            var _et = $teo.attr('et');

            var _sd;
            _sd = new Date(gWeekDateArray[0] + " " + _st);
            _sd = new Date(_sd.getFullYear(),
                           _sd.getMonth(),
                           _sd.getDate() + _sox + (eox - sox));

            var _ed;
            _ed = new Date(gWeekDateArray[0] + " " + _et);
            _ed = new Date(_ed.getFullYear(),
                           _ed.getMonth(),
                           _ed.getDate() + _eox + (eox - sox));

            // }



            //-------------------------
            var a = {
                "id": $teo.attr('id'),
                "sDate": gMonths[_sd.getMonth()].en + " " + _sd.getDate() + "," + _sd.getFullYear() + " " + _st,
                "eDate": gMonths[_ed.getMonth()].en + " " + _ed.getDate() + "," + _ed.getFullYear() + " " + _et,
                "title": $teo.find("span").html()
            }

            updateEventToDb(a);
            //updateEvent(a);
            //-------------------------

            $teo = null;

        }


        //拖动事件Div
        if ($meo != null && bMove) {

            eox = ox;

            if (oy < 48 && oy >= 0 && eox < 7 && eox >= 0) {

                $meo.css({ "z-index": 1 });

                var _sd = cellToTime(oy);
                var _ed = new Date(gWeekDateArray[eox] + " " + _sd);

                var _h = _ed.getHours() + parseInt(gTimeDis / 2);
                var _m = _ed.getMinutes() + parseInt(gTimeDis % 2 == 0 ? 0 : 30);


                //时间加法
                _ed = new Date(_ed.getFullYear(),
                               _ed.getMonth(),
                               _ed.getDate(),
                               _h,
                               _m);

                //删除临时事件
                if ($('#tempEvent').length > 0)
                    $('#tempEvent').remove();

                var a = {
                    "id": $meo.attr('id'),
                    "sDate": gWeekDateArray[eox] + " " + _sd + ":00",
                    "eDate": gMonths[_ed.getMonth()].en + " " + _ed.getDate() + "," + _ed.getFullYear() + " " + _ed.getHours() + ":" + _ed.getMinutes(),
                    "title": $meo.find(".title").html()
                }

                updateEventToDb(a);
                //updateEvent(a);
            }
            $meo = null;
        }


        //拉动事件Div
        if ($deo != null && bMove) {

            eox = $deo.attr('ox');

            var _soy = parseInt($deo.attr('soy'));

            var _id;
            var _sid = $deo.attr("sid");

            var _eoy = $deo.attr('eoy');

            var _sd = parseInt($deo.attr('soy') / 2) + ":" + ($deo.attr('soy') % 2 == 1 ? "30" : "00").toString();


            //------------

            var _sh = parseInt((_eoy + 1) / 2);

            var _x = eox;

            //如果是12点钟，那就是第二天了。
            if (_sh == 24) {
                _x = parseInt(_x) + 1;
            }


            _id = (_sid != "-" ? _id : $deo.attr('id'));

            var _ed = (_sh == 24 ? "00" : _sh) + ":" + ((_eoy + 1) % 2 == 1 ? "30" : "00").toString();



            //*****************************************
            //这里开始日期不需要更新....使用接口时需要注意

            var a = { "id": _id,
                "eDate": gWeekDateArray[_x] + " " + _ed + ":00"
            }

            updateEventEdateToDb(a);

            //updateEvent(a);

            //*****************************************

            $deo = null;

        }
    });


    $(o + " #mcl table tbody tr td").bind("mousemove.cal", function (e) {

    });



    //**************************
    //*******表格鼠标放开*******
    //**************************

    $(o + " #mcl table tbody tr td").bind("mouseup.cal", function (e) {

        if (gOwnerId != gUserId)
            return false;


        if ($deo == null && $meo == null && $teo == null) {
            cox = ox;
            coy = oy;

            //$("#Select1 option[index=" + coy + "]").attr('selected', true);
            //$("#Select1").change();

            var x = ox * gEventBoxWidth;
            var y = oy * 25;

            $("#newEventWnd").show();
            var td = new Date(gWeekDateArray[cox]);

            var _sh = (parseInt((coy) / 2) == 24 ? "00" : parseInt((coy) / 2)) + ":" + ((coy) % 2 == 1 ? "30" : "00").toString();

            var _eh = (parseInt((coy + 1) / 2) == 24 ? "00" : parseInt((coy + 1) / 2)) + ":" + ((coy + 1) % 2 == 1 ? "30" : "00").toString();

            $("#newEventWnd span").html(td.getFullYear() + "年" +
                                        gMonths[td.getMonth()].cn + td.getDate() + "日(周" + gDays[cox] + ")，" +
                                        _sh + " — " + _eh);

            //newEventWnd position
            $("#newEventWnd").css({ "left": x + $(o + " #mcl table").offset().left - $("#newEventWnd").width() / 2 + 50 + "px" });
            $("#newEventWnd").css({ "top": y + gTopOffset + gTopDayOffset - 150 + gTableTopOffset + "px" });

            //日期初始化
            var _td = new Date(gWeekDateArray[cox]);

            //wyh 程序使用
            $("#cdty").val(_td.getFullYear());
            $("#cdtm").val(_td.getMonth() + 1);
            $("#cdtd").val(_td.getDate());
            $("#cdtbt").val(_sh);
            $("#cdtet").val(_eh);


            //need show arrow?
            //$("#newEventWnd .arraw_down").css({ "display": "none" });

            //about talbe
            //   $(o + " #mcl table tbody tr:eq(" + coy + ") td:eq(" + cox + ")").css({ "background-color": "#999999" });
            // $(o + " #mcl table tbody tr:eq(" + coy + ") td:eq(" + cox + ")").html("新事件");

            $("#newEventDiv").css({ "top": y + gTopOffset + gTopDayOffset + gTableTopOffset + "px",
                "left": x + $(o + " #mcl table").offset().left + "px",
                "display": "block"
            });
        }
    });



    $("#newEventWnd .content").mousedown(function (e) {
        e.stopPropagation();
    });

    $("#newEventWnd .content").mouseup(function (e) {
        e.stopPropagation();
    });


    $("#newEventWnd .content").mousemove(function (e) {
        e.stopPropagation();
    });
    //==================================

    $("#cancelCreateEventBt").mouseup(function (e) {
        e.stopPropagation();
    });

    //==================================
    $("#eventWnd .content").mousedown(function (e) {
        e.stopPropagation();
    });

    $("#eventWnd .content").mouseup(function (e) {
        e.stopPropagation();
    });

    $("#eventWnd .content").mousemove(function (e) {
        e.stopPropagation();
    });

    //==================================
    for (var i = 0; i < 47; i++) {
        var x = parseInt(i / 2);
        if (x < 10)
            $("#Select1").append("<option>0" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
        else
            $("#Select1").append("<option>" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
    }

    for (var i = 1; i < 48; i++) {
        var x = parseInt(i / 2);
        if (x < 10)
            $("#Select2").append("<option>0" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
        else
            $("#Select2").append("<option>" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
    }

    $("#Select1").change(function () {
        $("#Select2").find("option").remove();
        for (var i = $("#Select1").attr("selectedIndex") + 1; i < 48; i++) {
            var x = parseInt(i / 2);
            if (x < 10)
                $("#Select2").append("<option>0" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
            else
                $("#Select2").append("<option>" + x + ":" + (i % 2 == 0 ? "00" : "30") + "</option>");
        }
    });
}