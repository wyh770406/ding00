$(function () {
getToday("Aug 12 ,2010 8:30:00", "Aug 12 ,2010 8:30:00");

    calender_init("#tt");


   // unbindEvent();    
    
    getEvents(tempArray);

    $("#next").click(function(e) {
        nextWeek();
    });



    $("#prev").click(function(e) {
        prevWeek();
    });



    $("#today").click(function(e) {
        showToday();
    });


    $("#add").click(function(e) {
        addEvent({
            "id": "e5",
            "title": "退休",
            "sDate": "Aug 12,2010 8:30:00",
            "eDate": "Aug 12,2010 10:30:00"
        });
    });


    $("#createEventBt").click(function(e) {
        resetCell();
        $("#newEventWnd").hide();

    });
    $("#createFrm").submit(function(e){
      $.ajax({data:$.param($(this).serializeArray()) + '&amp;authenticity_token=' + encodeURIComponent(authenticity_token),
        dataType:'json',
        type:'post',
        async:true,
        success:function(request){
          clearAllEventWnd();
          addEvent(request.events[0]);

        },
        failure:function(){
          alert('添加事件失败');
        },
        url:'/events/quick_create'});
      return false;
    });


    $("#cancelCreateEventBt").click(function(e) {
        resetCell();
        $("#newEventWnd").hide();

    });


    $("#delBt").click(function(e) {
        delEvent("e4");
    });
    });