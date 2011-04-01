module CustomJson

  protected
  def get_avatar(user)
    user.avatar_url

  end

  def get_current_user_json
    @result=""

    if logged_in?

      @avatar = get_avatar(current_user)#(current_user.avatar.url(:thumb)!="/avatars/thumb/missing.png") ? current_user.avatar.url(:thumb):'/images/headpic/default.jpg'
      @result='{"id":"'+current_user.id.to_s+'","name":"'+current_user.real_name+'","avatar":"'+@avatar+'","newMsgCount":"'+current_user.newmsgcount.to_s+'","newCommentCount":"'+current_user.newcommentcount.to_s+'","newSystemCount":"'+current_user.newsystemcount.to_s+'"}'
    end
    @result
  end
  
  def get_week_fdate(dt)
    w = dt.wday
    fd = dt-w+1
    if (w==0)
      fd=fd-7
    end

    @eventy = fd.year
    @eventm = fd.month
    @eventd = fd.day
  end

      JS_ESCAPE_MAP = {
        '\\'    => '\\\\',
        '</'    => '<\/',
        "\r\n"  => '\n',
        "\n"    => '\n',
        "\r"    => '\n',
        '"'     => '\\"',
        "'"     => "\\'" }

  def to_convert_json(str_object, options = {})
    # modobj = Object.const_get(str_object)
    @result=""
    case str_object
    when "Communication"
      @communications=options[:obja]

      if @communications.size>0
        @communications.each do |communication|
          #     @mcount = Communication.count(:conditions=>["parent_id=?",communication.parent_id])
          @sjson='{"id":"'+communication.id.to_s+'","uid":"'+communication.sender_id.to_s+'","uDate":"'+communication.format_created_at+'","uName":"'+communication.format_sender_name+'","uAvatar":"'+communication.format_sender_avatar+'","uMsg":"'+communication.content+'","sid":"'+communication.parent_id.to_s+'","mCount":"'+communication.mcount.to_s+'"}'
          @result=@result+@sjson+','
        end  unless @communications.nil?

        jslen=@result.length
        @result_trunc=@result[0,jslen-1]

        @result_trunc = '{"recordCount":"'+options[:total_communication]+'"},' + @result_trunc

        @result='{"communications":['+@result_trunc+']}'
      end

    when "User"
      @users=options[:obja]

      if @users.size>0
        @users.each do |user|
          @sjson='{"id":"'+user.id.to_s+'","name":"'+user.real_name+'"}'
          @result=@result+@sjson+','
        end  unless @users.nil?

        jslen=@result.length
        @result_trunc=@result[0,jslen-1]

        @result='{"users":['+@result_trunc+']}'
      end
    when "Event"

      @events=options[:obja]

      if @events.size>0
        @events.each do |event|
          @event_color=(event.color.nil? ? "":event.color)
          @sjson='{"id":"'+event.id.to_s+'","title":"'+event.title+'","description":"'+event.description.gsub(/(\\|<\/|\r\n|[\n\r"'])/) { JS_ESCAPE_MAP[$1] }+'","owner_id":"'+event.user_id.to_s+'","user_id":"'+current_user.id.to_s+'","color":"'+@event_color+'","sDate":"'+event.begin_datetime+'","eDate":"'+event.end_datetime+'"}'
          @result=@result+@sjson+','
        end unless @events.nil?
      
        jslen=@result.length
        @result_trunc=@result[0,jslen-1]

        @result='{"events":['+@result_trunc+']}'
      end
    end
    @result
  end
end
