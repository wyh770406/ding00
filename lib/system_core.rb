require 'RMagick'
require 'person_mailer'
include Magick
module WeekFormated
	NAMES_OF_WEEK = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
	
	def name_of_week(day)
		day = 7 if day == 0
		NAMES_OF_WEEK[day - 1] if day >= 1 && day <= 7
	end
end

module FolderImgfilelist
  def imgf_name_list(folder_name)
    if  File.directory?(Dir.pwd+folder_name)
      @result=""
      Dir.foreach(Dir.pwd+folder_name) { |x|
        file_path = Dir.pwd+folder_name+"/"+x
        if File.exists?(file_path)
          fext = File.extname(file_path)
          if fext==".jpg" || fext==".png" || fext==".gif"
            image = Magick::Image::read(file_path).first
            img_height = image.rows.to_s
            img_width = image.columns.to_s
            img_size = File.size(file_path).to_s
            imgf_name = File.basename(file_path, fext)
            imgf_url = (folder_name+"/"+x).gsub("/public","")
            @sjson='{"name":"'+imgf_name+'","width":'+img_width+',"height":'+img_height+',"size":'+img_size+',"url":"'+imgf_url+'"}'
            @result=@result+@sjson+','
          end

        end

      }
      jslen=@result.length
      @result_trunc = ""
      @result_trunc=@result[0,jslen-1] unless @result[0,jslen-1].nil?

      @result='{"images":['+@result_trunc+']}'
    end
  end

  def json_event_status(event_id)
    @result=""

    @current_user = self.current_user
    @event = Event.find(event_id)

    @bool_favorited = @event.be_favorited?(@current_user)
    @bool_invited = @event.be_invited?(@current_user)

    #@bool_refused = (@event.status_selected(@current_user)==EventInvitation::REFUSE) ? true:false
    @event_invited_status=case @event.status_selected(@current_user)
    when EventInvitation::REFUSE
      "refused"
    when EventInvitation::ACCEPT
      "accepted"
    when EventInvitation::PENDING
      "pending"
    else
      ""
    end
    
    @sjson='{"favorited":"'+@bool_favorited.to_s+'","invitated":"'+@bool_invited.to_s+'","invited_status":"'+@event_invited_status+'"}'
    @result = @sjson
  end

  def json_type_notification
    @result=""
    @current_user = self.current_user
    @notification_types = NotificationType.find(:all)
    @notification_types.each do |notification_type|
      @sjson='{"type":"'+notification_type.notification_remark+'","iconCls":"'+notification_type.icon_class+'","count":"'+notification_type.count_by_type(@current_user.id).to_s+'","action":"/notifications/view_detail/'+notification_type.code+'","ignore":"/notifications/ignore_detail/'+notification_type.code+'"}'
      @result=@result+@sjson+','
    end

    jslen=@result.length
    @result_trunc = ""
    @result_trunc=@result[0,jslen-1] unless @result[0,jslen-1].nil?

    @result='{"notifications":['+@result_trunc+']}'
  end

  def json_event_invitation(page_options = {})
    @result=""
    @actions=""
    @current_user = self.current_user
    @user_event_invitations = EventInvitation.find_event_invitations(@current_user.id, page_options )
    @user_event_invitations.each do |event_invitation|
      @event_creator = event_invitation.event.user
      @event_invitation_event = event_invitation.event
      case event_invitation.status
      when EventInvitation::REFUSE
        @actions='"actions":[{"text":"参加","url":"/events/attending_to_event/'+@event_invitation_event.id.to_s+'"}]'
      when EventInvitation::ACCEPT
        @actions='"actions":[{"text":"反悔","url":"/events/back_to_event/'+@event_invitation_event.id.to_s+'"}]'
      when EventInvitation::PENDING
        @actions='"actions":[{"text":"接受邀请","url":"/events/attending_to_event/'+@event_invitation_event.id.to_s+'"},{"text":"拒绝邀请","url":"/events/refuse_to_event/'+@event_invitation_event.id.to_s+'"}]'
      else
      end
      if @event_invitation_event.address.strip==""
        @event_invitation_event_address="暂无"
      else
        @event_invitation_event_address=@event_invitation_event.address
      end
      @sjson='{"id":"'+event_invitation.id.to_s+'","username":"'+@event_creator.name+'","userid":"'+@event_creator.id.to_s+'","avatarurl":"'+@event_creator.avatar_url+'","eventtitle":"'+@event_invitation_event.title+'","eventid":"'+@event_invitation_event.id.to_s+'","begin_date":"'+@event_invitation_event.begin_sdt+'","end_date":"'+@event_invitation_event.end_sdt+'","address":"'+@event_invitation_event_address+'",'+@actions+'}'
      @result=@result+@sjson+','
    end

    jslen=@result.length
    @result_trunc = ""
    @result_trunc=@result[0,jslen-1] unless @result[0,jslen-1].nil?

    @result='{"comments":['+@result_trunc+']}'
  end
end

module SendNotification
  protected
  def build_notification(send_obj,type_code)
    case type_code
    when NotificationType::EVENT
      arr_invited_ids = send_obj.invitations.split(",")
      arr_invited_ids.each  do |invited_id|
        opts={:user_id=>send_obj.user_id,:recipient_id=>invited_id,:notification_type_id=>NotificationType.notification_code(type_code),:remark=>send_obj.id}
        if save_notiflag(opts)
          Notification.save_notification opts
          @user=User.find(invited_id)
          logger.info "EMAIL:{#{@user.email}},TITLE:#{send_obj.title}"
          PersonMailer.delay.deliver_event_invitation(@user.email,send_obj)
        end
      end

    when NotificationType::COMMENT
      if !send_obj.notify_user.nil?
        opts={:user_id=>send_obj.commenter_id,:recipient_id=>send_obj.notify_user,:notification_type_id=>NotificationType.notification_code(type_code),:remark=>send_obj.id}
        if save_notiflag(opts)
          Notification.save_notification opts
        end
      end

    when NotificationType::MESSAGE
      opts={:user_id=>send_obj.send_id,:recipient_id=>send_obj.recv_id,:notification_type_id=>NotificationType.notification_code(type_code),:remark=>send_obj.id}
      if save_notiflag(opts)
        Notification.save_notification opts
      end
    else

    end
  end

  private
  def save_notiflag(notif_opts={})
    begin
      @notif=Notification.find_by_user_id_and_recipient_id_and_notification_type_id_and_remark(notif_opts[:user_id],notif_opts[:recipient_id],notif_opts[:notification_type_id],notif_opts[:remark])
    rescue  ActiveRecord::RecordNotFound
      @notif=nil
    end

    if @notif.nil?
      return true
    else
      return false
    end
  end
end

module PasswordResethc
  protected
  def send_password_reset_cookie!(the_user)
    cookies[:pwd_reset_auth_token] = {
      :value   => the_user.password_reset_token,
      :expires => the_user.password_reset_token_expires_at }

  end

  def handle_password_reset_cookie!(the_user)
    case
    when valid_password_reset_cookie?(the_user) then the_user.refresh_password_reset_token # keeping same expiry date
    else                             the_user.rem_password_reset
    end

    send_password_reset_cookie!(the_user)
  end

  def valid_password_reset_cookie?(the_user)
    (the_user.password_reset_exp_token?) &&
      (cookies[:pwd_reset_auth_token] == the_user.password_reset_token)
  end
end